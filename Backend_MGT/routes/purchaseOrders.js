import express from 'express'
import { getPool } from '../config/database.js'

const router = express.Router()

// GET all purchase orders with JOIN details
router.get('/', async (req, res) => {
  try {
    const pool = getPool()
    const connection = await pool.getConnection()
    const [orders] = await connection.query(`
      SELECT 
        po.*,
        p.name AS projectName,
        s.companyName AS supplierName,
        m.name AS materialName
      FROM purchase_orders po
      LEFT JOIN projects p ON po.project_id = p.id
      LEFT JOIN suppliers s ON po.supplier_id = s.id
      LEFT JOIN materials m ON po.material_id = m.id
      ORDER BY po.id DESC
    `)
    connection.release()
    res.json(orders)
  } catch (error) {
    console.error('Error fetching purchase orders:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET purchase order by ID
router.get('/:id', async (req, res) => {
  try {
    const pool = getPool()
    const connection = await pool.getConnection()
    const [orders] = await connection.query(`
      SELECT 
        po.*,
        p.name AS projectName,
        s.companyName AS supplierName,
        m.name AS materialName
      FROM purchase_orders po
      LEFT JOIN projects p ON po.project_id = p.id
      LEFT JOIN suppliers s ON po.supplier_id = s.id
      LEFT JOIN materials m ON po.material_id = m.id
      WHERE po.id = ?
    `, [req.params.id])
    connection.release()
    
    if (orders.length === 0) {
      return res.status(404).json({ error: 'Purchase order not found' })
    }
    res.json(orders[0])
  } catch (error) {
    console.error('Error fetching purchase order:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST create purchase order
router.post('/', async (req, res) => {
  try {
    const { po_number, project_id, supplier_id, material_id, quantity, unit_price, status, order_date, expected_delivery, notes } = req.body
    
    if (!po_number || !quantity || !unit_price || !order_date) {
      return res.status(400).json({ message: 'PO number, quantity, unit price, and order date are required.' })
    }

    const total_amount = Number(quantity) * Number(unit_price)

    const pool = getPool()
    const connection = await pool.getConnection()
    const [result] = await connection.query(`
      INSERT INTO purchase_orders 
      (po_number, project_id, supplier_id, material_id, quantity, unit_price, total_amount, status, order_date, expected_delivery, notes) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      po_number,
      project_id || null,
      supplier_id || null,
      material_id || null,
      quantity,
      unit_price,
      total_amount,
      status || 'Pending',
      order_date,
      expected_delivery || null,
      notes || null
    ])
    connection.release()
    
    res.status(201).json({ id: result.insertId, po_number, total_amount, message: 'Purchase order created successfully' })
  } catch (error) {
    console.error('Error creating purchase order:', error)
    res.status(500).json({ error: error.message })
  }
})

// PUT update purchase order
router.put('/:id', async (req, res) => {
  try {
    const { po_number, project_id, supplier_id, material_id, quantity, unit_price, status, order_date, expected_delivery, notes } = req.body

    if (!po_number || !quantity || !unit_price || !order_date) {
      return res.status(400).json({ message: 'PO number, quantity, unit price, and order date are required.' })
    }

    const total_amount = Number(quantity) * Number(unit_price)
    
    const pool = getPool()
    const connection = await pool.getConnection()
    const [result] = await connection.query(`
      UPDATE purchase_orders 
      SET po_number = ?, project_id = ?, supplier_id = ?, material_id = ?, quantity = ?, unit_price = ?, total_amount = ?, status = ?, order_date = ?, expected_delivery = ?, notes = ? 
      WHERE id = ?
    `, [
      po_number,
      project_id || null,
      supplier_id || null,
      material_id || null,
      quantity,
      unit_price,
      total_amount,
      status || 'Pending',
      order_date,
      expected_delivery || null,
      notes || null,
      req.params.id
    ])

    if (result.affectedRows === 0) {
      connection.release()
      return res.status(404).json({ message: 'Purchase order not found.' })
    }
    connection.release()
    
    res.json({ id: req.params.id, po_number, total_amount, message: 'Purchase order updated successfully' })
  } catch (error) {
    console.error('Error updating purchase order:', error)
    res.status(500).json({ error: error.message })
  }
})

// DELETE purchase order
router.delete('/:id', async (req, res) => {
  try {
    const pool = getPool()
    const connection = await pool.getConnection()
    await connection.query('DELETE FROM purchase_orders WHERE id = ?', [req.params.id])
    connection.release()
    
    res.json({ message: 'Purchase order deleted successfully' })
  } catch (error) {
    console.error('Error deleting purchase order:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router
