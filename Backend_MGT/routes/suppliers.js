import express from 'express'
import { getPool } from '../config/database.js'

const router = express.Router()

// GET all suppliers
router.get('/', async (req, res) => {
  try {
    const pool = getPool()
    const connection = await pool.getConnection()
    const [suppliers] = await connection.query('SELECT * FROM suppliers ORDER BY id DESC')
    connection.release()
    res.json(suppliers)
  } catch (error) {
    console.error('Error fetching suppliers:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET supplier by ID
router.get('/:id', async (req, res) => {
  try {
    const pool = getPool()
    const connection = await pool.getConnection()
    const [suppliers] = await connection.query('SELECT * FROM suppliers WHERE id = ?', [req.params.id])
    connection.release()
    
    if (suppliers.length === 0) {
      return res.status(404).json({ error: 'Supplier not found' })
    }
    res.json(suppliers[0])
  } catch (error) {
    console.error('Error fetching supplier:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST create supplier
router.post('/', async (req, res) => {
  try {
    const { companyName, contactPerson, email, phone, productCategory } = req.body
    
    if (!companyName || !contactPerson || !email || !phone || !productCategory) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const pool = getPool()
    const connection = await pool.getConnection()
    const [result] = await connection.query(
      'INSERT INTO suppliers (companyName, contactPerson, email, phone, productCategory) VALUES (?, ?, ?, ?, ?)',
      [companyName, contactPerson, email, phone, productCategory]
    )
    connection.release()
    
    res.status(201).json({ id: result.insertId, companyName, contactPerson, email, phone, productCategory })
  } catch (error) {
    console.error('Error creating supplier:', error)
    res.status(500).json({ error: error.message })
  }
})

// PUT update supplier
router.put('/:id', async (req, res) => {
  try {
    const { companyName, contactPerson, email, phone, productCategory } = req.body
    
    const pool = getPool()
    const connection = await pool.getConnection()
    await connection.query(
      'UPDATE suppliers SET companyName = ?, contactPerson = ?, email = ?, phone = ?, productCategory = ? WHERE id = ?',
      [companyName, contactPerson, email, phone, productCategory, req.params.id]
    )
    connection.release()
    
    res.json({ id: req.params.id, companyName, contactPerson, email, phone, productCategory })
  } catch (error) {
    console.error('Error updating supplier:', error)
    res.status(500).json({ error: error.message })
  }
})

// DELETE supplier
router.delete('/:id', async (req, res) => {
  try {
    const pool = getPool()
    const connection = await pool.getConnection()
    await connection.query('DELETE FROM suppliers WHERE id = ?', [req.params.id])
    connection.release()
    
    res.json({ message: 'Supplier deleted successfully' })
  } catch (error) {
    console.error('Error deleting supplier:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router
