import express from 'express'
import { getPool } from '../config/database.js'
import { hashPassword } from '../utils/auth.js'

const router = express.Router()
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
const validRoles = new Set(['admin', 'user'])

const validateUserInput = ({ name, email, password, role }) => {
  if (!String(name || '').trim() || !email || !password || !validRoles.has(role)) {
    return 'Name, email, password, and a valid role are required.'
  }
  if (!emailPattern.test(String(email).trim().toLowerCase())) {
    return 'Enter a valid email address.'
  }
  if (!passwordPattern.test(password)) {
    return 'Password must be at least 8 characters and include uppercase, lowercase, and a number.'
  }
  return null
}

router.get('/', async (req, res) => {
  try {
    const pool = getPool()
    const [users] = await pool.query(
      'SELECT id, name, email, role, is_active, createdAt, updatedAt FROM users ORDER BY id DESC'
    )
    return res.json(users)
  } catch (error) {
    console.error('Admin users list error:', error)
    return res.status(500).json({ message: 'Unable to load users.' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body || {}
    const validationError = validateUserInput({ name, email, password, role })
    if (validationError) return res.status(400).json({ message: validationError })

    const normalizedEmail = String(email).trim().toLowerCase()
    const pool = getPool()
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [normalizedEmail])
    if (existing.length > 0) {
      return res.status(409).json({ message: 'An account with this email already exists.' })
    }

    const passwordHash = await hashPassword(password)
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password_hash, role, is_active) VALUES (?, ?, ?, ?, 1)',
      [String(name).trim(), normalizedEmail, passwordHash, role]
    )

    return res.status(201).json({
      id: result.insertId,
      name: String(name).trim(),
      email: normalizedEmail,
      role,
      is_active: 1,
    })
  } catch (error) {
    console.error('Admin user create error:', error)
    return res.status(500).json({ message: 'Unable to create user.' })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const userId = Number(req.params.id)
    const { name, email, password, role, is_active: isActive } = req.body || {}

    if (!userId || !String(name || '').trim() || !email || !validRoles.has(role) || !emailPattern.test(String(email).trim().toLowerCase())) {
      return res.status(400).json({ message: 'Name, email, and a valid role are required.' })
    }
    if (password && !passwordPattern.test(password)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters and include uppercase, lowercase, and a number.' })
    }
    if (userId === req.user.id && (role !== 'admin' || Number(isActive) !== 1)) {
      return res.status(400).json({ message: 'You cannot remove your own administrator access or deactivate yourself.' })
    }

    const normalizedEmail = String(email).trim().toLowerCase()
    const pool = getPool()
    const [result] = await pool.query(
      `UPDATE users
       SET name = ?, email = ?, role = ?, is_active = ?${password ? ', password_hash = ?' : ''}
       WHERE id = ?`,
      password
        ? [String(name).trim(), normalizedEmail, role, Number(isActive) === 1 ? 1 : 0, await hashPassword(password), userId]
        : [String(name).trim(), normalizedEmail, role, Number(isActive) === 1 ? 1 : 0, userId]
    )

    if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found.' })
    const [rows] = await pool.query(
      'SELECT id, name, email, role, is_active, createdAt, updatedAt FROM users WHERE id = ?',
      [userId]
    )
    return res.json(rows[0])
  } catch (error) {
    console.error('Admin user update error:', error)
    if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'That email is already in use.' })
    return res.status(500).json({ message: 'Unable to update user.' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const userId = Number(req.params.id)
    if (!userId || userId === req.user.id) {
      return res.status(400).json({ message: 'You cannot delete your own account.' })
    }
    const pool = getPool()
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [userId])
    if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found.' })
    return res.json({ message: 'User deleted successfully.' })
  } catch (error) {
    console.error('Admin user delete error:', error)
    return res.status(500).json({ message: 'Unable to delete user.' })
  }
})

export default router
