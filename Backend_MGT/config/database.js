import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

let pool

export async function connectDB() {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'Nara324053',
      database: process.env.DB_NAME || 'construction_management',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    })

    // Test the connection
    const connection = await pool.getConnection()
    console.log('✓ Database connected successfully')
    connection.release()
  } catch (error) {
    console.error('✗ Database connection failed:', error.message)
    console.log('Make sure MySQL is running and database is created.')
    process.exit(1)
  }
}

export function getPool() {
  return pool
}
