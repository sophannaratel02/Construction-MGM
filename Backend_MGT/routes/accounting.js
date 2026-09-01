import express from 'express'
import { getPool } from '../config/database.js'

const router = express.Router()

// GET all accounting records
router.get('/', async (req, res) => {
  try {
    const pool = getPool()
    const connection = await pool.getConnection()
    const [records] = await connection.query('SELECT * FROM accounting ORDER BY date DESC')
    connection.release()
    res.json(records)
  } catch (error) {
    console.error('Error fetching accounting records:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET record by ID
router.get('/:id', async (req, res) => {
  try {
    const pool = getPool()
    const connection = await pool.getConnection()
    const [records] = await connection.query('SELECT * FROM accounting WHERE id = ?', [req.params.id])
    connection.release()
    
    if (records.length === 0) {
      return res.status(404).json({ error: 'Record not found' })
    }
    res.json(records[0])
  } catch (error) {
    console.error('Error fetching record:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST create record
router.post('/', async (req, res) => {
  try {
    const { date, description, category, type, amount } = req.body
    
    if (!date || !description || !category || !type || !amount) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const pool = getPool()
    const connection = await pool.getConnection()
    const [result] = await connection.query(
      'INSERT INTO accounting (date, description, category, type, amount) VALUES (?, ?, ?, ?, ?)',
      [date, description, category, type, amount]
    )
    connection.release()
    
    res.status(201).json({ id: result.insertId, date, description, category, type, amount })
  } catch (error) {
    console.error('Error creating record:', error)
    res.status(500).json({ error: error.message })
  }
})

// PUT update record
router.put('/:id', async (req, res) => {
  try {
    const { date, description, category, type, amount } = req.body
    
    const pool = getPool()
    const connection = await pool.getConnection()
    await connection.query(
      'UPDATE accounting SET date = ?, description = ?, category = ?, type = ?, amount = ? WHERE id = ?',
      [date, description, category, type, amount, req.params.id]
    )
    connection.release()
    
    res.json({ id: req.params.id, date, description, category, type, amount })
  } catch (error) {
    console.error('Error updating record:', error)
    res.status(500).json({ error: error.message })
  }
})

// DELETE record
router.delete('/:id', async (req, res) => {
  try {
    const pool = getPool()
    const connection = await pool.getConnection()
    await connection.query('DELETE FROM accounting WHERE id = ?', [req.params.id])
    connection.release()
    
    res.json({ message: 'Record deleted successfully' })
  } catch (error) {
    console.error('Error deleting record:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router
