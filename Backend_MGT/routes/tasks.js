import express from 'express'
import { getPool } from '../config/database.js'

const router = express.Router()

// GET all tasks
router.get('/', async (req, res) => {
  try {
    const pool = getPool()
    const connection = await pool.getConnection()
    const [tasks] = await connection.query(`
      SELECT t.*, p.name AS projectName, st.name AS assignedStaffName, st.role AS assignedStaffRole
      FROM tasks t
      LEFT JOIN projects p ON t.project_id = p.id
      LEFT JOIN staff st ON t.assigned_staff_id = st.id
      ORDER BY t.id DESC
    `)
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
    const [tasks] = await connection.query(`
      SELECT t.*, p.name AS projectName, st.name AS assignedStaffName, st.role AS assignedStaffRole
      FROM tasks t
      LEFT JOIN projects p ON t.project_id = p.id
      LEFT JOIN staff st ON t.assigned_staff_id = st.id
      WHERE t.id = ?
    `, [req.params.id])
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
    let { title, project, project_id, assignedTo, assigned_staff_id, status, priority, dueDate, progress, description } = req.body
    
    const pool = getPool()
    const connection = await pool.getConnection()

    if (!project && project_id) {
      const [pRows] = await connection.query('SELECT name FROM projects WHERE id = ?', [project_id])
      if (pRows.length) project = pRows[0].name
    }
    if (!assignedTo && assigned_staff_id) {
      const [sRows] = await connection.query('SELECT name FROM staff WHERE id = ?', [assigned_staff_id])
      if (sRows.length) assignedTo = sRows[0].name
    }

    if (!title || !project || !assignedTo || !status || !priority || !dueDate) {
      connection.release()
      return res.status(400).json({ message: 'Title, project, assignee, status, priority, and due date are required.' })
    }

    const [result] = await connection.query(
      'INSERT INTO tasks (title, project, project_id, assignedTo, assigned_staff_id, status, priority, dueDate, progress, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, project, project_id || null, assignedTo, assigned_staff_id || null, status, priority, dueDate, progress ?? 0, description || null]
    )
    connection.release()
    
    res.status(201).json({ id: result.insertId, title, project, project_id: project_id || null, assignedTo, assigned_staff_id: assigned_staff_id || null, status, priority, dueDate, progress: progress ?? 0, description: description || null })
  } catch (error) {
    console.error('Error creating task:', error)
    res.status(500).json({ error: error.message })
  }
})

// PUT update task
router.put('/:id', async (req, res) => {
  try {
    let { title, project, project_id, assignedTo, assigned_staff_id, status, priority, dueDate, progress, description } = req.body

    const pool = getPool()
    const connection = await pool.getConnection()

    if (!project && project_id) {
      const [pRows] = await connection.query('SELECT name FROM projects WHERE id = ?', [project_id])
      if (pRows.length) project = pRows[0].name
    }
    if (!assignedTo && assigned_staff_id) {
      const [sRows] = await connection.query('SELECT name FROM staff WHERE id = ?', [assigned_staff_id])
      if (sRows.length) assignedTo = sRows[0].name
    }

    if (!title || !project || !assignedTo || !status || !priority || !dueDate) {
      connection.release()
      return res.status(400).json({ message: 'Title, project, assignee, status, priority, and due date are required.' })
    }
    
    const [result] = await connection.query(
      'UPDATE tasks SET title = ?, project = ?, project_id = ?, assignedTo = ?, assigned_staff_id = ?, status = ?, priority = ?, dueDate = ?, progress = ?, description = ? WHERE id = ?',
      [title, project, project_id || null, assignedTo, assigned_staff_id || null, status, priority, dueDate, progress ?? 0, description || null, req.params.id]
    )

    if (result.affectedRows === 0) {
      connection.release()
      return res.status(404).json({ message: 'Task not found.' })
    }
    connection.release()
    
    res.json({ id: req.params.id, title, project, project_id: project_id || null, assignedTo, assigned_staff_id: assigned_staff_id || null, status, priority, dueDate, progress: progress ?? 0, description: description || null })
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
