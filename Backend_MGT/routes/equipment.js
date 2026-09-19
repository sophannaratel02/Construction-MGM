import express from 'express'
import { getPool } from '../config/database.js'

const router = express.Router()

// GET all equipment
router.get('/', async (req, res) => {
  try {
    const pool = getPool()
    const connection = await pool.getConnection()
    const [equipment] = await connection.query(`
      SELECT e.*, p.name AS projectName
      FROM equipment e
      LEFT JOIN projects p ON e.project_id = p.id
      ORDER BY e.id DESC
    `)
    connection.release()
    res.json(equipment)
  } catch (error) {
    console.error('Error fetching equipment:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET equipment by ID
router.get('/:id', async (req, res) => {
  try {
    const pool = getPool()
    const connection = await pool.getConnection()
    const [equipment] = await connection.query(`
      SELECT e.*, p.name AS projectName
      FROM equipment e
      LEFT JOIN projects p ON e.project_id = p.id
      WHERE e.id = ?
    `, [req.params.id])
    connection.release()
    
    if (equipment.length === 0) {
      return res.status(404).json({ error: 'Equipment not found' })
    }
    res.json(equipment[0])
  } catch (error) {
    console.error('Error fetching equipment:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST create equipment
router.post('/', async (req, res) => {
  try {
    const { name, type, serialNumber, status, purchaseDate, cost, location, project_id, description } = req.body
    
    if (!name || !type || !serialNumber || !status || !purchaseDate || cost === undefined || cost === null || cost === '') {
      return res.status(400).json({ message: 'Name, type, serial number, status, purchase date, and cost are required.' })
    }

    const pool = getPool()
    const connection = await pool.getConnection()
    const [result] = await connection.query(
      'INSERT INTO equipment (name, type, serialNumber, status, purchaseDate, cost, location, project_id, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, type, serialNumber, status, purchaseDate, cost, location || null, project_id || null, description || null]
    )
    connection.release()
    
    res.status(201).json({ id: result.insertId, name, type, serialNumber, status, purchaseDate, cost, location: location || null, project_id: project_id || null, description: description || null })
  } catch (error) {
    console.error('Error creating equipment:', error)
    res.status(500).json({ error: error.message })
  }
})

// PUT update equipment
router.put('/:id', async (req, res) => {
  try {
    const { name, type, serialNumber, status, purchaseDate, cost, location, project_id, description } = req.body

    if (!name || !type || !serialNumber || !status || !purchaseDate || cost === undefined || cost === null || cost === '') {
      return res.status(400).json({ message: 'Name, type, serial number, status, purchase date, and cost are required.' })
    }
    
    const pool = getPool()
    const connection = await pool.getConnection()
    const [result] = await connection.query(
      'UPDATE equipment SET name = ?, type = ?, serialNumber = ?, status = ?, purchaseDate = ?, cost = ?, location = ?, project_id = ?, description = ? WHERE id = ?',
      [name, type, serialNumber, status, purchaseDate, cost, location || null, project_id || null, description || null, req.params.id]
    )

    if (result.affectedRows === 0) {
      connection.release()
      return res.status(404).json({ message: 'Equipment not found.' })
    }
    connection.release()
    
    res.json({ id: req.params.id, name, type, serialNumber, status, purchaseDate, cost, location: location || null, project_id: project_id || null, description: description || null })
  } catch (error) {
    console.error('Error updating equipment:', error)
    res.status(500).json({ error: error.message })
  }
})

// DELETE equipment
router.delete('/:id', async (req, res) => {
  try {
    const pool = getPool()
    const connection = await pool.getConnection()
    await connection.query('DELETE FROM equipment WHERE id = ?', [req.params.id])
    connection.release()
    
    res.json({ message: 'Equipment deleted successfully' })
  } catch (error) {
    console.error('Error deleting equipment:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router
