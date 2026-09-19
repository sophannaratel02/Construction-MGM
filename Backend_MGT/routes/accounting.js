import express from 'express'
import { getPool } from '../config/database.js'

const router = express.Router()

// GET all accounting records
router.get('/', async (req, res) => {
  try {
    const pool = getPool()
    const connection = await pool.getConnection()
    const [records] = await connection.query(`
      SELECT a.*, p.name AS projectName
      FROM accounting a
      LEFT JOIN projects p ON a.project_id = p.id
      ORDER BY a.date DESC
    `)
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
    const [records] = await connection.query(`
      SELECT a.*, p.name AS projectName
      FROM accounting a
      LEFT JOIN projects p ON a.project_id = p.id
      WHERE a.id = ?
    `, [req.params.id])
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
    const { date, description, category, type, amount, reference, project_id, notes } = req.body
    
    if (!date || !description || !category || !type || amount === undefined || amount === null || amount === '') {
      return res.status(400).json({ message: 'Date, description, category, type, and amount are required.' })
    }

    const pool = getPool()
    const connection = await pool.getConnection()
    const [result] = await connection.query(
      'INSERT INTO accounting (date, description, category, type, amount, reference, project_id, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [date, description, category, type, amount, reference || null, project_id || null, notes || null]
    )
    connection.release()
    
    res.status(201).json({ id: result.insertId, date, description, category, type, amount, reference: reference || null, project_id: project_id || null, notes: notes || null })
  } catch (error) {
    console.error('Error creating record:', error)
    res.status(500).json({ error: error.message })
  }
})

// PUT update record
router.put('/:id', async (req, res) => {
  try {
    const { date, description, category, type, amount, reference, project_id, notes } = req.body

    if (!date || !description || !category || !type || amount === undefined || amount === null || amount === '') {
      return res.status(400).json({ message: 'Date, description, category, type, and amount are required.' })
    }
    
    const pool = getPool()
    const connection = await pool.getConnection()
    const [result] = await connection.query(
      'UPDATE accounting SET date = ?, description = ?, category = ?, type = ?, amount = ?, reference = ?, project_id = ?, notes = ? WHERE id = ?',
      [date, description, category, type, amount, reference || null, project_id || null, notes || null, req.params.id]
    )

    if (result.affectedRows === 0) {
      connection.release()
      return res.status(404).json({ message: 'Accounting record not found.' })
    }
    connection.release()
    
    res.json({ id: req.params.id, date, description, category, type, amount, reference: reference || null, project_id: project_id || null, notes: notes || null })
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
