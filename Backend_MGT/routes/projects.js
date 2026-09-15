import express from 'express'
import { getPool } from '../config/database.js'
import { createAuditLog } from './auditLogs.js'
import { requireAdmin } from '../utils/authorization.js'

const router = express.Router()
const APPROVAL_PENDING = 'Pending Approval'
const projectFields = `
  SELECT p.*, creator.name AS createdByName, approver.name AS approvedByName
  FROM projects p
  LEFT JOIN users creator ON creator.id = p.userId
  LEFT JOIN users approver ON approver.id = p.approvedBy
`

const validateProject = ({ name, client, startDate, budget }) => {
  if (!String(name || '').trim() || !String(client || '').trim() || !startDate || budget === undefined || budget === null || budget === '') {
    return 'Name, client, start date, and budget are required.'
  }
  return null
}

router.get('/', async (req, res) => {
  try {
    const pool = getPool()
    const [projects] = await pool.query(
      `${projectFields} ${req.user.role === 'admin' ? '' : 'WHERE p.userId = ?'} ORDER BY p.id DESC`,
      req.user.role === 'admin' ? [] : [req.user.id]
    )
    return res.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return res.status(500).json({ message: 'Unable to load projects.' })
  }
})

router.get('/pending', requireAdmin, async (req, res) => {
  try {
    const pool = getPool()
    const [projects] = await pool.query(`${projectFields} WHERE p.status = ? ORDER BY p.createdAt ASC`, [APPROVAL_PENDING])
    return res.json(projects)
  } catch (error) {
    console.error('Error fetching pending projects:', error)
    return res.status(500).json({ message: 'Unable to load pending projects.' })
  }
})

