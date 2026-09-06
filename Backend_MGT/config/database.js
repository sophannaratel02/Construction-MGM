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

    // Ensure audit_logs table exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id INT PRIMARY KEY AUTO_INCREMENT,
        action VARCHAR(50) NOT NULL,
        module VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        performedBy VARCHAR(100) NOT NULL DEFAULT 'Admin User',
        severity VARCHAR(20) NOT NULL DEFAULT 'info',
        isRead TINYINT(1) NOT NULL DEFAULT 0,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_module (module),
        INDEX idx_severity (severity),
        INDEX idx_isRead (isRead),
        INDEX idx_createdAt (createdAt)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)

    // Seed initial records if table is empty
    const [existing] = await connection.query('SELECT COUNT(*) as count FROM audit_logs')
    if (existing[0].count === 0) {
      await connection.query(`
        INSERT INTO audit_logs (action, module, description, performedBy, severity, isRead) VALUES
        ('CREATE', 'Equipment', 'CAT Excavator 320D dispatched to Downtown Site B.', 'Admin User', 'info', 0),
        ('ALERT', 'Safety', 'Safety Inspection cleared with 0 violations across active sites.', 'Sreyneang Kim', 'success', 0),
        ('CREATE', 'Materials', '2,500 Bags Kampot Cement received at Central Warehouse.', 'Dara Chea', 'info', 0),
        ('CREATE', 'Accounting', 'Invoiced $300,000.00 client mobilization payment for PP Tower Extension.', 'Bopha Meng', 'success', 1),
        ('UPDATE', 'Tasks', 'Updated task progress to 65% on Concrete Pouring B2 Substructure.', 'Vannak Heng', 'info', 1),
        ('UPDATE', 'Projects', 'Adjusted budget for National Road 3 Flyover to $4,500,000.00.', 'Admin User', 'warning', 1);
      `)
    }

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
