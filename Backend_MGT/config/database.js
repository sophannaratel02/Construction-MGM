import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
import { hashPassword } from '../utils/auth.js'

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

    const connection = await pool.getConnection()
    console.log('✓ Database connected successfully')

    const ensureColumn = async (table, column, definition) => {
      const [columns] = await connection.query(
        'SELECT COUNT(*) AS count FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?',
        [process.env.DB_NAME || 'construction_management', table, column]
      )

      if (columns[0].count === 0) {
        await connection.query(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`)
      }
    }

    await ensureColumn('projects', 'endDate', 'DATE NULL')
    await ensureColumn('projects', 'progress', 'INT NOT NULL DEFAULT 0')
    await ensureColumn('projects', 'description', 'LONGTEXT NULL')
    await ensureColumn('projects', 'userId', 'INT NULL')
    await ensureColumn('projects', 'approvedBy', 'INT NULL')
    await ensureColumn('projects', 'approvedAt', 'DATETIME NULL')
    await ensureColumn('projects', 'rejectionReason', 'TEXT NULL')
    await ensureColumn('staff', 'hireDate', 'DATE NULL')
    await ensureColumn('staff', 'department', 'VARCHAR(100) NULL')
    await ensureColumn('staff', 'image', 'LONGTEXT NULL')
    await ensureColumn('materials', 'description', 'LONGTEXT NULL')
    await ensureColumn('equipment', 'maintenanceDate', 'DATE NULL')
    await ensureColumn('equipment', 'location', 'VARCHAR(255) NULL')
    await ensureColumn('equipment', 'description', 'LONGTEXT NULL')
    await ensureColumn('tasks', 'description', 'LONGTEXT NULL')
    await ensureColumn('tasks', 'completedDate', 'DATE NULL')
    await ensureColumn('tasks', 'progress', 'INT NOT NULL DEFAULT 0')
    await ensureColumn('accounting', 'reference', 'VARCHAR(100) NULL')
    await ensureColumn('accounting', 'notes', 'LONGTEXT NULL')
    await ensureColumn('clients', 'city', 'VARCHAR(100) NULL')
    await ensureColumn('clients', 'state', 'VARCHAR(100) NULL')
    await ensureColumn('clients', 'zipCode', 'VARCHAR(20) NULL')
    await ensureColumn('clients', 'taxId', 'VARCHAR(50) NULL')
    await ensureColumn('suppliers', 'address', 'LONGTEXT NULL')
    await ensureColumn('suppliers', 'city', 'VARCHAR(100) NULL')
    await ensureColumn('suppliers', 'state', 'VARCHAR(100) NULL')
    await ensureColumn('suppliers', 'zipCode', 'VARCHAR(20) NULL')
    await ensureColumn('projects', 'client_id', 'INT NULL')
    await ensureColumn('materials', 'supplier_id', 'INT NULL')
    await ensureColumn('equipment', 'project_id', 'INT NULL')
    await ensureColumn('tasks', 'project_id', 'INT NULL')
    await ensureColumn('tasks', 'assigned_staff_id', 'INT NULL')
    await ensureColumn('accounting', 'project_id', 'INT NULL')

    await connection.query(`
      CREATE TABLE IF NOT EXISTS purchase_orders (
        id INT PRIMARY KEY AUTO_INCREMENT,
        po_number VARCHAR(50) UNIQUE NOT NULL,
        project_id INT NULL,
        supplier_id INT NULL,
        material_id INT NULL,
        quantity INT NOT NULL,
        unit_price DECIMAL(10, 2) NOT NULL,
        total_amount DECIMAL(15, 2) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'Pending',
        order_date DATE NOT NULL,
        expected_delivery DATE NULL,
        notes TEXT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
        FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL,
        FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE SET NULL,
        INDEX idx_po_number (po_number),
        INDEX idx_po_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)

    await connection.query(`
      CREATE TABLE IF NOT EXISTS site_daily_logs (
        id INT PRIMARY KEY AUTO_INCREMENT,
        project_id INT NOT NULL,
        log_date DATE NOT NULL,
        weather VARCHAR(50) NOT NULL DEFAULT 'Clear',
        headcount INT NOT NULL DEFAULT 0,
        work_summary LONGTEXT NOT NULL,
        delays_or_incidents LONGTEXT NULL,
        reported_by_staff_id INT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
        FOREIGN KEY (reported_by_staff_id) REFERENCES staff(id) ON DELETE SET NULL,
        INDEX idx_log_project_date (project_id, log_date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)

    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'user',
        is_active TINYINT(1) NOT NULL DEFAULT 1,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_role (role),
        CONSTRAINT chk_users_role CHECK (role IN ('admin', 'user'))
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)

    const [userColumns] = await connection.query(
      'SELECT COUNT(*) AS count FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?',
      [process.env.DB_NAME || 'construction_management', 'users', 'is_active']
    )

    if (userColumns[0].count === 0) {
      await connection.query('ALTER TABLE users ADD COLUMN is_active TINYINT(1) NOT NULL DEFAULT 1')
    }

    await connection.query(`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        token_hash VARCHAR(64) UNIQUE,
        expires_at DATETIME NOT NULL,
        used_at DATETIME NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_token_hash (token_hash)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)

    const [legacyTokenColumn] = await connection.query(
      'SELECT COUNT(*) AS count FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?',
      [process.env.DB_NAME || 'construction_management', 'password_reset_tokens', 'token']
    )
    if (legacyTokenColumn[0].count > 0) {
      await connection.query('ALTER TABLE password_reset_tokens MODIFY COLUMN token VARCHAR(255) NULL')
    }
    await ensureColumn('password_reset_tokens', 'token_hash', 'VARCHAR(64) NULL')
    await ensureColumn('password_reset_tokens', 'used_at', 'DATETIME NULL')

    const [legacyIndex] = await connection.query(
      'SELECT COUNT(*) AS count FROM INFORMATION_SCHEMA.STATISTICS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND INDEX_NAME = ?',
      [process.env.DB_NAME || 'construction_management', 'password_reset_tokens', 'idx_token']
    )
    if (legacyIndex[0].count > 0) {
      await connection.query('ALTER TABLE password_reset_tokens DROP INDEX idx_token')
    }
    const [tokenHashIndex] = await connection.query(
      'SELECT COUNT(*) AS count FROM INFORMATION_SCHEMA.STATISTICS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND INDEX_NAME = ?',
      [process.env.DB_NAME || 'construction_management', 'password_reset_tokens', 'idx_token_hash']
    )
    if (tokenHashIndex[0].count === 0) {
      await connection.query('ALTER TABLE password_reset_tokens ADD INDEX idx_token_hash (token_hash)')
    }

    await connection.query("UPDATE users SET role = 'user' WHERE role IS NULL OR role NOT IN ('admin', 'user')")
    const [roleConstraint] = await connection.query(
      'SELECT COUNT(*) AS count FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND CONSTRAINT_NAME = ?',
      [process.env.DB_NAME || 'construction_management', 'users', 'chk_users_role']
    )
    if (roleConstraint[0].count === 0) {
      try {
        await connection.query("ALTER TABLE users ADD CONSTRAINT chk_users_role CHECK (role IN ('admin', 'user'))")
      } catch (error) {
        console.warn('Role check constraint could not be added; application validation remains active.')
      }
    }

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

    await connection.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        project_id INT NULL,
        type VARCHAR(50) NOT NULL,
        message VARCHAR(500) NOT NULL,
        is_read TINYINT(1) NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
        INDEX idx_notifications_user_read (user_id, is_read),
        INDEX idx_notifications_project (project_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)

    const [userCount] = await connection.query('SELECT COUNT(*) AS count FROM users')
    if (userCount[0].count === 0) {
      const passwordHash = await hashPassword('Admin@123')
      await connection.query(
        'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
        ['Admin User', 'admin@cms.kh', passwordHash, 'admin']
      )
    }

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
