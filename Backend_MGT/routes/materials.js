import express from 'express'
import { getPool } from '../config/database.js'

const router = express.Router()

// GET all materials
router.get('/', async (req, res) => {
  try {
    const pool = getPool()
    const connection = await pool.getConnection()
    const [materials] = await connection.query('SELECT * FROM materials ORDER BY id DESC')
    connection.release()
    res.json(materials)
  } catch (error) {
    console.error('Error fetching materials:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET material by ID
router.get('/:id', async (req, res) => {
  try {
    const pool = getPool()
    const connection = await pool.getConnection()
    const [materials] = await connection.query('SELECT * FROM materials WHERE id = ?', [req.params.id])
    connection.release()
    
    if (materials.length === 0) {
      return res.status(404).json({ error: 'Material not found' })
    }
    res.json(materials[0])
  } catch (error) {
    console.error('Error fetching material:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST create material
router.post('/', async (req, res) => {
  try {
    const { name, category, unit, quantity, unitPrice, supplier, description } = req.body
    
    if (!name || !category || !unit || quantity === undefined || quantity === null || quantity === '' || unitPrice === undefined || unitPrice === null || unitPrice === '' || !supplier) {
      return res.status(400).json({ message: 'Name, category, unit, quantity, unit price, and supplier are required.' })
    }

    const pool = getPool()
    const connection = await pool.getConnection()
    const [result] = await connection.query(
      'INSERT INTO materials (name, category, unit, quantity, unitPrice, supplier, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, category, unit, quantity, unitPrice, supplier, description || null]
    )
    connection.release()
    
    res.status(201).json({ id: result.insertId, name, category, unit, quantity, unitPrice, supplier, description: description || null })
  } catch (error) {
    console.error('Error creating material:', error)
    res.status(500).json({ error: error.message })
  }
})

// PUT update material
router.put('/:id', async (req, res) => {
  try {
    const { name, category, unit, quantity, unitPrice, supplier, description } = req.body

    if (!name || !category || !unit || quantity === undefined || quantity === null || quantity === '' || unitPrice === undefined || unitPrice === null || unitPrice === '' || !supplier) {
      return res.status(400).json({ message: 'Name, category, unit, quantity, unit price, and supplier are required.' })
    }
    
    const pool = getPool()
    const connection = await pool.getConnection()
    const [result] = await connection.query(
      'UPDATE materials SET name = ?, category = ?, unit = ?, quantity = ?, unitPrice = ?, supplier = ?, description = ? WHERE id = ?',
      [name, category, unit, quantity, unitPrice, supplier, description || null, req.params.id]
    )

    if (result.affectedRows === 0) {
      connection.release()
      return res.status(404).json({ message: 'Material not found.' })
    }
    connection.release()
    
    res.json({ id: req.params.id, name, category, unit, quantity, unitPrice, supplier, description: description || null })
  } catch (error) {
    console.error('Error updating material:', error)
    res.status(500).json({ error: error.message })
  }
})

// DELETE material
router.delete('/:id', async (req, res) => {
  try {
    const pool = getPool()
    const connection = await pool.getConnection()
    await connection.query('DELETE FROM materials WHERE id = ?', [req.params.id])
    connection.release()
    
    res.json({ message: 'Material deleted successfully' })
  } catch (error) {
    console.error('Error deleting material:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router
