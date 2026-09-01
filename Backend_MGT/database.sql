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

-- Sample Data for Projects
INSERT INTO projects (name, client, status, startDate, budget, progress) VALUES
('Downtown Office Complex', 'ABC Corporation', 'Active', '2024-01-15', 500000, 45),
('Residential Complex Phase 1', 'XYZ Developers', 'Active', '2024-02-01', 750000, 30),
('Shopping Mall Renovation', 'Tech Retail Inc', 'Pending', '2024-03-20', 350000, 0),
('Highway Expansion Project', 'Government Department', 'Active', '2024-01-01', 2000000, 60),
('Hospital Extension', 'Medical Foundation', 'Completed', '2023-06-15', 1200000, 100);

-- Sample Data for Staff
INSERT INTO staff (name, role, email, phone, salary, status, department) VALUES
('John Smith', 'Project Manager', 'john.smith@email.com', '555-0101', 75000, 'Active', 'Management'),
('Sarah Johnson', 'Site Engineer', 'sarah.johnson@email.com', '555-0102', 65000, 'Active', 'Engineering'),
('Michael Brown', 'Equipment Operator', 'michael.brown@email.com', '555-0103', 45000, 'Active', 'Operations'),
('Emily Davis', 'Accountant', 'emily.davis@email.com', '555-0104', 55000, 'Active', 'Finance'),
('Robert Wilson', 'Safety Officer', 'robert.wilson@email.com', '555-0105', 60000, 'Active', 'Safety');

-- Sample Data for Materials
INSERT INTO materials (name, category, unit, quantity, unitPrice, supplier) VALUES
('Cement Bags', 'Building Materials', 'Bag', 500, 8.50, 'BuildTech Supplies'),
('Steel Reinforcement', 'Steel', 'Ton', 100, 850, 'Steel Industries Ltd'),
('Bricks', 'Masonry', 'Piece', 50000, 0.25, 'Local Brick Manufacturers'),
('Gravel', 'Aggregates', 'Ton', 200, 35, 'Quarry Supplies Inc'),
('PVC Pipes', 'Plumbing', 'Meter', 1000, 15, 'Plumbing Solutions Co');

-- Sample Data for Equipment
INSERT INTO equipment (name, type, serialNumber, status, purchaseDate, cost, location) VALUES
('Excavator CAT 320', 'Excavator', 'CAT320-2024-001', 'Available', '2023-05-15', 250000, 'Main Site'),
('Concrete Mixer', 'Mixer', 'MX-2024-001', 'In Use', '2023-08-20', 15000, 'Downtown Project'),
('Crane JCB 3CX', 'Crane', 'CRANE-2024-001', 'Available', '2023-06-10', 300000, 'Equipment Yard'),
('Compressor Atlas', 'Compressor', 'COMP-2024-001', 'In Use', '2023-09-01', 8000, 'Highway Project'),
('Forklift Toyota', 'Forklift', 'FK-2024-001', 'Maintenance', '2024-01-15', 20000, 'Warehouse');

-- Sample Data for Tasks
INSERT INTO tasks (title, project, assignedTo, status, priority, dueDate, progress) VALUES
('Foundation work', 'Downtown Office Complex', 'John Smith', 'In Progress', 'High', '2024-04-30', 75),
('Steel installation', 'Downtown Office Complex', 'Sarah Johnson', 'Not Started', 'High', '2024-05-15', 0),
('Electrical wiring', 'Residential Complex Phase 1', 'Michael Brown', 'In Progress', 'Medium', '2024-05-01', 50),
('Safety inspection', 'Highway Expansion Project', 'Robert Wilson', 'Completed', 'Critical', '2024-03-15', 100),
('Material procurement', 'Shopping Mall Renovation', 'John Smith', 'Not Started', 'Medium', '2024-04-10', 0);

-- Sample Data for Accounting
INSERT INTO accounting (date, description, category, type, amount) VALUES
('2024-02-01', 'Project startup costs', 'Equipment', 'Expense', 50000),
('2024-02-05', 'Client deposit', 'Revenue', 'Income', 100000),
('2024-02-10', 'Staff salaries', 'Payroll', 'Expense', 25000),
('2024-02-15', 'Material purchase', 'Supplies', 'Expense', 15000),
('2024-02-20', 'Project completion payment', 'Revenue', 'Income', 200000);

-- Sample Data for Clients
INSERT INTO clients (companyName, contactPerson, email, phone, address, city) VALUES
('ABC Corporation', 'Mark Wilson', 'mark.wilson@abc.com', '555-0201', '123 Business Ave', 'New York'),
('XYZ Developers', 'Lisa Chen', 'lisa.chen@xyz.com', '555-0202', '456 Development Blvd', 'Los Angeles'),
('Tech Retail Inc', 'James Rodriguez', 'james.rodriguez@techretail.com', '555-0203', '789 Commerce St', 'Chicago'),
('Government Department', 'Patricia Green', 'patricia.green@gov.com', '555-0204', '321 Administration Dr', 'Washington'),
('Medical Foundation', 'Thomas Martinez', 'thomas.martinez@medfound.com', '555-0205', '654 Healthcare Ln', 'Boston');

-- Sample Data for Suppliers
INSERT INTO suppliers (companyName, contactPerson, email, phone, productCategory) VALUES
('BuildTech Supplies', 'Kevin Anderson', 'kevin@buildtech.com', '555-0301', 'Building Materials'),
('Steel Industries Ltd', 'Jennifer Lee', 'jennifer@steelindustries.com', '555-0302', 'Steel'),
('Local Brick Manufacturers', 'David Kumar', 'david@localbrick.com', '555-0303', 'Masonry'),
('Quarry Supplies Inc', 'Susan Thompson', 'susan@quarrysupplies.com', '555-0304', 'Aggregates'),
('Plumbing Solutions Co', 'George Harris', 'george@plumbingsolutions.com', '555-0305', 'Plumbing');
