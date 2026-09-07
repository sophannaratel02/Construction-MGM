# Construction Management System - Full Stack Implementation

A comprehensive web-based Construction Management System with Vue.js frontend, Node.js/Express backend, and MySQL database.

## 📋 Project Structure

```
Construction Management System/
├── Frontend_MGT/
│   └── cms_frontend/                # Vue.js Frontend Application
│       ├── src/
│       │   ├── components/          # Vue components (Navbar, Sidebar)
│       │   ├── views/               # Page views (Dashboard, Projects, etc)
│       │   ├── router/              # Vue Router configuration
│       │   ├── services/            # API client (api.js)
│       │   ├── stores/              # Pinia store
│       │   └── assets/              # Bootstrap 5
│       ├── package.json
│       └── vite.config.js
└── Backend_MGT/                     # Node.js Backend Application
    ├── routes/                      # API routes for each resource
    ├── config/                      # Database configuration
    ├── server.js                    # Express server entry point
    ├── package.json
    ├── .env                         # Environment variables
    └── database.sql                 # MySQL schema and sample data
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MySQL Server (5.7 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to Backend directory:**
```bash
cd Backend_MGT
```

2. **Install dependencies:**
```bash
npm install
```

3. **Setup MySQL Database:**
   - Open MySQL and run:
```sql
-- Use MySQL command line or any MySQL client
source database.sql;
```
   - Or copy the contents of `database.sql` and execute in your MySQL client

4. **Configure environment variables (`.env` file):**
```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=construction_management
```

5. **Start the backend server:**
```bash
npm run dev
```
The API will be available at `http://localhost:3000/api`

### Frontend Setup

1. **Navigate to Frontend directory:**
```bash
cd Frontend_MGT/cms_frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm run dev
```
The application will be available at `http://localhost:5173`

## 📱 Features

### Dashboard
- Overview of all projects, staff, equipment, and tasks
- Quick statistics
- Recent projects list

### Project Management
- Create, read, update, delete projects
- Track project status and progress
- Manage budgets and timelines

### Staff Management
- Manage employee information
- Track roles and salaries
- Update staff status

### Materials & Stock
- Inventory management
- Track material quantities and suppliers
- Manage material costs

### Equipment Management
- Track construction equipment
- Monitor equipment status and maintenance
- Record purchase dates and costs

### Task Management
- Create and assign tasks
- Set priorities and deadlines
- Track task progress and status

### Accounting
- Record income and expenses
- Track financial transactions
- View balance summary

### Client Management
- Maintain client information
- Track contact details
- Manage client relationships

### Supplier Management
- Manage supplier information
- Track product categories
- Maintain supplier contacts

## 🗄️ Database Schema

### Tables
- **projects** - Construction projects
- **staff** - Employee information
- **materials** - Material inventory
- **equipment** - Construction equipment
- **tasks** - Project tasks
- **accounting** - Financial records
- **clients** - Client information
- **suppliers** - Supplier information

All tables include timestamps and appropriate indexes for performance.

## 🔌 API Endpoints

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Staff
- `GET /api/staff` - Get all staff
- `GET /api/staff/:id` - Get staff by ID
- `POST /api/staff` - Create new staff
- `PUT /api/staff/:id` - Update staff
- `DELETE /api/staff/:id` - Delete staff

### Materials
- `GET /api/materials` - Get all materials
- `GET /api/materials/:id` - Get material by ID
- `POST /api/materials` - Create new material
- `PUT /api/materials/:id` - Update material
- `DELETE /api/materials/:id` - Delete material

### Equipment
- `GET /api/equipment` - Get all equipment
- `GET /api/equipment/:id` - Get equipment by ID
- `POST /api/equipment` - Create new equipment
- `PUT /api/equipment/:id` - Update equipment
- `DELETE /api/equipment/:id` - Delete equipment

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Accounting
- `GET /api/accounting` - Get all records
- `GET /api/accounting/:id` - Get record by ID
- `POST /api/accounting` - Create new record
- `PUT /api/accounting/:id` - Update record
- `DELETE /api/accounting/:id` - Delete record

### Clients
- `GET /api/clients` - Get all clients
- `GET /api/clients/:id` - Get client by ID
- `POST /api/clients` - Create new client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Suppliers
- `GET /api/suppliers` - Get all suppliers
- `GET /api/suppliers/:id` - Get supplier by ID
- `POST /api/suppliers` - Create new supplier
- `PUT /api/suppliers/:id` - Update supplier
- `DELETE /api/suppliers/:id` - Delete supplier

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## 🎨 Technologies Used

### Frontend
- **Vue.js 3** - Progressive JavaScript framework
- **Vite** - Next-generation build tool
- **Vue Router** - Client-side routing
- **Pinia** - State management
- **Bootstrap 5** - Powerful CSS framework for responsive design
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MySQL2** - MySQL driver
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Environment variable management

### Database
- **MySQL** - Relational database

## 🔒 CORS Configuration

The backend is configured with CORS enabled to allow requests from the frontend. The configuration can be found in `server.js`.

## 📝 Environment Variables

### Backend (.env)
```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=construction_management
```

### Frontend (src/services/api.js)
```javascript
const API_BASE_URL = 'http://localhost:3000/api'
```

## 🧪 Testing

### Backend Health Check
```bash
curl http://localhost:3000/api/health
```

### Frontend API Test
Open browser console and navigate to any page. The API requests should appear in Network tab.

## 📦 Building for Production

### Frontend
```bash
cd Frontend_MGT/cms_frontend
npm run build
```

### Backend
Ensure all environment variables are set for production MySQL database.

## 🚨 Troubleshooting

### Database Connection Error
- Ensure MySQL is running
- Check database credentials in `.env`
- Verify database name matches in MySQL

### CORS Error
- Ensure backend is running on port 3000
- Check `Access-Control-Allow-Origin` header in responses

### Frontend not fetching data
- Open browser DevTools Network tab to see actual requests
- Check if backend API is accessible at `http://localhost:3000/api`
- Verify API response format

## 📞 Support

For issues or questions, refer to:
- Vue.js Documentation: https://vuejs.org
- Express.js Documentation: https://expressjs.com
- MySQL Documentation: https://dev.mysql.com

## 📄 License

This project is provided as-is for educational purposes.

## 🎯 Next Steps

1. Run backend server
2. Run frontend development server
3. Access application at `http://localhost:5173`
4. Start creating projects, managing staff, and tracking construction progress!
