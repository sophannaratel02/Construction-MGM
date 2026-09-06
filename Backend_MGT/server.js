import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import { connectDB } from './config/database.js'
import projectsRouter from './routes/projects.js'
import staffRouter from './routes/staff.js'
import materialsRouter from './routes/materials.js'
import equipmentRouter from './routes/equipment.js'
import tasksRouter from './routes/tasks.js'
import accountingRouter from './routes/accounting.js'
import clientsRouter from './routes/clients.js'
import suppliersRouter from './routes/suppliers.js'
import dashboardRouter from './routes/dashboard.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Routes
app.use('/api/projects', projectsRouter)
app.use('/api/staff', staffRouter)
app.use('/api/materials', materialsRouter)
app.use('/api/equipment', equipmentRouter)
app.use('/api/tasks', tasksRouter)
app.use('/api/accounting', accountingRouter)
app.use('/api/clients', clientsRouter)
app.use('/api/suppliers', suppliersRouter)
app.use('/api/dashboard', dashboardRouter)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' })
})

// Start only after the database pool has been verified.
const startServer = async () => {
  await connectDB()
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
  })
}

startServer()
