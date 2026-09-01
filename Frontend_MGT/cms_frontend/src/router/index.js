import { createRouter, createWebHistory } from 'vue-router'

// Lazy-load view components for performance
const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/DashboardView.vue')
  },
  {
    path: '/projects',
    name: 'Projects',
    component: () => import('../views/ProjectsView.vue')
  },
  {
    path: '/staff',
    name: 'Staff',
    component: () => import('../views/StaffView.vue')
  },
  {
    path: '/materials',
    name: 'Materials',
    component: () => import('../views/MaterialsView.vue')
  },
  {
    path: '/equipment',
    name: 'Equipment',
    component: () => import('../views/EquipmentView.vue')
  },
  {
    path: '/tasks',
    name: 'Tasks',
    component: () => import('../views/TasksView.vue')
  },
  {
    path: '/accounting',
    name: 'Accounting',
    component: () => import('../views/AccountingView.vue')
  },
  {
    path: '/clients',
    name: 'Clients',
    component: () => import('../views/ClientsView.vue')
  },
  {
    path: '/suppliers',
    name: 'Suppliers',
    component: () => import('../views/SuppliersView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router