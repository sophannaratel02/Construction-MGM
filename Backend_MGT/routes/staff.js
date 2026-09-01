import express from 'express'
import { getPool } from '../config/database.js'

const router = express.Router()

// GET all staff
router.get('/', async (req, res) => {
  try {
    const pool = getPool()
    const connection = await pool.getConnection()
    const [staff] = await connection.query('SELECT * FROM staff ORDER BY id DESC')
    connection.release()
    res.json(staff)
  } catch (error) {
    console.error('Error fetching staff:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET staff by ID
router.get('/:id', async (req, res) => {
  try {
    const pool = getPool()
    const connection = await pool.getConnection()
    const [staff] = await connection.query('SELECT * FROM staff WHERE id = ?', [req.params.id])
    connection.release()
    
    if (staff.length === 0) {
      return res.status(404).json({ error: 'Staff not found' })
    }
    res.json(staff[0])
  } catch (error) {
    console.error('Error fetching staff:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST create staff
router.post('/', async (req, res) => {
  try {
    const { name, role, email, phone, salary, status } = req.body
    
    if (!name || !role || !email || !phone || !salary) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const pool = getPool()
    const connection = await pool.getConnection()
    const [result] = await connection.query(
      'INSERT INTO staff (name, role, email, phone, salary, status) VALUES (?, ?, ?, ?, ?, ?)',
      [name, role, email, phone, salary, status || 'Active']
    )
    connection.release()
    
    res.status(201).json({ id: result.insertId, name, role, email, phone, salary, status: status || 'Active' })
  } catch (error) {
    console.error('Error creating staff:', error)
    res.status(500).json({ error: error.message })
  }
})

// PUT update staff
router.put('/:id', async (req, res) => {
  try {
    const { name, role, email, phone, salary, status } = req.body
    
    const pool = getPool()
    const connection = await pool.getConnection()
    await connection.query(
      'UPDATE staff SET name = ?, role = ?, email = ?, phone = ?, salary = ?, status = ? WHERE id = ?',
      [name, role, email, phone, salary, status, req.params.id]
    )
    connection.release()
    
    res.json({ id: req.params.id, name, role, email, phone, salary, status })
  } catch (error) {
    console.error('Error updating staff:', error)
    res.status(500).json({ error: error.message })
  }
})

// DELETE staff
router.delete('/:id', async (req, res) => {
  try {
    const pool = getPool()
    const connection = await pool.getConnection()
    await connection.query('DELETE FROM staff WHERE id = ?', [req.params.id])
    connection.release()
    
    res.json({ message: 'Staff deleted successfully' })
  } catch (error) {
    console.error('Error deleting staff:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router
