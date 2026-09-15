import { getPool } from '../config/database.js'

export function requireRoles(...allowedRoles) {
  return async (req, res, next) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ message: 'Authentication required.' })
      }

      const pool = getPool()
      const [rows] = await pool.query(
        'SELECT id, name, email, role, is_active FROM users WHERE id = ? LIMIT 1',
        [req.user.id]
      )
      const user = rows[0]

      if (!user || !user.is_active) {
        return res.status(401).json({ message: 'Authentication required.' })
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: 'You do not have permission to perform this action.' })
      }

      req.user = user
      return next()
    } catch (error) {
      console.error('Authorization error:', error)
      return res.status(500).json({ message: 'Unable to verify authorization.' })
    }
  }
}

export const requireAdmin = requireRoles('admin')
