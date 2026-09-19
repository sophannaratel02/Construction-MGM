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
(1, 'Chip Mong Group Co., Ltd.', 'Neak Oknha Leang Khun', 'info@chipmong.com', '023 888 999', '#137B, Mao Tse Toung Blvd, Boeung Keng Kang I', 'Phnom Penh', 'Phnom Penh', '12302', 'K001-901823901'),
(2, 'Peng Huoth Group', 'Oknha Thay Chea Huoth', 'contact@penghuoth.com', '023 999 111', '#9, Grand Star Platinum, National Road 1, Chbar Ampov', 'Phnom Penh', 'Phnom Penh', '12354', 'K002-881239102'),
(3, 'Worldbridge Land Cambodia', 'Oknha Sear Rithy', 'sales@worldbridgeland.com.kh', '023 222 333', 'Worldbridge Tower, St 384, Tonle Bassac', 'Phnom Penh', 'Phnom Penh', '12301', 'K003-112938103'),
(4, 'Ministry of Public Works and Transport (MPWT)', 'H.E. Sun Chanthol', 'info@mpwt.gov.kh', '023 427 888', 'Corner St 598 & St 1007, Khan Sen Sok', 'Phnom Penh', 'Phnom Penh', '12101', 'GOV-MPWT-2024'),
(5, 'Sokha Hotel & Resorts', 'Oknha Sok Kong', 'reservation@sokhahotels.com', '063 969 999', 'Road 60, Svay Dangkum', 'Siem Reap', 'Siem Reap', '17252', 'K005-773829105');

-- Cambodian Construction Sample Data for Suppliers
INSERT INTO suppliers (id, companyName, contactPerson, email, phone, productCategory, address, city, state, zipCode, taxId) VALUES
(1, 'Kampot Cement Co., Ltd. (K-Cement)', 'Oum Sotha', 'sales@k-cement.com.kh', '023 724 555', 'Building Materials', 'Phnom Penh Tower, Floor 18, Monivong Blvd', 'Phnom Penh', 'Phnom Penh', '12258', 'SUP-KMT-001'),
(2, 'ISI Steel Cambodia Co., Ltd.', 'Kang Leng', 'info@isisteel.com.kh', '023 880 123', 'Steel & Rebar', 'Veng Sreng Street, Choam Chao, Por Senchey', 'Phnom Penh', 'Phnom Penh', '12405', 'SUP-ISI-002'),
(3, 'Kampot Mining Quarry Co.', 'Chem Sovann', 'orders@kampotquarry.kh', '033 968 111', 'Aggregates & Stone', 'National Road 33, Touk Meas', 'Kampot', 'Kampot', '07201', 'SUP-KMQ-003'),
(4, 'Soma Trading & Construction Supply', 'Soma Group', 'supply@soma.com.kh', '023 986 789', 'Plumbing & Electrical', '#2C, Street 289, Boeung Kak 1, Toul Kork', 'Phnom Penh', 'Phnom Penh', '12151', 'SUP-SOM-004'),
(5, 'Umg Cambodia Co., Ltd. (Heavy Machinery)', 'Kheng Sameth', 'machinery@umg.com.kh', '023 428 555', 'Heavy Machinery', 'National Road 4, Phum Chom Chao', 'Phnom Penh', 'Phnom Penh', '12406', 'SUP-UMG-005');

-- Cambodian Construction Sample Data for Staff
INSERT INTO staff (id, name, role, email, phone, salary, status, hireDate, department, image) VALUES
(1, 'Sokha Chan', 'Project Manager', 'sokha.chan@cms.kh', '012 888 901', 1500.00, 'Active', '2022-03-15', 'Management', '/staff_default.png'),
(2, 'Vannak Heng', 'Senior Site Engineer', 'vannak.heng@cms.kh', '017 555 234', 1200.00, 'Active', '2022-06-01', 'Engineering', '/staff_default.png'),
(3, 'Dara Chea', 'Site Supervisor', 'dara.chea@cms.kh', '092 333 456', 900.00, 'Active', '2023-01-10', 'Operations', '/staff_default.png'),
(4, 'Bopha Meng', 'Chief Financial Accountant', 'bopha.meng@cms.kh', '010 444 789', 1100.00, 'Active', '2021-11-20', 'Finance', '/staff_default.png'),
(5, 'Sreyneang Kim', 'Safety & Quality Controller', 'sreyneang.kim@cms.kh', '097 222 111', 850.00, 'Active', '2023-04-05', 'Safety', '/staff_default.png'),
(6, 'Rithy Sovann', 'Heavy Equipment Operator', 'rithy.sovann@cms.kh', '088 666 999', 650.00, 'Active', '2023-08-12', 'Operations', '/staff_default.png');

