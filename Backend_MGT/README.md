# Construction Management System - Backend

Node.js/Express REST API for the Construction Management System

## 🚀 Setup Instructions

### Prerequisites
- Node.js v18+
- MySQL Server 5.7+
- npm or yarn

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment variables:**
Create a `.env` file in the root directory:
```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=construction_management
```

3. **Setup MySQL Database:**

**Option A: Using command line**
```bash
mysql -u root -p < database.sql
```

**Option B: Using MySQL Workbench**
1. Open MySQL Workbench
2. Create a new SQL tab
3. Copy contents of `database.sql`
4. Execute the script

**Option C: Using mysql command**
```bash
mysql -u root -p
mysql> source /path/to/database.sql;
```

### Running the Server

**Development mode (with file watching):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will be available at `http://localhost:3000`

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Projects Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/projects` | Get all projects |
| GET | `/projects/:id` | Get project by ID |
| POST | `/projects` | Create new project |
| PUT | `/projects/:id` | Update project |
| DELETE | `/projects/:id` | Delete project |

**Request Body Example (POST/PUT):**
```json
{
  "name": "Downtown Office Complex",
  "client": "ABC Corporation",
  "status": "Active",
  "startDate": "2024-01-15",
  "budget": 500000,
  "progress": 45
}
```

### Staff Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/staff` | Get all staff |
| GET | `/staff/:id` | Get staff by ID |
| POST | `/staff` | Create new staff |
| PUT | `/staff/:id` | Update staff |
| DELETE | `/staff/:id` | Delete staff |

**Request Body Example:**
```json
{
  "name": "John Smith",
  "role": "Project Manager",
  "email": "john@email.com",
  "phone": "555-0101",
  "salary": 75000,
  "status": "Active"
}
```

### Materials Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/materials` | Get all materials |
| GET | `/materials/:id` | Get material by ID |
| POST | `/materials` | Create new material |
| PUT | `/materials/:id` | Update material |
| DELETE | `/materials/:id` | Delete material |

**Request Body Example:**
```json
{
  "name": "Cement Bags",
  "category": "Building Materials",
  "unit": "Bag",
  "quantity": 500,
  "unitPrice": 8.50,
  "supplier": "BuildTech Supplies"
}
```

### Equipment Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/equipment` | Get all equipment |
| GET | `/equipment/:id` | Get equipment by ID |
| POST | `/equipment` | Create new equipment |
| PUT | `/equipment/:id` | Update equipment |
| DELETE | `/equipment/:id` | Delete equipment |

**Request Body Example:**
```json
{
  "name": "Excavator CAT 320",
  "type": "Excavator",
  "serialNumber": "CAT320-2024-001",
  "status": "Available",
  "purchaseDate": "2023-05-15",
  "cost": 250000
}
```

### Tasks Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | Get all tasks |
| GET | `/tasks/:id` | Get task by ID |
| POST | `/tasks` | Create new task |
| PUT | `/tasks/:id` | Update task |
| DELETE | `/tasks/:id` | Delete task |

**Request Body Example:**
```json
{
  "title": "Foundation work",
  "project": "Downtown Office Complex",
  "assignedTo": "John Smith",
  "status": "In Progress",
  "priority": "High",
  "dueDate": "2024-04-30"
}
```

### Accounting Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/accounting` | Get all records |
| GET | `/accounting/:id` | Get record by ID |
| POST | `/accounting` | Create new record |
| PUT | `/accounting/:id` | Update record |
| DELETE | `/accounting/:id` | Delete record |

**Request Body Example:**
```json
{
  "date": "2024-02-01",
  "description": "Project startup costs",
  "category": "Equipment",
  "type": "Expense",
  "amount": 50000
}
```

### Clients Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/clients` | Get all clients |
| GET | `/clients/:id` | Get client by ID |
| POST | `/clients` | Create new client |
| PUT | `/clients/:id` | Update client |
| DELETE | `/clients/:id` | Delete client |

**Request Body Example:**
```json
{
  "companyName": "ABC Corporation",
  "contactPerson": "Mark Wilson",
  "email": "mark.wilson@abc.com",
  "phone": "555-0201",
  "address": "123 Business Ave"
}
```

### Suppliers Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/suppliers` | Get all suppliers |
| GET | `/suppliers/:id` | Get supplier by ID |
| POST | `/suppliers` | Create new supplier |
| PUT | `/suppliers/:id` | Update supplier |
| DELETE | `/suppliers/:id` | Delete supplier |

**Request Body Example:**
```json
{
  "companyName": "BuildTech Supplies",
  "contactPerson": "Kevin Anderson",
  "email": "kevin@buildtech.com",
  "phone": "555-0301",
  "productCategory": "Building Materials"
}
```

