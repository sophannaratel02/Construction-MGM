import express from 'express'
import { getPool } from '../config/database.js'
import { requireAdmin } from '../utils/authorization.js'
import { createAuditLog } from './auditLogs.js'

const router = express.Router()

// GET all materials
router.get('/', async (req, res) => {
  try {
    const pool = getPool()
    const connection = await pool.getConnection()
    const [materials] = await connection.query(`
      SELECT m.*, s.companyName AS supplierCompanyName, s.contactPerson AS supplierContactPerson
      FROM materials m
      LEFT JOIN suppliers s ON m.supplier_id = s.id
      ORDER BY m.id DESC
    `)
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
    const [materials] = await connection.query(`
      SELECT m.*, s.companyName AS supplierCompanyName, s.contactPerson AS supplierContactPerson
      FROM materials m
      LEFT JOIN suppliers s ON m.supplier_id = s.id
      WHERE m.id = ?
    `, [req.params.id])
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
    let { name, category, unit, quantity, unitPrice, supplier, supplier_id, status, description } = req.body
    
    // Non-admin users MUST create materials with 'Pending' status
    const itemStatus = (req.user?.role === 'admin' && status) ? status : 'Pending'
    
    const pool = getPool()
    const connection = await pool.getConnection()

    if (!supplier && supplier_id) {
      const [sRows] = await connection.query('SELECT companyName FROM suppliers WHERE id = ?', [supplier_id])
      if (sRows.length) supplier = sRows[0].companyName
    }

    if (!name || !category || !unit || quantity === undefined || quantity === null || quantity === '' || unitPrice === undefined || unitPrice === null || unitPrice === '' || !supplier) {
      connection.release()
      return res.status(400).json({ message: 'Name, category, unit, quantity, unit price, and supplier are required.' })
    }

    const [result] = await connection.query(
      'INSERT INTO materials (name, category, unit, quantity, unitPrice, supplier, supplier_id, status, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, category, unit, quantity, unitPrice, supplier, supplier_id || null, itemStatus, description || null]
    )

    // Notify all admin users if pending approval or created by user
    const actorName = req.user?.name || req.user?.email || 'User'
    await createAuditLog(connection, {
      action: itemStatus === 'Pending' ? 'CREATE_MATERIAL_PENDING' : 'CREATE_MATERIAL',
      module: 'Materials',
      description: `Material "${name}" created by ${actorName} with status "${itemStatus}".`,
      performedBy: actorName,
      severity: itemStatus === 'Pending' ? 'warning' : 'info'
    })

    if (itemStatus === 'Pending' || req.user?.role !== 'admin') {
      const [admins] = await connection.query("SELECT id FROM users WHERE role = 'admin' AND is_active = 1")
      for (const admin of admins) {
        await connection.query(
          'INSERT INTO notifications (user_id, type, message) VALUES (?, ?, ?)',
          [admin.id, 'pending_approval', `New material "${name}" added by ${actorName} requires admin approval.`]
        )
      }
    }

    connection.release()
    
    res.status(201).json({ id: result.insertId, name, category, unit, quantity, unitPrice, supplier, supplier_id: supplier_id || null, status: itemStatus, description: description || null })
  } catch (error) {
    console.error('Error creating material:', error)
    res.status(500).json({ error: error.message })
  }
})

// PUT approve material (Admin only)
router.put('/:id/approve', requireAdmin, async (req, res) => {
  try {
    const pool = getPool()
    const connection = await pool.getConnection()

    const [matRows] = await connection.query('SELECT name FROM materials WHERE id = ?', [req.params.id])
    const matName = matRows.length ? matRows[0].name : 'Material'

    const [result] = await connection.query(
      "UPDATE materials SET status = 'Approved' WHERE id = ?",
      [req.params.id]
    )

    if (result.affectedRows === 0) {
      connection.release()
      return res.status(404).json({ message: 'Material not found.' })
    }

    const actorName = req.user?.name || req.user?.email || 'Admin'
    await createAuditLog(connection, {
      action: 'APPROVE_MATERIAL',
      module: 'Materials',
      description: `Material "${matName}" (ID: ${req.params.id}) approved by ${actorName}.`,
      performedBy: actorName,
      severity: 'info'
    })

    connection.release()
    res.json({ message: 'Material approved successfully.' })
  } catch (error) {
    console.error('Error approving material:', error)
    res.status(500).json({ error: error.message })
  }
})

// PUT update material
router.put('/:id', async (req, res) => {
  try {
    let { name, category, unit, quantity, unitPrice, supplier, supplier_id, status, description } = req.body

    const pool = getPool()
    const connection = await pool.getConnection()

    // Fetch existing status to prevent non-admins from changing status to Approved
    const [existing] = await connection.query('SELECT status FROM materials WHERE id = ?', [req.params.id])
    if (existing.length === 0) {
      connection.release()
      return res.status(404).json({ message: 'Material not found.' })
    }

    // Only admin users can modify the status; non-admins retain existing status
    let itemStatus = existing[0].status || 'Pending'
    if (req.user?.role === 'admin' && status) {
      itemStatus = status
    }

    if (!supplier && supplier_id) {
      const [sRows] = await connection.query('SELECT companyName FROM suppliers WHERE id = ?', [supplier_id])
      if (sRows.length) supplier = sRows[0].companyName
    }

    if (!name || !category || !unit || quantity === undefined || quantity === null || quantity === '' || unitPrice === undefined || unitPrice === null || unitPrice === '' || !supplier) {
      connection.release()
      return res.status(400).json({ message: 'Name, category, unit, quantity, unit price, and supplier are required.' })
    }
    
    const [result] = await connection.query(
      'UPDATE materials SET name = ?, category = ?, unit = ?, quantity = ?, unitPrice = ?, supplier = ?, supplier_id = ?, status = ?, description = ? WHERE id = ?',
      [name, category, unit, quantity, unitPrice, supplier, supplier_id || null, itemStatus, description || null, req.params.id]
    )
    connection.release()
    
    res.json({ id: req.params.id, name, category, unit, quantity, unitPrice, supplier, supplier_id: supplier_id || null, status: itemStatus, description: description || null })
  } catch (error) {
    console.error('Error updating material:', error)
    res.status(500).json({ error: error.message })
  }
})

// DELETE material (Admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
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