-- Cambodian Construction Sample Data for Projects (linked to client_id)
INSERT INTO projects (id, name, client, client_id, status, startDate, budget, progress, description) VALUES
(1, 'Phnom Penh Tower Extension & Commercial Hub', 'Chip Mong Group Co., Ltd.', 1, 'Active', '2024-01-15', 1500000.00, 45, 'Multi-story commercial extension including 3 basement parking levels and premium retail spaces.'),
(2, 'BKK1 Luxury Condominium Phase 2', 'Worldbridge Land Cambodia', 3, 'Active', '2024-02-01', 2800000.00, 30, 'High-rise residential condominium building with modern facilities in Boeung Keng Kang 1.'),
(3, 'National Road 3 Flyover & Bridge Expansion', 'Ministry of Public Works and Transport (MPWT)', 4, 'Active', '2024-01-01', 4500000.00, 60, 'Infrastructure highway expansion and grade-separated flyover construction in Kandal Province.'),
(4, 'Siem Reap Cultural Resort Complex', 'Sokha Hotel & Resorts', 5, 'Pending', '2024-03-20', 1200000.00, 0, 'Eco-friendly luxury resort complex featuring traditional Khmer architecture and spa amenities.'),
(5, 'Sihanoukville Logistics Port Warehouse', 'Pas Sihanoukville Autonomous Port', NULL, 'Active', '2023-11-10', 3200000.00, 75, 'Heavy-duty steel frame logistics warehouse and container yard terminal.'),
(6, 'Kandal Smart Eco-Residential Park', 'Peng Huoth Group', 2, 'Completed', '2023-05-15', 950000.00, 100, 'Gated luxury residential villa housing project featuring solar amenities.');

-- Cambodian Construction Sample Data for Materials (linked to supplier_id)
INSERT INTO materials (id, name, category, unit, quantity, unitPrice, supplier, supplier_id, status, description) VALUES
(1, 'K-Cement Portland Type 1', 'Building Materials', 'Bag', 2500, 6.80, 'Kampot Cement Co., Ltd.', 1, 'Approved', 'High grade Portland cement manufactured in Kampot.'),
(2, 'ISI High-Yield TMT Deformed Rebar 16mm', 'Steel', 'Ton', 350, 720.00, 'ISI Steel Cambodia Co., Ltd.', 2, 'Approved', 'High-tensile steel rebar for structural reinforced concrete.'),
(3, 'Kampong Cham Red Clay Bricks', 'Masonry', 'Piece', 120000, 0.08, 'Chhoeung Red Brick Factory', NULL, 'Approved', 'Kiln-burned red clay solid bricks for partition walls.'),
(4, 'Kampot Quarry Blue Stone Gravel', 'Aggregates', 'Ton', 800, 22.00, 'Kampot Mining Quarry Co.', 3, 'Approved', 'Crushed blue granite stone 20mm for concrete mix.'),
(5, 'Soma Heavy Duty PVC Drainage Pipe', 'Plumbing', 'Meter', 1500, 8.50, 'Soma Trading & Construction Supply', 4, 'Approved', '110mm UV resistant PVC sewer drainage pipe.'),
(6, 'Phnom Penh Mekong River Sand', 'Aggregates', 'Ton', 1200, 14.00, 'Mekong Sand Dredging Ltd.', NULL, 'Approved', 'Washed fine river sand for plastering and concrete.');

-- Cambodian Construction Sample Data for Equipment (linked to project_id)
INSERT INTO equipment (id, name, type, serialNumber, status, purchaseDate, cost, location, project_id, description) VALUES
(1, 'CAT Excavator 320D', 'Excavator', 'CAT320D-KH-2023', 'Available', '2023-04-15', 180000.00, 'BKK1 Site, Phnom Penh', 2, '20-ton crawler excavator with heavy bucket attachment.'),
(2, 'Komatsu PC200 Excavator', 'Excavator', 'KOM-PC200-KH-088', 'In Use', '2023-06-20', 145000.00, 'NR3 Flyover Site, Kandal', 3, 'Hydraulic excavator deployed for earthworks.'),
(3, 'XCMG 50T Mobile Truck Crane', 'Crane', 'XCMG-50T-088-KH', 'Available', '2022-11-10', 210000.00, 'Siem Reap Resort Site', 4, '50-ton telescopic boom truck crane for structural hoisting.'),
(4, 'Sany HBT60 Concrete Trailer Pump', 'Concrete Pump', 'SANY-PUMP-012-KH', 'In Use', '2023-09-01', 65000.00, 'PP Tower Extension Site', 1, 'Stationary trailer concrete pump with high vertical reach.'),
(5, 'JCB 3CX Backhoe Loader', 'Loader', 'JCB-3CX-2022-KH', 'Maintenance', '2022-01-15', 55000.00, 'Central Yard, Pochentong', NULL, 'Multipurpose backhoe loader under routine hydraulic service.');

