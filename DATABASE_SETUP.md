# MySQL Setup Guide

## Installation

### Windows

1. **Download MySQL Community Server:**
   - Visit https://dev.mysql.com/downloads/mysql/
   - Download MySQL 8.0 or latest

2. **Install MySQL:**
   - Run the installer
   - Follow the installation wizard
   - Default port: 3306

3. **Download MySQL Workbench (GUI Tool):**
   - Visit https://dev.mysql.com/downloads/workbench/
   - Install it for easier database management

### Linux

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install mysql-server

# CentOS/RHEL
sudo yum install mysql-server
```

### macOS

```bash
# Using Homebrew
brew install mysql
```

## Starting MySQL Service

### Windows
- MySQL starts automatically as a service
- Or use: `net start MySQL80` (replace 80 with your version)

### Linux
```bash
sudo systemctl start mysql
sudo systemctl enable mysql  # Enable on boot
```

### macOS
```bash
brew services start mysql
```

## Creating the Database

### Method 1: Using Command Line

```bash
# Connect to MySQL
mysql -u root -p

# Paste all commands from database.sql
# Or:
mysql -u root -p < Backend_MGT/database.sql
```

### Method 2: Using MySQL Workbench

1. Open MySQL Workbench
2. File → Open SQL Script
3. Select Backend_MGT/database.sql
4. Execute the script (Lightning icon or Ctrl+Shift+Enter)

### Method 3: Using PhpMyAdmin

1. Go to `http://localhost/phpmyadmin`
2. Import → Select database.sql file
3. Click Import

## Verify Database Creation

```bash
mysql -u root -p
mysql> SHOW DATABASES;
mysql> USE construction_management;
mysql> SHOW TABLES;
mysql> SELECT COUNT(*) FROM projects;
```

You should see:
- Database: `construction_management`
- 8 tables: projects, staff, materials, equipment, tasks, accounting, clients, suppliers
- Sample data in each table

## Database Tables & Fields

### projects
| Field | Type | Notes |
|-------|------|-------|
| id | INT | Primary key |
| name | VARCHAR(255) | Project name |
| client | VARCHAR(255) | Client name |
| status | VARCHAR(50) | Active/Pending/Completed/On Hold |
| startDate | DATE | Project start |
| endDate | DATE | Project end |
| budget | DECIMAL(15,2) | Budget amount |
| progress | INT | Progress 0-100 |
| description | LONGTEXT | Description |
| createdAt | TIMESTAMP | Auto |
| updatedAt | TIMESTAMP | Auto |

### staff
| Field | Type | Notes |
|-------|------|-------|
| id | INT | Primary key |
| name | VARCHAR(255) | Staff name |
| role | VARCHAR(100) | Job role |
| email | VARCHAR(255) | Email (unique) |
| phone | VARCHAR(20) | Phone number |
| salary | DECIMAL(15,2) | Salary |
| status | VARCHAR(50) | Active/Inactive |
| hireDate | DATE | Hire date |
| department | VARCHAR(100) | Department |

### materials
| Field | Type | Notes |
|-------|------|-------|
| id | INT | Primary key |
| name | VARCHAR(255) | Material name |
| category | VARCHAR(100) | Category |
| unit | VARCHAR(50) | Unit (kg, meters, etc) |
| quantity | INT | Stock quantity |
| unitPrice | DECIMAL(10,2) | Price per unit |
| supplier | VARCHAR(255) | Supplier name |

### equipment
| Field | Type | Notes |
|-------|------|-------|
| id | INT | Primary key |
| name | VARCHAR(255) | Equipment name |
| type | VARCHAR(100) | Type |
| serialNumber | VARCHAR(100) | Serial (unique) |
| status | VARCHAR(50) | Available/In Use/Maintenance |
| purchaseDate | DATE | Purchase date |
| cost | DECIMAL(15,2) | Equipment cost |
| maintenanceDate | DATE | Last maintenance |
| location | VARCHAR(255) | Current location |

### tasks
| Field | Type | Notes |
|-------|------|-------|
| id | INT | Primary key |
| title | VARCHAR(255) | Task title |
| project | VARCHAR(255) | Associated project |
| assignedTo | VARCHAR(255) | Assigned staff |
| description | LONGTEXT | Description |
| status | VARCHAR(50) | Not Started/In Progress/Completed/On Hold |
| priority | VARCHAR(50) | Low/Medium/High/Critical |
| dueDate | DATE | Due date |
| completedDate | DATE | Completion date |
| progress | INT | Progress 0-100 |

### accounting
| Field | Type | Notes |
|-------|------|-------|
| id | INT | Primary key |
| date | DATE | Transaction date |
| description | VARCHAR(255) | Description |
| category | VARCHAR(100) | Category |
| type | VARCHAR(50) | Income/Expense |
| amount | DECIMAL(15,2) | Amount |
| reference | VARCHAR(100) | Reference number |
| notes | LONGTEXT | Notes |

