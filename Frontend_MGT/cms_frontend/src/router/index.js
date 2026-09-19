import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Authentication/LoginView.vue'),
    meta: { layout: 'auth' }
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Authentication/RegisterView.vue'),
    meta: { layout: 'auth' }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('../views/Authentication/ForgotPasswordView.vue'),
    meta: { layout: 'auth' }
  },
  {
    path: '/reset-password/:token?',
    name: 'ResetPassword',
    component: () => import('../views/Authentication/ResetPasswordView.vue'),
    meta: { layout: 'auth' }
  },
  {
    path: '/unauthorized',
    name: 'Unauthorized',
    component: () => import('../views/UnauthorizedView.vue'),
    meta: { layout: 'main', requiresAuth: true }
  },
  {
    path: '/admin/dashboard',
    redirect: '/dashboard',
    meta: { layout: 'main', requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: () => import('../views/AdminUsersView.vue'),
    meta: { layout: 'main', requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/user/dashboard',
    redirect: '/dashboard',
    meta: { layout: 'main', requiresAuth: true, roles: ['user'] }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { layout: 'main', requiresAuth: true }
  },
  {
    path: '/projects',
    name: 'Projects',
    component: () => import('../views/ProjectsView.vue'),
    meta: { layout: 'main', requiresAuth: true }
  },
  {
    path: '/staff',
    name: 'Staff',
    component: () => import('../views/StaffView.vue'),
    meta: { layout: 'main', requiresAuth: true }
  },
  {
    path: '/materials',
    name: 'Materials',
    component: () => import('../views/MaterialsView.vue'),
    meta: { layout: 'main', requiresAuth: true }
  },
  {
    path: '/equipment',
    name: 'Equipment',
    component: () => import('../views/EquipmentView.vue'),
    meta: { layout: 'main', requiresAuth: true }
  },
  {
    path: '/tasks',
    name: 'Tasks',
    component: () => import('../views/TasksView.vue'),
    meta: { layout: 'main', requiresAuth: true }
  },
  {
    path: '/accounting',
    name: 'Accounting',
    component: () => import('../views/AccountingView.vue'),
    meta: { layout: 'main', requiresAuth: true }
  },
  {
    path: '/clients',
    name: 'Clients',
    component: () => import('../views/ClientsView.vue'),
    meta: { layout: 'main', requiresAuth: true }
  },
  {
    path: '/suppliers',
    name: 'Suppliers',
    component: () => import('../views/SuppliersView.vue'),
    meta: { layout: 'main', requiresAuth: true }
  },
  {
    path: '/purchase-orders',
    name: 'PurchaseOrders',
    component: () => import('../views/PurchaseOrdersView.vue'),
    meta: { layout: 'main', requiresAuth: true }
  },
  {
    path: '/site-daily-logs',
    name: 'SiteDailyLogs',
    component: () => import('../views/SiteDailyLogsView.vue'),
    meta: { layout: 'main', requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('cms_token')
  const user = JSON.parse(localStorage.getItem('cms_user') || '{}')

  if (to.meta.layout === 'auth') {
    return isAuthenticated ? next('/dashboard') : next()
  }

  if (to.meta.requiresAuth && !isAuthenticated) {
    return next('/login')
  }

  if (to.meta.roles?.length && !to.meta.roles.includes(user.role)) {
    return next('/unauthorized')
  }

  next()
})

export default router