import express from 'express'
import { getPool } from '../config/database.js'
import { comparePassword, generateResetToken, generateToken, hashPassword, hashResetToken } from '../utils/auth.js'
import { isEmailConfigured, sendPasswordResetEmail } from '../services/email.js'

const router = express.Router()
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body || {}
    const normalizedName = String(name || '').trim()
    const normalizedEmail = String(email || '').trim().toLowerCase()

    if (!normalizedName || !normalizedEmail || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Name, email, and password are required.' })
    }

    if (!emailPattern.test(normalizedEmail)) {
      return res.status(400).json({ message: 'Enter a valid email address.' })
    }

    if (!passwordPattern.test(password)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters and include uppercase, lowercase, and a number.' })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' })
    }

    const pool = getPool()
    if (!pool) {
      return res.status(500).json({ message: 'Database is not initialized.' })
    }

    const [existingUsers] = await pool.query('SELECT id FROM users WHERE email = ?', [normalizedEmail])

    if (existingUsers.length > 0) {
      return res.status(409).json({ message: 'An account with this email already exists.' })
    }

    const passwordHash = await hashPassword(password)
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [normalizedName, normalizedEmail, passwordHash, 'user']
    )

    const user = {
      id: result.insertId,
      name: normalizedName,
      email: normalizedEmail,
      role: 'user',
    }

    return res.status(201).json({
      message: 'Account created successfully.',
      user,
    })
  } catch (error) {
    console.error('Register error:', error)
    return res.status(500).json({ message: 'Unable to create account.' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {}

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' })
    }

    if (!emailPattern.test(String(email).trim())) {
      return res.status(400).json({ message: 'Enter a valid email address.' })
    }

    const pool = getPool()
    if (!pool) {
      return res.status(500).json({ message: 'Database is not initialized.' })
    }

    const normalizedEmail = String(email).trim().toLowerCase()
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [normalizedEmail])
    const user = rows[0]

    if (!user || !user.is_active) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    const passwordMatches = await comparePassword(password, user.password_hash)
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    })

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ message: 'Login failed. Please try again.' })
  }
})

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body || {}

    const normalizedEmail = String(email || '').trim().toLowerCase()
    if (!emailPattern.test(normalizedEmail)) {
      return res.status(400).json({ message: 'Enter a valid email address.' })
    }

    const pool = getPool()
    if (!pool) {
      return res.status(500).json({ message: 'Database is not initialized.' })
    }

    const [rows] = await pool.query('SELECT id, name, email FROM users WHERE email = ? AND is_active = 1', [normalizedEmail])

    if (rows.length === 0) {
      return res.json({
        message: 'If an account exists for this email, a reset link has been generated.',
      })
    }

    const token = generateResetToken()
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000)
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${token}`

    await pool.query('DELETE FROM password_reset_tokens WHERE user_id = ?', [rows[0].id])
    await pool.query(
      'INSERT INTO password_reset_tokens (user_id, token_hash, expires_at, used_at) VALUES (?, ?, ?, NULL)',
      [rows[0].id, hashResetToken(token), expiresAt]
    )

    if (isEmailConfigured()) {
      try {
        await sendPasswordResetEmail({ to: rows[0].email, name: rows[0].name, resetUrl })
      } catch (error) {
        console.error('Password reset email error:', error)
        await pool.query('DELETE FROM password_reset_tokens WHERE user_id = ?', [rows[0].id])
        return res.status(503).json({ message: 'Password reset email delivery is temporarily unavailable.' })
      }
    } else if (process.env.NODE_ENV === 'production' || process.env.RESET_LINK_EXPOSE_DEV !== 'true') {
      await pool.query('DELETE FROM password_reset_tokens WHERE user_id = ?', [rows[0].id])
      return res.status(503).json({ message: 'Password reset email delivery is not configured.' })
    }

    const response = {
      message: 'If an account exists for this email, a reset link has been generated.',
    }

    if (!isEmailConfigured() && process.env.NODE_ENV !== 'production' && process.env.RESET_LINK_EXPOSE_DEV === 'true') {
      response.resetUrl = resetUrl
    }

    return res.json(response)
  } catch (error) {
    console.error('Forgot password error:', error)
    return res.status(500).json({ message: 'Unable to process password reset.' })
  }
})

router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body || {}

    if (!token || !password) {
      return res.status(400).json({ message: 'Reset token and new password are required.' })
    }

    if (!passwordPattern.test(String(password))) {
      return res.status(400).json({ message: 'Password must be at least 8 characters and include uppercase, lowercase, and a number.' })
    }

    const pool = getPool()
    if (!pool) {
      return res.status(500).json({ message: 'Database is not initialized.' })
    }

    const [rows] = await pool.query(
      'SELECT id, user_id FROM password_reset_tokens WHERE token_hash = ? AND used_at IS NULL AND expires_at > NOW()',
      [hashResetToken(token)]
    )

    if (rows.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired reset token.' })
    }

    const userId = rows[0].user_id
    const passwordHash = await hashPassword(password)

    const connection = await pool.getConnection()
    try {
      await connection.beginTransaction()
      const [claimed] = await connection.query(
        'UPDATE password_reset_tokens SET used_at = NOW() WHERE id = ? AND used_at IS NULL AND expires_at > NOW()',
        [rows[0].id]
      )
      if (claimed.affectedRows !== 1) {
        await connection.rollback()
        return res.status(400).json({ message: 'Invalid or expired reset token.' })
      }
      await connection.query('UPDATE users SET password_hash = ? WHERE id = ?', [passwordHash, userId])
      await connection.commit()
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }

    return res.json({ message: 'Password reset successfully.' })
  } catch (error) {
    console.error('Reset password error:', error)
    return res.status(500).json({ message: 'Unable to reset password.' })
  }
})

router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully.' })
})

router.get('/me', async (req, res) => {
  try {
    const { user } = req
    if (!user) {
      return res.status(401).json({ message: 'Authentication required.' })
    }

    const pool = getPool()
    const [rows] = await pool.query('SELECT id, name, email, role, is_active FROM users WHERE id = ?', [user.id])
    const account = rows[0]

    if (!account || !account.is_active) {
      return res.status(404).json({ message: 'User not found.' })
    }

    return res.json({
      user: {
        id: account.id,
        name: account.name,
        email: account.email,
        role: account.role,
      }
    })
  } catch (error) {
    console.error('Me error:', error)
    return res.status(500).json({ message: 'Unable to load profile.' })
  }
})

export default router
