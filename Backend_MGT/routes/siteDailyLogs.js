import express from 'express'
import { getPool } from '../config/database.js'

const router = express.Router()

// GET all site daily logs with JOIN details
router.get('/', async (req, res) => {
  try {
    const pool = getPool()
    const connection = await pool.getConnection()
    const [logs] = await connection.query(`
      SELECT 
        sdl.*,
        p.name AS projectName,
        st.name AS reporterName,
        st.role AS reporterRole
      FROM site_daily_logs sdl
      LEFT JOIN projects p ON sdl.project_id = p.id
      LEFT JOIN staff st ON sdl.reported_by_staff_id = st.id
      ORDER BY sdl.log_date DESC, sdl.id DESC
    `)
    connection.release()
    res.json(logs)
  } catch (error) {
    console.error('Error fetching site daily logs:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET site daily log by ID
router.get('/:id', async (req, res) => {
  try {
    const pool = getPool()
    const connection = await pool.getConnection()
    const [logs] = await connection.query(`
      SELECT 
        sdl.*,
        p.name AS projectName,
        st.name AS reporterName
      FROM site_daily_logs sdl
      LEFT JOIN projects p ON sdl.project_id = p.id
      LEFT JOIN staff st ON sdl.reported_by_staff_id = st.id
      WHERE sdl.id = ?
    `, [req.params.id])
    connection.release()
    
    if (logs.length === 0) {
      return res.status(404).json({ error: 'Daily log not found' })
    }
    res.json(logs[0])
  } catch (error) {
    console.error('Error fetching daily log:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST create site daily log
router.post('/', async (req, res) => {
  try {
    const { project_id, log_date, weather, headcount, work_summary, delays_or_incidents, reported_by_staff_id } = req.body
    
    if (!project_id || !log_date || !work_summary) {
      return res.status(400).json({ message: 'Project, log date, and work summary are required.' })
    }

    const pool = getPool()
    const connection = await pool.getConnection()
    const [result] = await connection.query(`
      INSERT INTO site_daily_logs 
      (project_id, log_date, weather, headcount, work_summary, delays_or_incidents, reported_by_staff_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      project_id,
      log_date,
      weather || 'Clear',
      headcount || 0,
      work_summary,
      delays_or_incidents || null,
      reported_by_staff_id || null
    ])
    connection.release()
    
    res.status(201).json({ id: result.insertId, project_id, log_date, message: 'Daily site log logged successfully' })
  } catch (error) {
    console.error('Error creating site daily log:', error)
    res.status(500).json({ error: error.message })
  }
})

// PUT update site daily log
router.put('/:id', async (req, res) => {
  try {
    const { project_id, log_date, weather, headcount, work_summary, delays_or_incidents, reported_by_staff_id } = req.body

    if (!project_id || !log_date || !work_summary) {
      return res.status(400).json({ message: 'Project, log date, and work summary are required.' })
    }
    
    const pool = getPool()
    const connection = await pool.getConnection()
    const [result] = await connection.query(`
      UPDATE site_daily_logs 
      SET project_id = ?, log_date = ?, weather = ?, headcount = ?, work_summary = ?, delays_or_incidents = ?, reported_by_staff_id = ? 
      WHERE id = ?
    `, [
      project_id,
      log_date,
      weather || 'Clear',
      headcount || 0,
      work_summary,
      delays_or_incidents || null,
      reported_by_staff_id || null,
      req.params.id
    ])

    if (result.affectedRows === 0) {
      connection.release()
      return res.status(404).json({ message: 'Daily log not found.' })
    }
    connection.release()
    
    res.json({ id: req.params.id, message: 'Daily site log updated successfully' })
  } catch (error) {
    console.error('Error updating daily log:', error)
    res.status(500).json({ error: error.message })
  }
})

// DELETE site daily log
router.delete('/:id', async (req, res) => {
  try {
    const pool = getPool()
    const connection = await pool.getConnection()
    await connection.query('DELETE FROM site_daily_logs WHERE id = ?', [req.params.id])
    connection.release()
    
    res.json({ message: 'Daily log deleted successfully' })
  } catch (error) {
    console.error('Error deleting daily log:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router
