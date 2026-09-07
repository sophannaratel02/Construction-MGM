# Construction Management System - Frontend

Vue.js 3 + Vite + Bootstrap 5 frontend for the Construction Management System

## 🚀 Setup Instructions

### Prerequisites
- Node.js v18+
- npm or yarn

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Ensure backend is running:**
The frontend expects the API to be available at `http://localhost:3000/api`

### Running the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/         # Navbar, Sidebar components
├── views/             # Page components (Dashboard, Projects, etc)
├── router/            # Vue Router configuration
├── services/          # API client (api.js)
├── stores/            # Pinia store
└── assets/            # CSS and styles
```

## 🎯 Pages

- **Dashboard** (`/dashboard`) - Overview and statistics
- **Projects** (`/projects`) - Project management
- **Staff** (`/staff`) - Staff management
- **Materials** (`/materials`) - Materials inventory
- **Equipment** (`/equipment`) - Equipment tracking
- **Tasks** (`/tasks`) - Task management
- **Accounting** (`/accounting`) - Financial records
- **Clients** (`/clients`) - Client management
- **Suppliers** (`/suppliers`) - Supplier management

## 🔌 API Integration

The frontend uses Axios to communicate with the backend API at `http://localhost:3000/api`.

API methods are defined in `src/services/api.js`:

```javascript
import { projectsApi, staffApi, ... } from '@/services/api'

// Example usage
const projects = await projectsApi.getAll()
await projectsApi.create(data)
await projectsApi.update(id, data)
await projectsApi.delete(id)
```

## 🎨 Styling with Bootstrap 5

The project uses Bootstrap 5 for styling. Bootstrap is included in:
- `src/main.js` - Bootstrap import
- `src/assets/style.css` - Custom styles and overrides

## 🔧 Development

### IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur)

### Browser Setup

- Chrome: [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- Firefox: [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)

### Hot Module Replacement

The dev server automatically reloads when you save changes.

## 📦 Dependencies

- `vue` - JavaScript framework
- `vue-router` - Routing
- `pinia` - State management
- `axios` - HTTP client
- `bootstrap` - CSS framework
- `vite` - Build tool

## 🚨 Troubleshooting

- **API not connecting**: Ensure backend is running on port 3000
- **Styles not applying**: Clear cache and restart dev server
- **Blank page**: Check console for errors

## 📝 Configuration

To change the API base URL, edit `src/services/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:3000/api'
```

## 📞 Support

- Vue.js: https://vuejs.org
- Vite: https://vitejs.dev
- Bootstrap: https://getbootstrap.com