router.get('/:id/status', async (req, res) => {
  try {
    const pool = getPool()
    const scope = req.user.role === 'admin' ? '' : ' AND userId = ?'
    const params = req.user.role === 'admin' ? [req.params.id] : [req.params.id, req.user.id]
    const [projects] = await pool.query(
      `SELECT id, status, approvedBy, approvedAt, rejectionReason FROM projects WHERE id = ?${scope}`,
      params
    )
    if (!projects.length) return res.status(404).json({ message: 'Project not found.' })
    return res.json(projects[0])
  } catch (error) {
    console.error('Error fetching project status:', error)
    return res.status(500).json({ message: 'Unable to load project status.' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const pool = getPool()
    const scope = req.user.role === 'admin' ? '' : ' AND p.userId = ?'
    const params = req.user.role === 'admin' ? [req.params.id] : [req.params.id, req.user.id]
    const [projects] = await pool.query(`${projectFields} WHERE p.id = ?${scope}`, params)
    if (!projects.length) return res.status(404).json({ message: 'Project not found.' })
    return res.json(projects[0])
  } catch (error) {
    console.error('Error fetching project:', error)
    return res.status(500).json({ message: 'Unable to load project.' })
  }
})

router.post('/', async (req, res) => {
  const validationError = validateProject(req.body || {})
  if (validationError) return res.status(400).json({ message: validationError })
  const { name, client, startDate, endDate, budget, progress, description } = req.body
  const pool = getPool()
  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()
    const [result] = await connection.query(
      `INSERT INTO projects
       (name, client, status, startDate, endDate, budget, progress, description, userId)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name.trim(), client.trim(), APPROVAL_PENDING, startDate, endDate || null, budget, progress ?? 0, description || null, req.user.id]
    )
    const [admins] = await connection.query("SELECT id FROM users WHERE role = 'admin' AND is_active = 1")
    for (const admin of admins) {
      await connection.query(
        'INSERT INTO notifications (user_id, project_id, type, message) VALUES (?, ?, ?, ?)',
        [admin.id, result.insertId, 'PROJECT_PENDING', 'New project is waiting for approval.']
      )
    }
    await createAuditLog(connection, {
      action: 'CREATE', module: 'Projects',
      description: `New project "${name}" submitted for approval by ${req.user.name}.`,
      performedBy: req.user.name, severity: 'warning'
    })
    await connection.commit()
    return res.status(201).json({ id: result.insertId, name, client, status: APPROVAL_PENDING, userId: req.user.id, startDate, endDate: endDate || null, budget, progress: progress ?? 0, description: description || null })
  } catch (error) {
    await connection.rollback()
    console.error('Error creating project:', error)
    return res.status(500).json({ message: 'Unable to create project.' })
  } finally {
    connection.release()
  }
})

router.put('/:id', async (req, res) => {
  const validationError = validateProject(req.body || {})
  if (validationError) return res.status(400).json({ message: validationError })
  const { name, client, startDate, endDate, budget, progress, description } = req.body
  const pool = getPool()
  const connection = await pool.getConnection()
  try {
    const scope = req.user.role === 'admin' ? '' : ' AND userId = ?'
    const params = [name.trim(), client.trim(), startDate, endDate || null, budget, progress ?? 0, description || null, req.params.id]
    if (req.user.role !== 'admin') params.push(req.user.id)
    const [result] = await connection.query(
      `UPDATE projects SET name = ?, client = ?, startDate = ?, endDate = ?, budget = ?, progress = ?, description = ? WHERE id = ?${scope}`,
      params
    )
    if (!result.affectedRows) return res.status(404).json({ message: 'Project not found.' })
    return res.json({ message: 'Project updated successfully.' })
  } catch (error) {
    console.error('Error updating project:', error)
    return res.status(500).json({ message: 'Unable to update project.' })
  } finally {
    connection.release()
  }
})

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const pool = getPool()
    const [result] = await pool.query('DELETE FROM projects WHERE id = ?', [req.params.id])
    if (!result.affectedRows) return res.status(404).json({ message: 'Project not found.' })
    return res.json({ message: 'Project deleted successfully.' })
  } catch (error) {
    console.error('Error deleting project:', error)
    return res.status(500).json({ message: 'Unable to delete project.' })
  }
})

router.post('/:id/approve', requireAdmin, (req, res) => resolveProject(req, res, 'Approved'))
router.post('/:id/reject', requireAdmin, (req, res) => resolveProject(req, res, 'Rejected'))

async function resolveProject(req, res, status) {
  const reason = String(req.body?.rejectionReason || '').trim() || null
  if (status === 'Rejected' && !reason) return res.status(400).json({ message: 'A rejection reason is required.' })
  const pool = getPool()
  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()
    const [projects] = await connection.query('SELECT id, name, userId, status FROM projects WHERE id = ? FOR UPDATE', [req.params.id])
    const project = projects[0]
    if (!project) {
      await connection.rollback()
      return res.status(404).json({ message: 'Project not found.' })
    }
    if (project.status !== APPROVAL_PENDING) {
      await connection.rollback()
      return res.status(409).json({ message: 'Only pending projects can be resolved.' })
    }
    await connection.query(
      'UPDATE projects SET status = ?, approvedBy = ?, approvedAt = NOW(), rejectionReason = ? WHERE id = ?',
      [status, req.user.id, status === 'Rejected' ? reason : null, project.id]
    )
    await connection.query(
      'INSERT INTO notifications (user_id, project_id, type, message) VALUES (?, ?, ?, ?)',
      [project.userId, project.id, `PROJECT_${status.toUpperCase()}`, status === 'Approved' ? `Your project "${project.name}" was approved.` : `Your project "${project.name}" was rejected.`]
    )
    await connection.query(
      'UPDATE notifications SET is_read = 1 WHERE project_id = ? AND user_id = ?',
      [project.id, req.user.id]
    )
    await createAuditLog(connection, {
      action: status.toUpperCase(), module: 'Projects',
      description: `${status} project "${project.name}"${reason ? `: ${reason}` : '.'}`,
      performedBy: req.user.name, severity: status === 'Approved' ? 'success' : 'warning'
    })
    await connection.commit()
    return res.json({ id: project.id, status, rejectionReason: status === 'Rejected' ? reason : null })
  } catch (error) {
    await connection.rollback()
    console.error(`Error ${status.toLowerCase()} project:`, error)
    return res.status(500).json({ message: `Unable to ${status.toLowerCase()} project.` })
  } finally {
    connection.release()
  }
}

export default router
