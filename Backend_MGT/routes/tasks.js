import express from 'express'
import { getPool } from '../config/database.js'

const router = express.Router()

// GET all tasks
router.get('/', async (req, res) => {
  try {
    const pool = getPool()
    const connection = await pool.getConnection()
    const [tasks] = await connection.query('SELECT * FROM tasks ORDER BY id DESC')
    connection.release()
    res.json(tasks)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET task by ID
router.get('/:id', async (req, res) => {
  try {
    const pool = getPool()
    const connection = await pool.getConnection()
    const [tasks] = await connection.query('SELECT * FROM tasks WHERE id = ?', [req.params.id])
    connection.release()
    
    if (tasks.length === 0) {
      return res.status(404).json({ error: 'Task not found' })
    }
    res.json(tasks[0])
  } catch (error) {
    console.error('Error fetching task:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST create task
router.post('/', async (req, res) => {
  try {
    const { title, project, assignedTo, status, priority, dueDate } = req.body
    
    if (!title || !project || !assignedTo || !status || !priority || !dueDate) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const pool = getPool()
    const connection = await pool.getConnection()
    const [result] = await connection.query(
      'INSERT INTO tasks (title, project, assignedTo, status, priority, dueDate) VALUES (?, ?, ?, ?, ?, ?)',
      [title, project, assignedTo, status, priority, dueDate]
    )
    connection.release()
    
    res.status(201).json({ id: result.insertId, title, project, assignedTo, status, priority, dueDate })
  } catch (error) {
    console.error('Error creating task:', error)
    res.status(500).json({ error: error.message })
  }
})

// PUT update task
router.put('/:id', async (req, res) => {
  try {
    const { title, project, assignedTo, status, priority, dueDate } = req.body
    
    const pool = getPool()
    const connection = await pool.getConnection()
    await connection.query(
      'UPDATE tasks SET title = ?, project = ?, assignedTo = ?, status = ?, priority = ?, dueDate = ? WHERE id = ?',
      [title, project, assignedTo, status, priority, dueDate, req.params.id]
    )
    connection.release()
    
    res.json({ id: req.params.id, title, project, assignedTo, status, priority, dueDate })
  } catch (error) {
    console.error('Error updating task:', error)
    res.status(500).json({ error: error.message })
  }
})

// DELETE task
router.delete('/:id', async (req, res) => {
  try {
    const pool = getPool()
    const connection = await pool.getConnection()
    await connection.query('DELETE FROM tasks WHERE id = ?', [req.params.id])
    connection.release()
    
    res.json({ message: 'Task deleted successfully' })
  } catch (error) {
    console.error('Error deleting task:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router
