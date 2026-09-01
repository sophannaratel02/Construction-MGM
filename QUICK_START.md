# 🚀 QUICK START GUIDE - Construction Management System

## ✅ What's Been Completed

✓ Frontend with Vue.js 3, Tailwind CSS, and Vite
✓ All 9 management pages (Dashboard, Projects, Staff, Materials, Equipment, Tasks, Accounting, Clients, Suppliers)
✓ Responsive sidebar navigation
✓ Backend Node.js/Express API with CORS
✓ MySQL database with complete schema
✓ Sample data for testing
✓ API routes for all modules
✓ Full integration between frontend and backend

## 📋 Step-by-Step Setup

### Step 1: Setup MySQL Database (5 minutes)

**Option A - Using Command Line:**
```bash
mysql -u root -p
# Enter your MySQL password
mysql> source "d:\SETEC(SV15)\Year3\System analysis\Construction Management System\Backend_MGT\database.sql";
mysql> exit;
```

**Option B - Using MySQL Workbench:**
1. Open MySQL Workbench
2. Click File → Open SQL Script
3. Navigate to `Backend_MGT\database.sql`
4. Click Execute (lightning icon)
5. Verify database `construction_management` is created

**Option C - Using HeidiSQL or PhpMyAdmin:**
1. Create new database named `construction_management`
2. Import `Backend_MGT\database.sql`

### Step 2: Setup Backend (5 minutes)

```bash
# Navigate to backend folder
cd Backend_MGT

# Install dependencies
npm install

# Update .env file with your MySQL credentials
# Edit .env:
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=construction_management

# Start the backend server
npm run dev
```

You should see:
```
✓ Database connected successfully
Server is running on http://localhost:3000
```

### Step 3: Setup Frontend (5 minutes)

```bash
# Navigate to frontend folder (in another terminal)
cd Frontend_MGT/cms_frontend

# Install dependencies
npm install

# Start the frontend development server
npm run dev
```

You should see:
```
Local: http://localhost:5173/
```

### Step 4: Access the Application

1. Open your browser
2. Go to `http://localhost:5173`
3. You should see the Construction Management System dashboard
4. Navigate using the sidebar menu

## 🎯 Testing the System

### Test Each Module:

1. **Dashboard** - Should show statistics
2. **Projects** - Click "+ New Project" to add a project
3. **Staff** - Click "+ Add Staff" to add staff member
4. **Materials** - Click "+ Add Material" to add material
5. **Equipment** - Click "+ Add Equipment" to add equipment
6. **Tasks** - Click "+ Add Task" to create a task
7. **Accounting** - Click "+ New Entry" to add accounting record
8. **Clients** - Click "+ Add Client" to add client
9. **Suppliers** - Click "+ Add Supplier" to add supplier

### Test Form Submission:

1. Fill out the form
2. Click "Save"
3. Should see success and page refresh
4. Check browser DevTools Network tab to verify API calls

### Test Editing:

1. Click "Edit" on any row
2. Modify data
3. Click "Save"
4. Verify changes are saved

### Test Deletion:

1. Click "Delete" on any row
2. Confirm deletion
3. Record should be removed

## 📁 Important Files

```
Project Root
├── Backend_MGT/
│   ├── server.js              ← Start backend from here
│   ├── .env                   ← Update MySQL credentials
│   ├── database.sql           ← Create database schema
│   └── README.md              ← Backend documentation
│
├── Frontend_MGT/cms_frontend/
│   ├── src/
│   │   ├── services/api.js    ← API client (update if backend port changes)
│   │   ├── views/             ← All 9 page components
│   │   ├── components/        ← Navbar & Sidebar
│   │   └── router/index.js    ← Route configuration
│   ├── package.json           ← Dependencies
│   ├── vite.config.js         ← Build configuration
│   ├── tailwind.config.js     ← Tailwind customization
│   └── README.md              ← Frontend documentation
│
└── README.md                  ← Main documentation
```

## 🔧 Configuration

### Change API URL (if backend is on different port):

Edit `Frontend_MGT/cms_frontend/src/services/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:3000/api'  // Change 3000 to your port
```

### Change Backend Port:

Edit `Backend_MGT/.env`:
```
PORT=3001  # Change from 3000 to 3001
```

Then update API URL in frontend accordingly.

## 🚨 Common Issues & Solutions

### Issue: "Cannot GET /api/projects"
**Solution:** Backend is not running. Run `npm run dev` in Backend_MGT folder

### Issue: "CORS error" or "Network request failed"
**Solution:** 
- Verify backend is running on port 3000
- Check frontend API URL in `src/services/api.js`
- Restart both servers

