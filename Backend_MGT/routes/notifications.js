import express from 'express'
import { getPool } from '../config/database.js'
import { requireAdmin } from '../utils/authorization.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const pool = getPool()
    const [notifications] = await pool.query(
      `SELECT n.*, p.name AS projectName
       FROM notifications n
       LEFT JOIN projects p ON p.id = n.project_id
       WHERE n.user_id = ?
       ORDER BY n.id DESC LIMIT 100`,
      [req.user.id]
    )
    return res.json(notifications)
  } catch (error) {
    console.error('Notification list error:', error)
    return res.status(500).json({ message: 'Unable to load notifications.' })
  }
})

router.patch('/:id/read', async (req, res) => {
  try {
    const pool = getPool()
    const [result] = await pool.query(
      'UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    )
    if (!result.affectedRows) return res.status(404).json({ message: 'Notification not found.' })
    return res.json({ message: 'Notification marked as read.' })
  } catch (error) {
    console.error('Notification read error:', error)
    return res.status(500).json({ message: 'Unable to update notification.' })
  }
})

router.patch('/read-all', async (req, res) => {
  try {
    const pool = getPool()
    await pool.query('UPDATE notifications SET is_read = 1 WHERE user_id = ?', [req.user.id])
    return res.json({ message: 'Notifications marked as read.' })
  } catch (error) {
    console.error('Notification read-all error:', error)
    return res.status(500).json({ message: 'Unable to update notifications.' })
  }
})

router.get('/pending-count', requireAdmin, async (req, res) => {
  try {
    const pool = getPool()
    const [rows] = await pool.query("SELECT COUNT(*) AS count FROM projects WHERE status = 'Pending Approval'")
    return res.json({ count: rows[0].count })
  } catch (error) {
    console.error('Pending project count error:', error)
    return res.status(500).json({ message: 'Unable to load pending project count.' })
  }
})

export default router
