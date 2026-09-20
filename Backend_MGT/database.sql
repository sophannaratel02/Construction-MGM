-- Create database
CREATE DATABASE IF NOT EXISTS construction_management;
USE construction_management;

-- Users Table
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

-- Password Reset Tokens Table
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

-- Clients Table (moved up before projects for FK reference)
CREATE TABLE IF NOT EXISTS clients (
  id INT PRIMARY KEY AUTO_INCREMENT,
  companyName VARCHAR(255) NOT NULL,
  contactPerson VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address LONGTEXT NOT NULL,
  city VARCHAR(100),
  state VARCHAR(100),
  zipCode VARCHAR(20),
  taxId VARCHAR(50),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_companyName (companyName),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Suppliers Table (moved up before materials for FK reference)
CREATE TABLE IF NOT EXISTS suppliers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  companyName VARCHAR(255) NOT NULL,
  contactPerson VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  productCategory VARCHAR(100) NOT NULL,
  address LONGTEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  zipCode VARCHAR(20),
  taxId VARCHAR(50),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_companyName (companyName),
  INDEX idx_productCategory (productCategory),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Staff Table (moved up before tasks for FK reference)
CREATE TABLE IF NOT EXISTS staff (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  salary DECIMAL(15, 2) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Active',
  hireDate DATE,
  department VARCHAR(100),
  image LONGTEXT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_role (role),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  client VARCHAR(255) NOT NULL,
  client_id INT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Active',
  startDate DATE NOT NULL,
  endDate DATE,
  budget DECIMAL(15, 2) NOT NULL,
  progress INT DEFAULT 0,
  description LONGTEXT,
  userId INT NULL,
  approvedBy INT NULL,
  approvedAt DATETIME NULL,
  rejectionReason TEXT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL,
  INDEX idx_status (status),
  INDEX idx_startDate (startDate),
  INDEX idx_client_id (client_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Project approval notifications
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

-- Materials Table
CREATE TABLE IF NOT EXISTS materials (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  unitPrice DECIMAL(10, 2) NOT NULL,
  supplier VARCHAR(255) NOT NULL,
  supplier_id INT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Pending',
  description LONGTEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL,
  INDEX idx_category (category),
  INDEX idx_supplier (supplier),
  INDEX idx_supplier_id (supplier_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Equipment Table
CREATE TABLE IF NOT EXISTS equipment (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  serialNumber VARCHAR(100) UNIQUE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Available',
  purchaseDate DATE NOT NULL,
  cost DECIMAL(15, 2) NOT NULL,
  maintenanceDate DATE,
  location VARCHAR(255),
  project_id INT NULL,
  description LONGTEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
  INDEX idx_status (status),
  INDEX idx_type (type),
  INDEX idx_project_id (project_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  project VARCHAR(255) NOT NULL,
  project_id INT NULL,
  assignedTo VARCHAR(255) NOT NULL,
  assigned_staff_id INT NULL,
  description LONGTEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'Not Started',
  priority VARCHAR(50) NOT NULL DEFAULT 'Medium',
  dueDate DATE NOT NULL,
  completedDate DATE,
  progress INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_staff_id) REFERENCES staff(id) ON DELETE SET NULL,
  INDEX idx_status (status),
  INDEX idx_priority (priority),
  INDEX idx_project (project),
  INDEX idx_dueDate (dueDate),
  INDEX idx_tasks_project_id (project_id),
  INDEX idx_tasks_staff_id (assigned_staff_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Accounting Table
CREATE TABLE IF NOT EXISTS accounting (
  id INT PRIMARY KEY AUTO_INCREMENT,
  date DATE NOT NULL,
  description VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  reference VARCHAR(100),
  project_id INT NULL,
  notes LONGTEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
  INDEX idx_date (date),
  INDEX idx_type (type),
  INDEX idx_category (category),
  INDEX idx_accounting_project_id (project_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Purchase Orders Table (New Domain Table)
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

-- Site Daily Logs Table (New Domain Table)
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

-- Audit Logs Table
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

-- Clean existing sample data (optional reset for fresh import)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE notifications;
TRUNCATE TABLE purchase_orders;
TRUNCATE TABLE site_daily_logs;
TRUNCATE TABLE projects;
TRUNCATE TABLE staff;
TRUNCATE TABLE materials;
TRUNCATE TABLE equipment;
TRUNCATE TABLE tasks;
TRUNCATE TABLE accounting;
TRUNCATE TABLE clients;
TRUNCATE TABLE suppliers;
TRUNCATE TABLE audit_logs;
SET FOREIGN_KEY_CHECKS = 1;

-- Cambodian Construction Sample Data for Clients
INSERT INTO clients (id, companyName, contactPerson, email, phone, address, city, state, zipCode, taxId) VALUES
(1, 'ក្រុមហ៊ុន ជីប ម៉ុង គ្រុប', 'អ្នកឧកញ៉ា លាង ឃុន', 'info@chipmong.com', '023 888 999', 'អគារ ១៣៧B វិថីព្រះម៉ៅសេទុង សង្កាត់បឹងកេងកង១ ខណ្ឌបឹងកេងកង', 'ភ្នំពេញ', 'ភ្នំពេញ', '12302', 'K001-901823901'),
(2, 'ក្រុមហ៊ុន ប៉េង ហួត គ្រុប', 'ឧកញ៉ា ថៃ ជាហួត', 'contact@penghuoth.com', '023 999 111', 'ផ្ទះលេខ៩ បុរី ប៉េង ហួត ហ្គ្រេនស្តារផ្លាទីនីម ផ្លូវជាតិលេខ១ សង្កាត់ច្បារអំពៅ', 'ភ្នំពេញ', 'ភ្នំពេញ', '12354', 'K002-881239102'),
(3, 'ក្រុមហ៊ុន វើលដ៏ប្រ៊ីដ ឡេន', 'ឧកញ៉ា សៀ ឫទ្ធី', 'sales@worldbridgeland.com.kh', '023 222 333', 'អគារវើលដ៏ប្រ៊ីដ ថៅវើ ផ្លូវ៣៨៤ សង្កាត់ទន្លេបាសាក់ ខណ្ឌចំការមន', 'ភ្នំពេញ', 'ភ្នំពេញ', '12301', 'K003-112938103'),
(4, 'ក្រសួងសាធារណការ និងដឹកជញ្ជូន (MPWT)', 'ឯកឧត្តម ស៊ុន ចាន់ថុល', 'info@mpwt.gov.kh', '023 427 888', 'កែងផ្លូវ ៥៩៨ និងផ្លូវ ១០០៧ សង្កាត់ភ្នំពេញថ្មី ខណ្ឌសែនសុខ', 'ភ្នំពេញ', 'ភ្នំពេញ', '12101', 'GOV-MPWT-2024'),
(5, 'សណ្ឋាគារ និង រីសត សុខា', 'ឧកញ៉ា សុខ គង់', 'reservation@sokhahotels.com', '063 969 999', 'ផ្លូវ ៦០ម៉ែត្រ ភូមិស្វាយដង្គំ សង្កាត់ស្វាយដង្គំ', 'សៀមរាប', 'សៀមរាប', '17252', 'K005-773829105');

-- Cambodian Construction Sample Data for Suppliers
INSERT INTO suppliers (id, companyName, contactPerson, email, phone, productCategory, address, city, state, zipCode, taxId) VALUES
(1, 'ក្រុមហ៊ុន ស៊ីម៉ង់ត៍ កំពត (K-Cement)', 'អ៊ុំ សុថា', 'sales@k-cement.com.kh', '023 724 555', 'សម្ភារៈសំណង់', 'អគារភ្នំពេញថៅវើ ជាន់ទី១៨ មហាវិថីព្រះមុនីវង្ស', 'ភ្នំពេញ', 'ភ្នំពេញ', '12258', 'SUP-KMT-001'),
(2, 'ក្រុមហ៊ុន អាយអេសអាយ ស្ទីល (ISI Steel Cambodia)', 'កាំង ឡេង', 'info@isisteel.com.kh', '023 880 123', 'ដែក និងដែកសរសៃ', 'ផ្លូវវេងស្រេង ភូមិចោមចៅ សង្កាត់ចោមចៅ', 'ភ្នំពេញ', 'ភ្នំពេញ', '12405', 'SUP-ISI-002'),
(3, 'ក្រុមហ៊ុន រ៉ែ និងថ្មបំបែក កំពត', 'ជឹម សុវណ្ណ', 'orders@kampotquarry.kh', '033 968 111', 'ថ្មបំបែក និងគ្រួស', 'ផ្លូវជាតិលេខ ៣៣ ស្រុកទូកមាស', 'កំពត', 'កំពត', '07201', 'SUP-KMQ-003'),
(4, 'ក្រុមហ៊ុន សូម៉ា ត្រេឌីង អេន ខនស្ត្រាក់សិន', 'ក្រុមការងារសូម៉ា', 'supply@soma.com.kh', '023 986 789', 'ឧបករណ៍បំពង់ទឹក និងអគ្គិសនី', 'ផ្ទះលេខ ២C ផ្លូវ ២៨៩ សង្កាត់បឹងកក់១ ខណ្ឌទួលគោក', 'ភ្នំពេញ', 'ភ្នំពេញ', '12151', 'SUP-SOM-004'),
(5, 'ក្រុមហ៊ុន យូអឹមជី ខេមបូឌា (គ្រឿងចក្រធុនធ្ងន់)', 'ខេង សាម៉េត', 'machinery@umg.com.kh', '023 428 555', 'គ្រឿងចក្រធុនធ្ងន់', 'ផ្លូវជាតិលេខ ៤ ភូមិចោមចៅ ខណ្ឌពោធិ៍សែនជ័យ', 'ភ្នំពេញ', 'ភ្នំពេញ', '12406', 'SUP-UMG-005');

-- Cambodian Construction Sample Data for Staff
INSERT INTO staff (id, name, role, email, phone, salary, status, hireDate, department, image) VALUES
(1, 'សុខា ចាន់', 'អ្នកគ្រប់គ្រងគម្រោង (Project Manager)', 'sokha.chan@cms.kh', '012 888 901', 1500.00, 'Active', '2022-03-15', 'ផ្នែកគ្រប់គ្រង', '/staff_default.png'),
(2, 'វណ្ណៈ ហេង', 'វិស្វករការដ្ឋានជាន់ខ្ពស់ (Senior Site Engineer)', 'vannak.heng@cms.kh', '017 555 234', 1200.00, 'Active', '2022-06-01', 'ផ្នែកវិស្វកម្ម', '/staff_default.png'),
(3, 'ដារ៉ា ជា', 'អ្នកត្រួតពិនិត្យការដ្ឋាន (Site Supervisor)', 'dara.chea@cms.kh', '092 333 456', 900.00, 'Active', '2023-01-10', 'ផ្នែកប្រតិបត្តិការ', '/staff_default.png'),
(4, 'បុប្ផា ម៉េង', 'ប្រធានគណនេយ្យករ (Chief Accountant)', 'bopha.meng@cms.kh', '010 444 789', 1100.00, 'Active', '2021-11-20', 'ផ្នែកហិរញ្ញវត្ថុ', '/staff_default.png'),
(5, 'ស្រីនាង គឹម', 'អ្នកត្រួតពិនិត្យសុវត្ថិភាព និងគុណភាព (Safety Controller)', 'sreyneang.kim@cms.kh', '097 222 111', 850.00, 'Active', '2023-04-05', 'ផ្នែកសុវត្ថិភាព', '/staff_default.png'),
(6, 'ឫទ្ធី សុវណ្ណ', 'អ្នកបញ្ជាគ្រឿងចក្រធុនធ្ងន់ (Heavy Equipment Operator)', 'rithy.sovann@cms.kh', '088 666 999', 650.00, 'Active', '2023-08-12', 'ផ្នែកប្រតិបត្តិការ', '/staff_default.png');

-- Cambodian Construction Sample Data for Projects (linked to client_id)
INSERT INTO projects (id, name, client, client_id, status, startDate, budget, progress, description) VALUES
(1, 'គម្រោងពង្រីកអគារ ភ្នំពេញ ថៅវើ និងមជ្ឈមណ្ឌលពាណិជ្ជកម្ម', 'ក្រុមហ៊ុន ជីប ម៉ុង គ្រុប', 1, 'Active', '2024-01-15', 1500000.00, 45, 'ការពង្រីកអគារពាណិជ្ជកម្មកម្ពស់ច្រើនជាន់ រួមទាំងចំណតរថយន្តក្រោមដី ៣ ជាន់ និងតំបន់ហាងទំនិញប្រណីត។'),
(2, 'គម្រោងខុនដូប្រណីត BKK1 វគ្គ២', 'ក្រុមហ៊ុន វើលដ៏ប្រ៊ីដ ឡេន', 3, 'Active', '2024-02-01', 2800000.00, 30, 'អគារខុនដូស្នាក់នៅកម្ពស់ខ្ពស់ ជាមួយបរិក្ខារទំនើបៗនៅតំបន់បឹងកេងកង១។'),
(3, 'គម្រោងស្ពានអាកាស និងពង្រីកផ្លូវជាតិលេខ៣', 'ក្រសួងសាធារណការ និងដឹកជញ្ជូន (MPWT)', 4, 'Active', '2024-01-01', 4500000.00, 60, 'ការពង្រីកហេដ្ឋារចនាសម្ព័ន្ធផ្លូវល្បឿនលឿន និងការសាងសង់ស្ពានអាកាសឆ្លងកាត់ក្នុងខេត្តកណ្តាល។'),
(4, 'គម្រោងរមណីយដ្ឋានវប្បធម៌ សៀមរាប', 'សណ្ឋាគារ និង រីសត សុខា', 5, 'Pending', '2024-03-20', 1200000.00, 0, 'រមណីយដ្ឋានទេសចរណ៍បែបធម្មជាតិ និងវប្បធម៌កែច្នៃ ដោយផ្តោតលើស្ថាបត្យកម្មខ្មែរបុរាណ និងសេវាកម្មស្ប៉ា។'),
(5, 'គម្រោងឃ្លាំងលីស្ទីក កំពង់ផែស្វយ័តព្រះសីហនុ', 'កំពង់ផែស្វយ័តក្រុងព្រះសីហនុ', NULL, 'Active', '2023-11-10', 3200000.00, 75, 'ឃ្លាំងស្តុកទំនិញគ្រឿងដែកធុនធ្ងន់ និងលានកុងតឺន័រនៅកំពង់ផែស្វយ័ត។'),
(6, 'គម្រោងបុរី អេកូ រ៉េស៊ីដិនស៍ កណ្ដាល', 'ក្រុមហ៊ុន ប៉េង ហួត គ្រុប', 2, 'Completed', '2023-05-15', 950000.00, 100, 'គម្រោងបុរីវីឡាប្រណីត បំពាក់ដោយប្រព័ន្ធថាមពលព្រះអាទិត្យ និងបរិស្ថានបៃតង។');

-- Cambodian Construction Sample Data for Materials (linked to supplier_id)
INSERT INTO materials (id, name, category, unit, quantity, unitPrice, supplier, supplier_id, status, description) VALUES
(1, 'ស៊ីម៉ង់ត៍ កំពត ភ្នំមាស (K-Cement Portland Type 1)', 'សម្ភារៈសំណង់', 'បាវ', 2500, 6.80, 'ក្រុមហ៊ុន ស៊ីម៉ង់ត៍ កំពត (K-Cement)', 1, 'Approved', 'ស៊ីម៉ង់ត៍ម៉ាក K-Cement គុណភាពខ្ពស់ផលិតនៅខេត្តកំពត សម្រាប់ប្រព័ន្ធគ្រឹះ និងបេតុងអាម៉េ។'),
(2, 'ដែកសរសៃ អាយអេសអាយ មុខ ១៦ (ISI TMT Rebar 16mm)', 'ដែក និងគ្រឿងផ្គុំ', 'តោន', 350, 720.00, 'ក្រុមហ៊ុន អាយអេសអាយ ស្ទីល (ISI Steel Cambodia)', 2, 'Approved', 'ដែកសរសៃស្កាយ TMT កម្លាំងទប់ខ្ពស់សម្រាប់រចនាសម្ព័ន្ធបេតុងអាម៉េ។'),
(3, 'ឥដ្ឋក្រហម កំពង់ចាម (Kampong Cham Red Bricks)', 'ឥដ្ឋ និងបេតុង', 'ដុំ', 120000, 0.08, 'សិប្បកម្មឥដ្ឋក្រហម កំពង់ចាម', NULL, 'Approved', 'ឥដ្ឋក្រហមដុតគុណភាពល្អ សម្រាប់រៀបជញ្ជាំងអគារ និងបន្ទប់។'),
(4, 'ថ្មបំបែក ២x៤ កំពត (Kampot Blue Stone Gravel)', 'ថ្ម និងគ្រួស', 'តោន', 800, 22.00, 'ក្រុមហ៊ុន រ៉ែ និងថ្មបំបែក កំពត', 3, 'Approved', 'ថ្មបំបែកពណ៌ខៀវទំហំ ២០មម សម្រាប់ចាក់បេតុងអាម៉េការដ្ឋាន។'),
(5, 'បំពង់ទយោទឹក PVC សូម៉ា មុខ ១១០ (Soma Heavy Duty PVC Pipe)', 'ឧបករណ៍បំពង់ទឹក', 'ម៉ែត្រ', 1500, 8.50, 'ក្រុមហ៊ុន សូម៉ា ត្រេឌីង អេន ខនស្ត្រាក់សិន', 4, 'Approved', 'បំពង់ PVC ធន់កម្តៅថ្ងៃ សម្រាប់ប្រព័ន្ធរំដោះទឹកស្អុយ និងទឹកភ្លៀង។'),
(6, 'ខ្សាច់ភក់ និងខ្សាច់លាង ទន្លេមេគង្គ (Mekong River Sand)', 'ខ្សាច់ និងដី', 'តោន', 1200, 14.00, 'ក្រុមហ៊ុន អាជីវកម្មខ្សាច់ទន្លេមេគង្គ', NULL, 'Approved', 'ខ្សាច់ទន្លេលាងស្អាត សម្រាប់បូក និងចាក់បេតុង។');

-- Cambodian Construction Sample Data for Equipment (linked to project_id)
INSERT INTO equipment (id, name, type, serialNumber, status, purchaseDate, cost, location, project_id, description) VALUES
(1, 'គ្រឿងចក្រជីកដី CAT Excavator 320D', 'គ្រឿងចក្រជីកដី', 'CAT320D-KH-2023', 'Available', '2023-04-15', 180000.00, 'ការដ្ឋាន BKK1, រាជធានីភ្នំពេញ', 2, 'គ្រឿងចក្រជីកដីកង់ច្រវាក់ទម្ងន់ ២០តោន បំពាក់ចង្កួយកាយធុនធ្ងន់។'),
(2, 'គ្រឿងចក្រជីកដី Komatsu PC200 Excavator', 'គ្រឿងចក្រជីកដី', 'KOM-PC200-KH-088', 'In Use', '2023-06-20', 145000.00, 'ការដ្ឋានស្ពានអាកាស ផ្លូវជាតិលេខ៣, ខេត្តកណ្ដាល', 3, 'គ្រឿងចក្រជីកដីប្រព័ន្ធអ៊ីដ្រូលិច សម្រាប់ចំណាត់ការការងារដី និងគ្រឹះ។'),
(3, 'ស្ទូចចល័ត XCMG 50T Mobile Truck Crane', 'គ្រឿងចក្រស្ទូច', 'XCMG-50T-088-KH', 'Available', '2022-11-10', 210000.00, 'ការដ្ឋានរមណីយដ្ឋាន, ខេត្តសៀមរាប', 4, 'គ្រឿងចក្រស្ទូច ៥០តោន សម្រាប់លើកសម្ភារៈ និងរចនាសម្ព័ន្ធដែក/បេតុង។'),
(4, 'គ្រឿងចក្របូមបេតុង Sany HBT60 Concrete Pump', 'បូមបេតុង', 'SANY-PUMP-012-KH', 'In Use', '2023-09-01', 65000.00, 'ការដ្ឋានពង្រីកអគារ ភ្នំពេញថៅវើ, ភ្នំពេញ', 1, 'ម៉ាស៊ីនបូមបេតុងចល័តកម្លាំងខ្ពស់ សម្រាប់ចាក់បេតុងជាន់លើ និងជាន់ក្រោមដី។'),
(5, 'គ្រឿងចក្រជីក និងកាយ JCB 3CX Backhoe Loader', 'គ្រឿងចក្រជីកកាយ', 'JCB-3CX-2022-KH', 'Maintenance', '2022-01-15', 55000.00, 'យានដ្ឋានកណ្តាល, ពោធិ៍ចិនតុង ភ្នំពេញ', NULL, 'គ្រឿងចក្រជីកកាយពហុបំណង កំពុងស្ថិតក្រោមការថែទាំប្រព័ន្ធអ៊ីដ្រូលិច។');

-- Cambodian Construction Sample Data for Tasks (linked to project_id and assigned_staff_id)
INSERT INTO tasks (id, title, project, project_id, assignedTo, assigned_staff_id, status, priority, dueDate, progress, description) VALUES
(1, 'ចាក់បេតុងក្រាលគ្រឹះជាន់ក្រោមដី B2', 'គម្រោងខុនដូប្រណីត BKK1 វគ្គ២', 2, 'វណ្ណៈ ហេង', 2, 'In Progress', 'High', '2024-05-15', 65, 'ចាក់បេតុង ៤០០ ម៉ែត្រគូប បន្តបន្ទាប់សម្រាប់ក្រាលគ្រឹះជាន់ក្រោមដី។'),
(2, 'ជីកបុកគ្រឹះ និងតេស្តជម្រៅដី', 'គម្រោងពង្រីកអគារ ភ្នំពេញ ថៅវើ និងមជ្ឈមណ្ឌលពាណិជ្ជកម្ម', 1, 'សុខា ចាន់', 1, 'Completed', 'Critical', '2024-04-10', 100, 'បុកសសរគ្រឹះជំរៅជ្រៅ និងពិនិត្យគុណភាពដីដោយម៉ាស៊ីនអ៊ុលត្រាសោន។'),
(3, 'លើកតម្លើងធ្នឹមបេតុងស្ពានអាកាស', 'គម្រោងស្ពានអាកាស និងពង្រីកផ្លូវជាតិលេខ៣', 3, 'ដារ៉ា ជា', 3, 'In Progress', 'High', '2024-06-01', 40, 'លើកតម្លើងធ្នឹមបេតុងប្រវែង ៣៥ម៉ែត្រ ដោយប្រើស្ទូចកម្លាំង ១០០តោន។'),
(4, 'ពិនិត្យរចនាសម្ព័ន្ធអគារ និងប្រព័ន្ធការពារអគ្គិភ័យ', 'គម្រោងរមណីយដ្ឋានវប្បធម៌ សៀមរាប', 4, 'ស្រីនាង គឹម', 5, 'Not Started', 'Medium', '2024-06-20', 0, 'ត្រួតពិនិត្យរចនាសម្ព័ន្ធអាគារ និងបាញ់ថ្នាំការពារកម្តៅ/អគ្គិភ័យ។'),
(5, 'ដំឡើងប្រព័ន្ធអគ្គិសនី និងប្រព័ន្ធទឹក MEP', 'គម្រោងឃ្លាំងលីស្ទីក កំពង់ផែស្វយ័តព្រះសីហនុ', 5, 'បុប្ផា ម៉េង', 4, 'In Progress', 'Medium', '2024-05-30', 25, 'ដំឡើងទូបញ្ជាអគ្គិសនីមេ និងតភ្ជាប់ខ្សែបណ្តាញមេ។');

-- Cambodian Construction Sample Data for Accounting (linked to project_id)
INSERT INTO accounting (id, date, description, category, type, amount, reference, project_id, notes) VALUES
(1, '2024-03-01', 'ប្រាក់កក់ដំបូងគម្រោងពង្រីកអគារ ភ្នំពេញ ថៅវើ', 'ប្រាក់កក់ពីអតិថិជន', 'Income', 300000.00, 'REC-2024-001', 1, 'ប្រាក់កក់ដំណាក់កាលទី១ ទទួលបានតាមរយៈគណនីធនាគារ ABA។'),
(2, '2024-03-05', 'ទិញស៊ីម៉ង់ត៍ កំពត ចំនួន ២,៥០០ បាវ', 'ទិញសម្ភារៈសំណង់', 'Expense', 17000.00, 'INV-KMT-88', 1, 'ដឹកជញ្ជូនផ្ទាល់មកកាន់ឃ្លាំងស្តុកការដ្ឋាន ភ្នំពេញ។'),
(3, '2024-03-10', 'បើកប្រាក់បៀវត្សរ៍បុគ្គលិក និងកម្មករការដ្ឋានប្រចាំខែ', 'ប្រាក់បៀវត្សរ៍', 'Expense', 14500.00, 'PAY-2024-03', NULL, 'ផ្ទេរប្រាក់បៀវត្សរ៍ជូនបុគ្គលិកប្រចាំខែមីនា ឆ្នាំ២០២៤។'),
(4, '2024-03-15', 'ទូទាត់ដំណាក់កាលទី១ គម្រោងស្ពានអាកាសផ្លូវជាតិលេខ៣', 'ការទូទាត់តាមដំណាក់កាល', 'Income', 450000.00, 'REC-2024-002', 3, 'ក្រសួងសាធារណការ បានបញ្ជាក់ និងទូទាត់ដំណាក់កាលទី១។'),
(5, '2024-03-20', 'ជួលគ្រឿងចក្រ និងចំណាយប្រេងម៉ាស៊ូតការដ្ឋាន', 'ប្រេង និងគ្រឿងចក្រ', 'Expense', 22000.00, 'INV-FUEL-402', 3, 'ការផ្គត់ផ្គង់ប្រេងម៉ាស៊ូតសម្រាប់គ្រឿងចក្រជីក និងគ្រឿងស្ទូច។');

-- Cambodian Construction Sample Data for Purchase Orders
INSERT INTO purchase_orders (id, po_number, project_id, supplier_id, material_id, quantity, unit_price, total_amount, status, order_date, expected_delivery, notes) VALUES
(1, 'PO-2024-001', 1, 1, 1, 2500, 6.80, 17000.00, 'Delivered', '2024-03-01', '2024-03-05', 'ការបញ្ជាទិញស៊ីម៉ង់ត៍បន្ទាន់សម្រាប់ចាក់បេតុងគ្រឹះ។'),
(2, 'PO-2024-002', 2, 2, 2, 100, 720.00, 72000.00, 'Approved', '2024-03-10', '2024-03-25', 'ដែកសរសៃគុណភាពខ្ពស់ ដំណាក់កាលទី១។'),
(3, 'PO-2024-003', 3, 3, 4, 500, 22.00, 11000.00, 'Pending', '2024-03-15', '2024-03-30', 'ថ្មបំបែកពណ៌ខៀវសម្រាប់ចាក់សសរស្ពាន។');

-- Cambodian Construction Sample Data for Site Daily Logs
INSERT INTO site_daily_logs (id, project_id, log_date, weather, headcount, work_summary, delays_or_incidents, reported_by_staff_id) VALUES
(1, 1, '2024-03-15', 'ថ្ងៃស្រឡះ', 42, 'បញ្ចប់ការចាក់បេតុងបាតជាន់ក្រោមដី B2។ បានពិនិត្យតេស្តគុណភាពរួចរាល់។', 'គ្មានរបាយការណ៍ឧប្បត្តិហេតុទេ។', 2),
(2, 2, '2024-03-16', 'មានភ្លៀងធ្លាក់', 28, 'អាកាសធាតុភ្លៀងធ្លាក់ខ្លាំង ផ្អាកសកម្មភាពស្ទូច។ បន្តចងដែកសរសៃខាងក្នុងរោងការដ្ឋាន។', 'យឺតយ៉ាវ ២ ម៉ោង ដោយសារភ្លៀងធ្លាក់នៅពេលរសៀល។', 3),
(3, 3, '2024-03-17', 'ថ្ងៃស្រឡះ', 35, 'តម្លើងធ្នឹមបេតុងចំនួន ៤ ដើមលើសសរស្ពានទី៣ ដោយប្រើស្ទូច ១០០តោន។', 'ការត្រួតពិនិត្យបច្ចេកទេសប្រចាំថ្ងៃ បានជាប់ជាស្ថាពរ។', 1);

-- Sample Data for Audit Logs & System Notifications
INSERT INTO audit_logs (id, action, module, description, performedBy, severity, isRead) VALUES
(1, 'CREATE', 'Equipment', 'បានបញ្ជូនគ្រឿងចក្រជីកដី CAT 320D ទៅកាន់ការដ្ឋាន BKK1។', 'អ្នកប្រព័ន្ធ (Admin User)', 'info', 0),
(2, 'ALERT', 'Safety', 'ការត្រួតពិនិត្យសុវត្ថិភាពការដ្ឋាន បានឆ្លងផុតដោយគ្មានកំហុស។', 'ស្រីនាង គឹម', 'success', 0),
(3, 'CREATE', 'Materials', 'ទទួលបានស៊ីម៉ង់ត៍កំពតចំនួន ២,៥០០ បាវ នៅឃ្លាំងកណ្តាល។', 'ដារ៉ា ជា', 'info', 0),
(4, 'CREATE', 'Accounting', 'បានចេញវិក្កយបត្រប្រាក់កក់ $300,000.00 សម្រាប់គម្រោងពង្រីកអគារ ភ្នំពេញថៅវើ។', 'បុប្ផា ម៉េង', 'success', 1),
(5, 'UPDATE', 'Tasks', 'បានធ្វើបច្ចុប្បន្នភាពវឌ្ឍនភាពការងារដល់ ៦៥% លើការចាក់បេតុង B2។', 'វណ្ណៈ ហេង', 'info', 1),
(6, 'UPDATE', 'Projects', 'បានកែសម្រួលថវិកាគម្រោងស្ពានអាកាសផ្លូវជាតិលេខ៣ ទៅ $4,500,000.00។', 'អ្នកប្រព័ន្ធ (Admin User)', 'warning', 1);