-- Cambodian Construction Sample Data for Tasks (linked to project_id and assigned_staff_id)
INSERT INTO tasks (id, title, project, project_id, assignedTo, assigned_staff_id, status, priority, dueDate, progress, description) VALUES
(1, 'Concrete Pouring for B2 Substructure', 'BKK1 Luxury Condominium Phase 2', 2, 'Vannak Heng', 2, 'In Progress', 'High', '2024-05-15', 65, 'Continuous 400m3 concrete pouring for basement raft slab.'),
(2, 'Deep Foundation Piling & Soil Testing', 'Phnom Penh Tower Extension & Commercial Hub', 1, 'Sokha Chan', 1, 'Completed', 'Critical', '2024-04-10', 100, 'Bored pile drilling and ultrasonic pile integrity testing.'),
(3, 'Pre-stressed Concrete Girder Launching', 'National Road 3 Flyover & Bridge Expansion', 3, 'Dara Chea', 3, 'In Progress', 'High', '2024-06-01', 40, 'Positioning 35m pre-cast concrete girders using 100T crane.'),
(4, 'Structural Frame Inspection & Fireproofing', 'Siem Reap Cultural Resort Complex', 4, 'Sreyneang Kim', 5, 'Not Started', 'Medium', '2024-06-20', 0, 'Third-party structural inspection and intumescent coating.'),
(5, 'MEP & Electrical Substation Installation', 'Sihanoukville Logistics Port Warehouse', 5, 'Bopha Meng', 4, 'In Progress', 'Medium', '2024-05-30', 25, 'Main switchboard cable routing and transformer setup.');

-- Cambodian Construction Sample Data for Accounting (linked to project_id)
INSERT INTO accounting (id, date, description, category, type, amount, reference, project_id, notes) VALUES
(1, '2024-03-01', 'Initial Mobilization Deposit - PP Tower Project', 'Client Payment', 'Income', 300000.00, 'REC-2024-001', 1, 'First advance milestone payment received via ABA Bank.'),
(2, '2024-03-05', 'Procurement of 2,500 Bags Kampot Cement', 'Material Purchase', 'Expense', 17000.00, 'INV-KMT-88', 1, 'Direct delivery to Phnom Penh site storehouse.'),
(3, '2024-03-10', 'Monthly Field Staff & Operator Payroll', 'Payroll', 'Expense', 14500.00, 'PAY-2024-03', NULL, 'Monthly staff salaries transfer for March 2024.'),
(4, '2024-03-15', 'Progress Milestone Billing - NR3 Flyover Phase 1', 'Client Payment', 'Income', 450000.00, 'REC-2024-002', 3, 'MPWT certified completion milestone 1 payment.'),
(5, '2024-03-20', 'Heavy Equipment Leasing & Diesel Fuel Allocation', 'Equipment & Fuel', 'Expense', 22000.00, 'INV-FUEL-402', 3, 'Diesel fuel supply for excavators and mobile crane fleet.');

-- Cambodian Construction Sample Data for Purchase Orders
INSERT INTO purchase_orders (id, po_number, project_id, supplier_id, material_id, quantity, unit_price, total_amount, status, order_date, expected_delivery, notes) VALUES
(1, 'PO-2024-001', 1, 1, 1, 2500, 6.80, 17000.00, 'Delivered', '2024-03-01', '2024-03-05', 'Urgent cement order for foundation slab.'),
(2, 'PO-2024-002', 2, 2, 2, 100, 720.00, 72000.00, 'Approved', '2024-03-10', '2024-03-25', 'High-yield rebar steel batch 1.'),
(3, 'PO-2024-003', 3, 3, 4, 500, 22.00, 11000.00, 'Pending', '2024-03-15', '2024-03-30', 'Blue stone aggregates for bridge piers.');

-- Cambodian Construction Sample Data for Site Daily Logs
INSERT INTO site_daily_logs (id, project_id, log_date, weather, headcount, work_summary, delays_or_incidents, reported_by_staff_id) VALUES
(1, 1, '2024-03-15', 'Clear', 42, 'Completed basement level 2 concrete pouring. Ultrasonic testing verified.', 'None reported.', 2),
(2, 2, '2024-03-16', 'Rainy', 28, 'Tower crane operation halted due to heavy rain. Indoor rebar binding continued.', '2 hours weather delay in afternoon.', 3),
(3, 3, '2024-03-17', 'Clear', 35, 'Positioned 4 pre-cast concrete girders on pier 3 using 100T crane.', 'Routine inspection passed.', 1);

-- Sample Data for Audit Logs & System Notifications
INSERT INTO audit_logs (id, action, module, description, performedBy, severity, isRead) VALUES
(1, 'CREATE', 'Equipment', 'CAT Excavator 320D dispatched to Downtown Site B.', 'Admin User', 'info', 0),
(2, 'ALERT', 'Safety', 'Safety Inspection cleared with 0 violations across active sites.', 'Sreyneang Kim', 'success', 0),
(3, 'CREATE', 'Materials', '2,500 Bags Kampot Cement received at Central Warehouse.', 'Dara Chea', 'info', 0),
(4, 'CREATE', 'Accounting', 'Invoiced $300,000.00 client mobilization payment for PP Tower Extension.', 'Bopha Meng', 'success', 1),
(5, 'UPDATE', 'Tasks', 'Updated task progress to 65% on Concrete Pouring B2 Substructure.', 'Vannak Heng', 'info', 1),
(6, 'UPDATE', 'Projects', 'Adjusted budget for National Road 3 Flyover to $4,500,000.00.', 'Admin User', 'warning', 1);
