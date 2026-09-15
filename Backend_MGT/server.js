import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import { connectDB, getPool } from './config/database.js'
import { verifyToken } from './utils/auth.js'
import { requireAdmin } from './utils/authorization.js'
import authRouter from './routes/auth.js'
import projectsRouter from './routes/projects.js'
import staffRouter from './routes/staff.js'
import materialsRouter from './routes/materials.js'
import equipmentRouter from './routes/equipment.js'
import tasksRouter from './routes/tasks.js'
import accountingRouter from './routes/accounting.js'
import clientsRouter from './routes/clients.js'
import suppliersRouter from './routes/suppliers.js'
import dashboardRouter from './routes/dashboard.js'
import auditLogsRouter from './routes/auditLogs.js'
import adminUsersRouter from './routes/adminUsers.js'
import notificationsRouter from './routes/notifications.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

const publicRoutes = [
  '/api/health',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
]

const mutationRoutes = new Set([
  '/api/staff',
  '/api/materials',
  '/api/equipment',
  '/api/tasks',
  '/api/accounting',
  '/api/clients',
  '/api/suppliers',
  '/api/audit-logs',
])

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' })
})

app.use(async (req, res, next) => {
  if (publicRoutes.includes(req.path)) {
    return next()
  }

  const authHeader = req.headers.authorization || ''
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required.' })
  }

  try {
    const token = authHeader.replace('Bearer ', '')
    const decoded = verifyToken(token)
    const pool = getPool()
    const [rows] = await pool.query(
      'SELECT id, name, email, role, is_active FROM users WHERE id = ? LIMIT 1',
      [decoded.id]
    )
    if (!rows[0] || !rows[0].is_active || !['admin', 'user'].includes(rows[0].role)) {
      return res.status(401).json({ message: 'Invalid or inactive account.' })
    }
    req.user = rows[0]

    const isMutation = [...mutationRoutes].some((path) => req.path === path || req.path.startsWith(`${path}/`))
    if (isMutation && req.method !== 'GET' && req.method !== 'HEAD') {
      return requireAdmin(req, res, next)
    }

    return next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' })
  }
})

app.use('/api/auth', authRouter)
app.use('/api/admin/users', requireAdmin, adminUsersRouter)
app.use('/api/projects', projectsRouter)
app.use('/api/notifications', notificationsRouter)
app.use('/api/staff', staffRouter)
app.use('/api/materials', materialsRouter)
app.use('/api/equipment', equipmentRouter)
app.use('/api/tasks', tasksRouter)
app.use('/api/accounting', accountingRouter)
app.use('/api/clients', clientsRouter)
app.use('/api/suppliers', suppliersRouter)
app.use('/api/dashboard', dashboardRouter)
app.use('/api/audit-logs', auditLogsRouter)

const startServer = async () => {
  await connectDB()
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
  })
}

startServer()