### Issue: "Database connection failed"
**Solution:**
- Verify MySQL is running
- Check credentials in Backend_MGT/.env
- Run database.sql script
- Restart backend server

### Issue: "Blank page in frontend"
**Solution:**
- Open DevTools Console (F12)
- Check for JavaScript errors
- Clear browser cache (Ctrl+Shift+Delete)
- Restart frontend dev server

### Issue: "Cannot find module"
**Solution:**
```bash
# In the problematic folder:
rm -rf node_modules
rm package-lock.json
npm install
npm run dev
```

## 📊 Sample Data

The database includes sample data:
- 5 Projects
- 5 Staff members
- 5 Materials
- 5 Equipment items
- 5 Tasks
- 5 Accounting entries
- 5 Clients
- 5 Suppliers

You can delete and add your own data through the UI.

## 📈 Features Summary

### Dashboard
- Real-time statistics
- Project overview
- Quick access to all modules

### Project Management
- Full CRUD operations
- Track budget and timeline
- Monitor progress

### Staff Management
- Employee records
- Salary tracking
- Role management

### Material Management
- Inventory tracking
- Supplier management
- Cost tracking

### Equipment Management
- Equipment tracking
- Status monitoring
- Maintenance scheduling

### Task Management
- Task assignment
- Priority management
- Progress tracking

### Accounting
- Income/Expense tracking
- Financial summaries
- Transaction categorization

### Client Management
- Client database
- Contact information
- Project relationships

### Supplier Management
- Supplier database
- Product categories
- Contact management

## 🔗 API Endpoints Summary

All endpoints are accessible at: `http://localhost:3000/api`

```
GET    /projects           - List all projects
POST   /projects           - Create project
PUT    /projects/:id       - Update project
DELETE /projects/:id       - Delete project

GET    /staff              - List all staff
POST   /staff              - Create staff
PUT    /staff/:id          - Update staff
DELETE /staff/:id          - Delete staff

GET    /materials          - List all materials
POST   /materials          - Create material
PUT    /materials/:id      - Update material
DELETE /materials/:id      - Delete material

GET    /equipment          - List all equipment
POST   /equipment          - Create equipment
PUT    /equipment/:id      - Update equipment
DELETE /equipment/:id      - Delete equipment

GET    /tasks              - List all tasks
POST   /tasks              - Create task
PUT    /tasks/:id          - Update task
DELETE /tasks/:id          - Delete task

GET    /accounting         - List all records
POST   /accounting         - Create record
PUT    /accounting/:id     - Update record
DELETE /accounting/:id     - Delete record

GET    /clients            - List all clients
POST   /clients            - Create client
PUT    /clients/:id        - Update client
DELETE /clients/:id        - Delete client

GET    /suppliers          - List all suppliers
POST   /suppliers          - Create supplier
PUT    /suppliers/:id      - Update supplier
DELETE /suppliers/:id      - Delete supplier

GET    /dashboard/stats    - Get dashboard statistics
```

## 💻 Terminal Commands Reference

### Backend
```bash
cd Backend_MGT
npm install              # Install dependencies
npm run dev              # Start development server (with file watching)
npm start                # Start production server
```

### Frontend
```bash
cd Frontend_MGT/cms_frontend
npm install              # Install dependencies
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
```

## 📚 Technology Stack

**Frontend:**
- Vue.js 3 - Progressive JavaScript framework
- Vite - Modern build tool
- Tailwind CSS - Utility-first CSS framework
- Axios - HTTP client
- Vue Router - Client-side routing
- Pinia - State management

**Backend:**
- Node.js - JavaScript runtime
- Express.js - Web framework
- MySQL2 - MySQL driver
- CORS - Cross-origin requests

**Database:**
- MySQL 5.7+

## ✨ Next Steps

1. ✅ Complete the setup above
2. ✅ Test all features in the UI
3. 📝 Customize styling (colors, fonts) in `tailwind.config.js`
4. 🔐 Implement authentication for production
5. 📱 Optimize for mobile deployment
6. 🚀 Deploy to production server

## 📞 Support

For issues or questions:
1. Check the README.md files in each folder
2. Review error messages in browser console (F12)
3. Check server logs in terminal
4. Verify all prerequisites are installed

## 📄 Additional Documentation

- **Main README**: See `README.md` in project root
- **Backend README**: See `Backend_MGT/README.md`
- **Frontend README**: See `Frontend_MGT/cms_frontend/README.md`

---

**System is now ready to use! Start with Step 1 above. 🎉**
