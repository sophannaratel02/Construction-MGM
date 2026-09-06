import express from 'express'
import { getPool } from '../config/database.js'

const router = express.Router()

// GET all clients
router.get('/', async (req, res) => {
  try {
    const pool = getPool()
    const connection = await pool.getConnection()
    const [clients] = await connection.query('SELECT * FROM clients ORDER BY id DESC')
    connection.release()
    res.json(clients)
  } catch (error) {
    console.error('Error fetching clients:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET client by ID
router.get('/:id', async (req, res) => {
  try {
    const pool = getPool()
    const connection = await pool.getConnection()
    const [clients] = await connection.query('SELECT * FROM clients WHERE id = ?', [req.params.id])
    connection.release()
    
    if (clients.length === 0) {
      return res.status(404).json({ error: 'Client not found' })
    }
    res.json(clients[0])
  } catch (error) {
    console.error('Error fetching client:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST create client
router.post('/', async (req, res) => {
  try {
    const companyName = req.body.companyName ?? req.body.company_name
    const contactPerson = req.body.contactPerson ?? req.body.contact_person
    const { email, phone, address } = req.body
    
    if (!companyName || !contactPerson || !email || !phone || !address) {
      return res.status(400).json({ error: 'companyName, contactPerson, email, phone, and address are required' })
    }

    const pool = getPool()
    const connection = await pool.getConnection()
    const [result] = await connection.query(
      'INSERT INTO clients (companyName, contactPerson, email, phone, address) VALUES (?, ?, ?, ?, ?)',
      [companyName, contactPerson, email, phone, address]
    )
    connection.release()
    
    res.status(201).json({ id: result.insertId, companyName, contactPerson, email, phone, address })
  } catch (error) {
    console.error('Error creating client:', error)
    res.status(500).json({ error: error.message })
  }
})

// PUT update client
router.put('/:id', async (req, res) => {
  try {
    const companyName = req.body.companyName ?? req.body.company_name
    const contactPerson = req.body.contactPerson ?? req.body.contact_person
    const { email, phone, address } = req.body

    if (!companyName || !contactPerson || !email || !phone || !address) {
      return res.status(400).json({ error: 'companyName, contactPerson, email, phone, and address are required' })
    }
    
    const pool = getPool()
    const connection = await pool.getConnection()
    await connection.query(
      'UPDATE clients SET companyName = ?, contactPerson = ?, email = ?, phone = ?, address = ? WHERE id = ?',
      [companyName, contactPerson, email, phone, address, req.params.id]
    )
    connection.release()
    
    res.json({ id: req.params.id, companyName, contactPerson, email, phone, address })
  } catch (error) {
    console.error('Error updating client:', error)
    res.status(500).json({ error: error.message })
  }
})

// DELETE client
router.delete('/:id', async (req, res) => {
  try {
    const pool = getPool()
    const connection = await pool.getConnection()
    await connection.query('DELETE FROM clients WHERE id = ?', [req.params.id])
    connection.release()
    
    res.json({ message: 'Client deleted successfully' })
  } catch (error) {
    console.error('Error deleting client:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router
