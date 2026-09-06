import express from 'express'
import { getPool } from '../config/database.js'

const router = express.Router()

// Helper function to create audit log entry
export async function createAuditLog(connection, { action, module, description, performedBy = 'Admin User', severity = 'info' }) {
  try {
    await connection.query(
      'INSERT INTO audit_logs (action, module, description, performedBy, severity) VALUES (?, ?, ?, ?, ?)',
      [action, module, description, performedBy, severity]
    )
  } catch (err) {
    console.error('Error logging audit event:', err)
  }
}

// GET all audit logs
router.get('/', async (req, res) => {
  try {
    const pool = getPool()
    const connection = await pool.getConnection()
    const [logs] = await connection.query('SELECT * FROM audit_logs ORDER BY id DESC LIMIT 100')
    connection.release()
    res.json(logs)
  } catch (error) {
    console.error('Error fetching audit logs:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST create audit log
router.post('/', async (req, res) => {
  try {
    const { action, module, description, performedBy, severity } = req.body
    if (!action || !module || !description) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const pool = getPool()
    const connection = await pool.getConnection()
    const [result] = await connection.query(
      'INSERT INTO audit_logs (action, module, description, performedBy, severity) VALUES (?, ?, ?, ?, ?)',
      [action, module, description, performedBy || 'Admin User', severity || 'info']
    )
    connection.release()

    res.status(201).json({ id: result.insertId, action, module, description, performedBy, severity, isRead: 0 })
  } catch (error) {
    console.error('Error creating audit log:', error)
    res.status(500).json({ error: error.message })
  }
})

// PATCH mark notifications as read
router.patch('/mark-read', async (req, res) => {
  try {
    const pool = getPool()
    const connection = await pool.getConnection()
    await connection.query('UPDATE audit_logs SET isRead = 1 WHERE isRead = 0')
    connection.release()
    res.json({ message: 'All notifications marked as read' })
  } catch (error) {
    console.error('Error marking notifications as read:', error)
    res.status(500).json({ error: error.message })
  }
})

// DELETE clear all audit logs
router.delete('/', async (req, res) => {
  try {
    const pool = getPool()
    const connection = await pool.getConnection()
    await connection.query('DELETE FROM audit_logs')
    connection.release()
    res.json({ message: 'Audit logs cleared' })
  } catch (error) {
    console.error('Error clearing audit logs:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router