### clients
| Field | Type | Notes |
|-------|------|-------|
| id | INT | Primary key |
| companyName | VARCHAR(255) | Company name |
| contactPerson | VARCHAR(255) | Contact person |
| email | VARCHAR(255) | Email (unique) |
| phone | VARCHAR(20) | Phone |
| address | LONGTEXT | Address |
| city | VARCHAR(100) | City |
| state | VARCHAR(100) | State/Province |
| zipCode | VARCHAR(20) | Postal code |

### suppliers
| Field | Type | Notes |
|-------|------|-------|
| id | INT | Primary key |
| companyName | VARCHAR(255) | Company name |
| contactPerson | VARCHAR(255) | Contact person |
| email | VARCHAR(255) | Email (unique) |
| phone | VARCHAR(20) | Phone |
| productCategory | VARCHAR(100) | Category |
| address | LONGTEXT | Address |
| city | VARCHAR(100) | City |
| state | VARCHAR(100) | State/Province |

## Backup & Restore

### Backup Database

```bash
# Backup entire database
mysqldump -u root -p construction_management > backup.sql

# Backup specific table
mysqldump -u root -p construction_management projects > projects_backup.sql
```

### Restore Database

```bash
# Restore entire database
mysql -u root -p construction_management < backup.sql

# Restore from fresh
mysql -u root -p < database.sql
```

## User Management

### Change Root Password

```bash
mysql -u root -p
mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'newpassword';
mysql> FLUSH PRIVILEGES;
mysql> exit;
```

### Create New User

```bash
mysql -u root -p
mysql> CREATE USER 'appuser'@'localhost' IDENTIFIED BY 'apppassword';
mysql> GRANT ALL PRIVILEGES ON construction_management.* TO 'appuser'@'localhost';
mysql> FLUSH PRIVILEGES;
mysql> exit;
```

### Update Backend .env

```
DB_USER=appuser
DB_PASSWORD=apppassword
```

## Troubleshooting

### MySQL Service Won't Start

**Windows:**
```bash
# Check service
sc query MySQL80

# Start service
net start MySQL80

# Stop service
net stop MySQL80
```

**Linux:**
```bash
sudo systemctl status mysql
sudo systemctl restart mysql
```

### "Access Denied" Error

1. Verify username and password
2. Check `.env` file for typos
3. Reset root password:
   ```bash
   # Stop MySQL
   # Use recovery mode
   # Reset password
   ```

### "Database Does Not Exist"

1. Run database.sql script again
2. Verify with: `SHOW DATABASES;`
3. Check for typos in DB_NAME in .env

### Connection Timeout

1. Verify MySQL is running
2. Check DB_HOST (usually localhost)
3. Check DB_PORT (usually 3306)
4. Check firewall settings

### Table Not Found

1. Verify database is selected: `USE construction_management;`
2. List tables: `SHOW TABLES;`
3. Re-run database.sql if needed

## Sample Data

The database includes pre-loaded sample data for testing:

```
Projects: 5 records
Staff: 5 records
Materials: 5 records
Equipment: 5 records
Tasks: 5 records
Accounting: 5 records
Clients: 5 records
Suppliers: 5 records
```

You can delete this data and add your own through the application UI.

## Performance Tips

1. **Indexes:** All frequently queried fields have indexes
2. **UTF-8 Support:** Full Unicode support for international characters
3. **InnoDB Engine:** Transactional support and referential integrity
4. **Auto Timestamps:** Created and updated dates are automatic

## Security Notes

For production:

1. **Change default password immediately**
2. **Create separate DB user with limited privileges**
3. **Use strong passwords (12+ characters)**
4. **Enable MySQL SSL**
5. **Restrict network access**
6. **Regular backups**
7. **Use environment variables for credentials**

Example secure setup:

```sql
CREATE USER 'cms_app'@'localhost' IDENTIFIED BY 'SecureP@ssw0rd!';
GRANT SELECT, INSERT, UPDATE, DELETE ON construction_management.* TO 'cms_app'@'localhost';
FLUSH PRIVILEGES;
```

## Regular Maintenance

### Check Database Size

```bash
mysql -u root -p
mysql> SELECT table_schema, ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) as Size_MB FROM information_schema.TABLES GROUP BY table_schema;
```

### Optimize Tables

```bash
mysql -u root -p
mysql> OPTIMIZE TABLE projects;
mysql> OPTIMIZE TABLE staff;
```

### Check Database Status

```bash
mysql -u root -p
mysql> SHOW ENGINE INNODB STATUS;
```

## Useful MySQL Commands

```bash
# Login
mysql -u root -p

# Show databases
SHOW DATABASES;

# Create database
CREATE DATABASE construction_management;

# Use database
USE construction_management;

# Show tables
SHOW TABLES;

# Describe table
DESCRIBE projects;

# Show table structure
SHOW CREATE TABLE projects;

# Count records
SELECT COUNT(*) FROM projects;

# Show data
SELECT * FROM projects LIMIT 10;

# Exit
EXIT;
```

## Additional Resources

- MySQL Official: https://dev.mysql.com
- MySQL Documentation: https://dev.mysql.com/doc/
- MySQL Workbench: https://dev.mysql.com/workbench/
- phpMyAdmin: https://www.phpmyadmin.net/

---

Your database is now ready! Proceed to Backend setup in QUICK_START.md
