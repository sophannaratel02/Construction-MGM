import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET || 'construction-management-secret-key-change-me'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h'

export function hashPassword(password) {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex')
    crypto.scrypt(password, salt, 64, (error, derivedKey) => {
      if (error) return reject(error)
      resolve(`${salt}:${derivedKey.toString('hex')}`)
    })
  })
}

export function comparePassword(password, hashedPassword) {
  return new Promise((resolve, reject) => {
    const [salt, storedHash] = hashedPassword.split(':')
    if (!salt || !storedHash) return resolve(false)

    crypto.scrypt(password, salt, 64, (error, derivedKey) => {
      if (error) return reject(error)
      resolve(crypto.timingSafeEqual(Buffer.from(storedHash, 'hex'), derivedKey))
    })
  })
}

export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function generateResetToken() {
  return crypto.randomBytes(32).toString('hex')
}

export function hashResetToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex')
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET)
}
