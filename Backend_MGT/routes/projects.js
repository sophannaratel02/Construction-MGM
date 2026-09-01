import express from 'express'
import { getPool } from '../config/database.js'

const router = express.Router()

// GET all projects
router.get('/', async (req, res) => {
  try {
    const pool = getPool()
    const connection = await pool.getConnection()
    const [projects] = await connection.query('SELECT * FROM projects ORDER BY id DESC')
    connection.release()
    res.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET project by ID
router.get('/:id', async (req, res) => {
  try {
    const pool = getPool()
    const connection = await pool.getConnection()
    const [projects] = await connection.query('SELECT * FROM projects WHERE id = ?', [req.params.id])
    connection.release()
    
    if (projects.length === 0) {
      return res.status(404).json({ error: 'Project not found' })
    }
    res.json(projects[0])
  } catch (error) {
    console.error('Error fetching project:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST create project
router.post('/', async (req, res) => {
  try {
    const { name, client, status, startDate, budget } = req.body
    
    if (!name || !client || !status || !startDate || !budget) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const pool = getPool()
    const connection = await pool.getConnection()
    const [result] = await connection.query(
      'INSERT INTO projects (name, client, status, startDate, budget) VALUES (?, ?, ?, ?, ?)',
      [name, client, status, startDate, budget]
    )
    connection.release()
    
    res.status(201).json({ id: result.insertId, name, client, status, startDate, budget })
  } catch (error) {
    console.error('Error creating project:', error)
    res.status(500).json({ error: error.message })
  }
})

// PUT update project
router.put('/:id', async (req, res) => {
  try {
    const { name, client, status, startDate, budget, progress } = req.body
    
    const pool = getPool()
    const connection = await pool.getConnection()
    await connection.query(
      'UPDATE projects SET name = ?, client = ?, status = ?, startDate = ?, budget = ?, progress = ? WHERE id = ?',
      [name, client, status, startDate, budget, progress || 0, req.params.id]
    )
    connection.release()
    
    res.json({ id: req.params.id, name, client, status, startDate, budget })
  } catch (error) {
    console.error('Error updating project:', error)
    res.status(500).json({ error: error.message })
  }
})

// DELETE project
router.delete('/:id', async (req, res) => {
  try {
    const pool = getPool()
    const connection = await pool.getConnection()
    await connection.query('DELETE FROM projects WHERE id = ?', [req.params.id])
    connection.release()
    
    res.json({ message: 'Project deleted successfully' })
  } catch (error) {
    console.error('Error deleting project:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router
