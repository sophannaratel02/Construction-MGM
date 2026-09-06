-- Create database
CREATE DATABASE IF NOT EXISTS construction_management;
USE construction_management;

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  client VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Active',
  startDate DATE NOT NULL,
  endDate DATE,
  budget DECIMAL(15, 2) NOT NULL,
  progress INT DEFAULT 0,
  description LONGTEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_startDate (startDate)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Staff Table
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

-- Materials Table
CREATE TABLE IF NOT EXISTS materials (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  unitPrice DECIMAL(10, 2) NOT NULL,
  supplier VARCHAR(255) NOT NULL,
  description LONGTEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_supplier (supplier)
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
  description LONGTEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  project VARCHAR(255) NOT NULL,
  assignedTo VARCHAR(255) NOT NULL,
  description LONGTEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'Not Started',
  priority VARCHAR(50) NOT NULL DEFAULT 'Medium',
  dueDate DATE NOT NULL,
  completedDate DATE,
  progress INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_priority (priority),
  INDEX idx_project (project),
  INDEX idx_dueDate (dueDate)
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
  notes LONGTEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_date (date),
  INDEX idx_type (type),
  INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Clients Table
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

-- Suppliers Table
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
TRUNCATE TABLE projects;
TRUNCATE TABLE staff;
TRUNCATE TABLE materials;
TRUNCATE TABLE equipment;
TRUNCATE TABLE tasks;
TRUNCATE TABLE accounting;
TRUNCATE TABLE clients;
TRUNCATE TABLE suppliers;
TRUNCATE TABLE audit_logs;

-- Cambodian Construction Sample Data for Projects
INSERT INTO projects (name, client, status, startDate, budget, progress, description) VALUES
('Phnom Penh Tower Extension & Commercial Hub', 'Chip Mong Group Co., Ltd.', 'Active', '2024-01-15', 1500000.00, 45, 'Multi-story commercial extension including 3 basement parking levels and premium retail spaces.'),
('BKK1 Luxury Condominium Phase 2', 'Worldbridge Land Cambodia', 'Active', '2024-02-01', 2800000.00, 30, 'High-rise residential condominium building with modern facilities in Boeung Keng Kang 1.'),
('National Road 3 Flyover & Bridge Expansion', 'Ministry of Public Works and Transport (MPWT)', 'Active', '2024-01-01', 4500000.00, 60, 'Infrastructure highway expansion and grade-separated flyover construction in Kandal Province.'),
('Siem Reap Cultural Resort Complex', 'Sokha Hotel & Resorts', 'Pending', '2024-03-20', 1200000.00, 0, 'Eco-friendly luxury resort complex featuring traditional Khmer architecture and spa amenities.'),
('Sihanoukville Logistics Port Warehouse', 'Pas Sihanoukville Autonomous Port', 'Active', '2023-11-10', 3200000.00, 75, 'Heavy-duty steel frame logistics warehouse and container yard terminal.'),
('Kandal Smart Eco-Residential Park', 'Peng Huoth Group', 'Completed', '2023-05-15', 950000.00, 100, 'Gated luxury residential villa housing project featuring solar amenities.');

-- Cambodian Construction Sample Data for Staff
INSERT INTO staff (name, role, email, phone, salary, status, hireDate, department, image) VALUES
('Sokha Chan', 'Project Manager', 'sokha.chan@cms.kh', '012 888 901', 1500.00, 'Active', '2022-03-15', 'Management', '/staff_default.png'),
('Vannak Heng', 'Senior Site Engineer', 'vannak.heng@cms.kh', '017 555 234', 1200.00, 'Active', '2022-06-01', 'Engineering', '/staff_default.png'),
('Dara Chea', 'Site Supervisor', 'dara.chea@cms.kh', '092 333 456', 900.00, 'Active', '2023-01-10', 'Operations', '/staff_default.png'),
('Bopha Meng', 'Chief Financial Accountant', 'bopha.meng@cms.kh', '010 444 789', 1100.00, 'Active', '2021-11-20', 'Finance', '/staff_default.png'),
('Sreyneang Kim', 'Safety & Quality Controller', 'sreyneang.kim@cms.kh', '097 222 111', 850.00, 'Active', '2023-04-05', 'Safety', '/staff_default.png'),
('Rithy Sovann', 'Heavy Equipment Operator', 'rithy.sovann@cms.kh', '088 666 999', 650.00, 'Active', '2023-08-12', 'Operations', '/staff_default.png');

-- Cambodian Construction Sample Data for Materials
INSERT INTO materials (name, category, unit, quantity, unitPrice, supplier, description) VALUES
('K-Cement Portland Type 1', 'Building Materials', 'Bag', 2500, 6.80, 'Kampot Cement Co., Ltd.', 'High grade Portland cement manufactured in Kampot.'),
('ISI High-Yield TMT Deformed Rebar 16mm', 'Steel', 'Ton', 350, 720.00, 'ISI Steel Cambodia Co., Ltd.', 'High-tensile steel rebar for structural reinforced concrete.'),
('Kampong Cham Red Clay Bricks', 'Masonry', 'Piece', 120000, 0.08, 'Chhoeung Red Brick Factory', 'Kiln-burned red clay solid bricks for partition walls.'),
('Kampot Quarry Blue Stone Gravel', 'Aggregates', 'Ton', 800, 22.00, 'Kampot Mining Quarry Co.', 'Crushed blue granite stone 20mm for concrete mix.'),
('Soma Heavy Duty PVC Drainage Pipe', 'Plumbing', 'Meter', 1500, 8.50, 'Soma Trading & Construction Supply', '110mm UV resistant PVC sewer drainage pipe.'),
('Phnom Penh Mekong River Sand', 'Aggregates', 'Ton', 1200, 14.00, 'Mekong Sand Dredging Ltd.', 'Washed fine river sand for plastering and concrete.');

-- Cambodian Construction Sample Data for Equipment
INSERT INTO equipment (name, type, serialNumber, status, purchaseDate, cost, location, description) VALUES
('CAT Excavator 320D', 'Excavator', 'CAT320D-KH-2023', 'Available', '2023-04-15', 180000.00, 'BKK1 Site, Phnom Penh', '20-ton crawler excavator with heavy bucket attachment.'),
('Komatsu PC200 Excavator', 'Excavator', 'KOM-PC200-KH-088', 'In Use', '2023-06-20', 145000.00, 'NR3 Flyover Site, Kandal', 'Hydraulic excavator deployed for earthworks.'),
('XCMG 50T Mobile Truck Crane', 'Crane', 'XCMG-50T-088-KH', 'Available', '2022-11-10', 210000.00, 'Siem Reap Resort Site', '50-ton telescopic boom truck crane for structural hoisting.'),
('Sany HBT60 Concrete Trailer Pump', 'Concrete Pump', 'SANY-PUMP-012-KH', 'In Use', '2023-09-01', 65000.00, 'PP Tower Extension Site', 'Stationary trailer concrete pump with high vertical reach.'),
('JCB 3CX Backhoe Loader', 'Loader', 'JCB-3CX-2022-KH', 'Maintenance', '2022-01-15', 55000.00, 'Central Yard, Pochentong', 'Multipurpose backhoe loader under routine hydraulic service.');

-- Cambodian Construction Sample Data for Tasks
INSERT INTO tasks (title, project, assignedTo, status, priority, dueDate, progress, description) VALUES
('Concrete Pouring for B2 Substructure', 'BKK1 Luxury Condominium Phase 2', 'Vannak Heng', 'In Progress', 'High', '2024-05-15', 65, 'Continuous 400m3 concrete pouring for basement raft slab.'),
('Deep Foundation Piling & Soil Testing', 'Phnom Penh Tower Extension & Commercial Hub', 'Sokha Chan', 'Completed', 'Critical', '2024-04-10', 100, 'Bored pile drilling and ultrasonic pile integrity testing.'),
('Pre-stressed Concrete Girder Launching', 'National Road 3 Flyover & Bridge Expansion', 'Dara Chea', 'In Progress', 'High', '2024-06-01', 40, 'Positioning 35m pre-cast concrete girders using 100T crane.'),
('Structural Frame Inspection & Fireproofing', 'Siem Reap Cultural Resort Complex', 'Sreyneang Kim', 'Not Started', 'Medium', '2024-06-20', 0, 'Third-party structural inspection and intumescent coating.'),
('MEP & Electrical Substation Installation', 'Sihanoukville Logistics Port Warehouse', 'Bopha Meng', 'In Progress', 'Medium', '2024-05-30', 25, 'Main switchboard cable routing and transformer setup.');

-- Cambodian Construction Sample Data for Accounting
INSERT INTO accounting (date, description, category, type, amount, reference, notes) VALUES
('2024-03-01', 'Initial Mobilization Deposit - PP Tower Project', 'Client Payment', 'Income', 300000.00, 'REC-2024-001', 'First advance milestone payment received via ABA Bank.'),
('2024-03-05', 'Procurement of 2,500 Bags Kampot Cement', 'Material Purchase', 'Expense', 17000.00, 'INV-KMT-88', 'Direct delivery to Phnom Penh site storehouse.'),
('2024-03-10', 'Monthly Field Staff & Operator Payroll', 'Payroll', 'Expense', 14500.00, 'PAY-2024-03', 'Monthly staff salaries transfer for March 2024.'),
('2024-03-15', 'Progress Milestone Billing - NR3 Flyover Phase 1', 'Client Payment', 'Income', 450000.00, 'REC-2024-002', 'MPWT certified completion milestone 1 payment.'),
('2024-03-20', 'Heavy Equipment Leasing & Diesel Fuel Allocation', 'Equipment & Fuel', 'Expense', 22000.00, 'INV-FUEL-402', 'Diesel fuel supply for excavators and mobile crane fleet.');

-- Cambodian Construction Sample Data for Clients
INSERT INTO clients (companyName, contactPerson, email, phone, address, city, state, zipCode, taxId) VALUES
('Chip Mong Group Co., Ltd.', 'Neak Oknha Leang Khun', 'info@chipmong.com', '023 888 999', '#137B, Mao Tse Toung Blvd, Boeung Keng Kang I', 'Phnom Penh', 'Phnom Penh', '12302', 'K001-901823901'),
('Peng Huoth Group', 'Oknha Thay Chea Huoth', 'contact@penghuoth.com', '023 999 111', '#9, Grand Star Platinum, National Road 1, Chbar Ampov', 'Phnom Penh', 'Phnom Penh', '12354', 'K002-881239102'),
('Worldbridge Land Cambodia', 'Oknha Sear Rithy', 'sales@worldbridgeland.com.kh', '023 222 333', 'Worldbridge Tower, St 384, Tonle Bassac', 'Phnom Penh', 'Phnom Penh', '12301', 'K003-112938103'),
('Ministry of Public Works and Transport (MPWT)', 'H.E. Sun Chanthol', 'info@mpwt.gov.kh', '023 427 888', 'Corner St 598 & St 1007, Khan Sen Sok', 'Phnom Penh', 'Phnom Penh', '12101', 'GOV-MPWT-2024'),
('Sokha Hotel & Resorts', 'Oknha Sok Kong', 'reservation@sokhahotels.com', '063 969 999', 'Road 60, Svay Dangkum', 'Siem Reap', 'Siem Reap', '17252', 'K005-773829105');

-- Cambodian Construction Sample Data for Suppliers
INSERT INTO suppliers (companyName, contactPerson, email, phone, productCategory, address, city, state, zipCode, taxId) VALUES
('Kampot Cement Co., Ltd. (K-Cement)', 'Oum Sotha', 'sales@k-cement.com.kh', '023 724 555', 'Building Materials', 'Phnom Penh Tower, Floor 18, Monivong Blvd', 'Phnom Penh', 'Phnom Penh', '12258', 'SUP-KMT-001'),
('ISI Steel Cambodia Co., Ltd.', 'Kang Leng', 'info@isisteel.com.kh', '023 880 123', 'Steel & Rebar', 'Veng Sreng Street, Choam Chao, Por Senchey', 'Phnom Penh', 'Phnom Penh', '12405', 'SUP-ISI-002'),
('Kampot Mining Quarry Co.', 'Chem Sovann', 'orders@kampotquarry.kh', '033 968 111', 'Aggregates & Stone', 'National Road 33, Touk Meas', 'Kampot', 'Kampot', '07201', 'SUP-KMQ-003'),
('Soma Trading & Construction Supply', 'Soma Group', 'supply@soma.com.kh', '023 986 789', 'Plumbing & Electrical', '#2C, Street 289, Boeung Kak 1, Toul Kork', 'Phnom Penh', 'Phnom Penh', '12151', 'SUP-SOM-004'),
('Umg Cambodia Co., Ltd. (Heavy Machinery)', 'Kheng Sameth', 'machinery@umg.com.kh', '023 428 555', 'Heavy Machinery', 'National Road 4, Phum Chom Chao', 'Phnom Penh', 'Phnom Penh', '12406', 'SUP-UMG-005');

-- Sample Data for Audit Logs & System Notifications
INSERT INTO audit_logs (action, module, description, performedBy, severity, isRead) VALUES
('CREATE', 'Equipment', 'CAT Excavator 320D dispatched to Downtown Site B.', 'Admin User', 'info', 0),
('ALERT', 'Safety', 'Safety Inspection cleared with 0 violations across active sites.', 'Sreyneang Kim', 'success', 0),
('CREATE', 'Materials', '2,500 Bags Kampot Cement received at Central Warehouse.', 'Dara Chea', 'info', 0),
('CREATE', 'Accounting', 'Invoiced $300,000.00 client mobilization payment for PP Tower Extension.', 'Bopha Meng', 'success', 1),
('UPDATE', 'Tasks', 'Updated task progress to 65% on Concrete Pouring B2 Substructure.', 'Vannak Heng', 'info', 1),
('UPDATE', 'Projects', 'Adjusted budget for National Road 3 Flyover to $4,500,000.00.', 'Admin User', 'warning', 1);

