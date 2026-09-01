import express from 'express'
import { getPool } from '../config/database.js'

const router = express.Router()

// GET dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const pool = getPool()
    const connection = await pool.getConnection()

    // Get counts
    const [projectsResult] = await connection.query('SELECT COUNT(*) as count FROM projects')
    const [staffResult] = await connection.query('SELECT COUNT(*) as count FROM staff')
    const [equipmentResult] = await connection.query('SELECT COUNT(*) as count FROM equipment')
    const [tasksResult] = await connection.query('SELECT COUNT(*) as count FROM tasks')

    connection.release()

    res.json({
      totalProjects: projectsResult[0].count,
      totalStaff: staffResult[0].count,
      totalEquipment: equipmentResult[0].count,
      totalTasks: tasksResult[0].count,
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router