### Dashboard Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard/stats` | Get dashboard statistics |

**Response Example:**
```json
{
  "totalProjects": 5,
  "totalStaff": 5,
  "totalEquipment": 5,
  "totalTasks": 5
}
```

### Health Check
```
GET /api/health
```

Response:
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

## 🗄️ Database Schema

### Projects Table
- `id` - Primary key
- `name` - Project name
- `client` - Client name
- `status` - Project status (Active, Pending, Completed, On Hold)
- `startDate` - Project start date
- `endDate` - Project end date
- `budget` - Project budget
- `progress` - Progress percentage (0-100)
- `description` - Project description
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### Staff Table
- `id` - Primary key
- `name` - Full name
- `role` - Job role
- `email` - Email address (unique)
- `phone` - Phone number
- `salary` - Salary amount
- `status` - Employment status
- `hireDate` - Hire date
- `department` - Department name

### Materials Table
- `id` - Primary key
- `name` - Material name
- `category` - Material category
- `unit` - Unit of measurement
- `quantity` - Quantity in stock
- `unitPrice` - Price per unit
- `supplier` - Supplier name
- `description` - Material description

### Equipment Table
- `id` - Primary key
- `name` - Equipment name
- `type` - Equipment type
- `serialNumber` - Serial number (unique)
- `status` - Equipment status (Available, In Use, Maintenance)
- `purchaseDate` - Purchase date
- `cost` - Equipment cost
- `maintenanceDate` - Last maintenance date
- `location` - Equipment location

### Tasks Table
- `id` - Primary key
- `title` - Task title
- `project` - Associated project
- `assignedTo` - Assigned person
- `description` - Task description
- `status` - Task status (Not Started, In Progress, Completed, On Hold)
- `priority` - Task priority (Low, Medium, High, Critical)
- `dueDate` - Due date
- `completedDate` - Completion date
- `progress` - Progress percentage

### Accounting Table
- `id` - Primary key
- `date` - Transaction date
- `description` - Transaction description
- `category` - Category
- `type` - Type (Income, Expense)
- `amount` - Amount
- `reference` - Reference number
- `notes` - Additional notes

### Clients Table
- `id` - Primary key
- `companyName` - Company name
- `contactPerson` - Contact person name
- `email` - Email (unique)
- `phone` - Phone number
- `address` - Address
- `city` - City
- `state` - State/Province
- `zipCode` - Zip/Postal code
- `taxId` - Tax ID

### Suppliers Table
- `id` - Primary key
- `companyName` - Company name
- `contactPerson` - Contact person name
- `email` - Email (unique)
- `phone` - Phone number
- `productCategory` - Product category
- `address` - Address
- `city` - City
- `state` - State/Province
- `zipCode` - Zip/Postal code
- `taxId` - Tax ID

## 🔧 File Structure

```
Backend_MGT/
├── config/
│   └── database.js           # Database connection configuration
├── routes/
│   ├── projects.js           # Projects API routes
│   ├── staff.js              # Staff API routes
│   ├── materials.js          # Materials API routes
│   ├── equipment.js          # Equipment API routes
│   ├── tasks.js              # Tasks API routes
│   ├── accounting.js         # Accounting API routes
│   ├── clients.js            # Clients API routes
│   ├── suppliers.js          # Suppliers API routes
│   └── dashboard.js          # Dashboard API routes
├── server.js                 # Express server entry point
├── package.json              # Dependencies
├── .env                      # Environment variables
└── database.sql              # MySQL schema and sample data
```

## 🔌 Error Handling

All endpoints return appropriate HTTP status codes:
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

Error responses follow this format:
```json
{
  "error": "Error message here"
}
```

## 🚨 Common Issues

### Database Connection Failed
- Check MySQL is running
- Verify credentials in `.env`
- Ensure database name is correct

### Port Already in Use
- Change PORT in `.env`
- Or kill process on port 3000

### Table Not Found
- Run the `database.sql` script
- Verify database is created

## 📝 Logging

The server logs important events to console:
- Server startup
- Database connection
- API requests (in error cases)

## 🔐 Security Notes

- Use environment variables for sensitive data
- Implement authentication in production
- Add input validation for all endpoints
- Use HTTPS in production
- Implement rate limiting

## 📦 Dependencies

- `express` - Web framework
- `mysql2` - MySQL driver with promise support
- `cors` - CORS middleware
- `body-parser` - Request body parsing
- `dotenv` - Environment variable management

## 📞 Support

Refer to documentation:
- Express.js: https://expressjs.com
- MySQL2: https://github.com/sidorares/node-mysql2
- Node.js: https://nodejs.org
