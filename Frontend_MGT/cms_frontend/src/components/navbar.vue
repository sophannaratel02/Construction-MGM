<template>
  <header class="app-header sticky-top d-flex align-items-center">
    <div class="header-container container-fluid px-3 px-lg-4 d-flex align-items-center justify-content-between">
      
      <!-- Left Section: Search Bar & System Branding -->
      <div class="d-flex align-items-center gap-3">
        <button
          type="button"
          class="btn-action-icon d-lg-none"
          aria-label="Open navigation"
          title="Open navigation"
          @click="$emit('toggle-sidebar')"
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <!-- Global Quick Search Input -->
        <div class="header-search-wrapper d-none d-md-flex align-items-center" ref="searchWrapperRef">
          <svg class="search-icon" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            v-model="searchQuery"
            type="text" 
            class="search-input" 
           
            @focus="handleSearchFocus"
            @keydown.down.prevent="navigateResults(1)"
            @keydown.up.prevent="navigateResults(-1)"
            @keydown.enter.prevent="selectCurrentResult"
            @keydown.esc="showSearchDropdown = false"
          />
          <kbd class="search-shortcut">⌘K</kbd>

          <!-- Real-Time Categorized Search Dropdown -->
          <div v-if="showSearchDropdown && searchQuery.trim()" class="search-results-dropdown custom-scroll">
            <div v-if="isLoadingSearch" class="p-3 text-center text-muted font-12">
              <span class="spinner-border spinner-border-sm me-2" role="status"></span> Loading search index...
            </div>

            <template v-else-if="totalResultsCount > 0">
              <!-- Projects Category -->
              <div v-if="categorizedResults.projects.length" class="search-category-block">
                <div class="search-result-group-title d-flex align-items-center gap-1">
                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4m-8-11h.01M12 10h.01M16 10h.01M9 14h.01M12 14h.01M16 14h.01" /></svg>
                  Projects ({{ categorizedResults.projects.length }})
                </div>
                <div 
                  v-for="item in categorizedResults.projects" 
                  :key="'proj-' + item.id"
                  class="search-result-item"
                  :class="{ active: flatResultsList[activeIndex]?.id === item.id && flatResultsList[activeIndex]?.type === 'project' }"
                  @click="goToResult('/projects', { search: item.name })"
                >
                  <div class="d-flex flex-column gap-1 overflow-hidden me-2">
                    <span class="item-title text-truncate">{{ item.name }}</span>
                    <span class="item-sub text-truncate">{{ item.client || 'Internal Project' }} • {{ item.location || 'Site Location N/A' }}</span>
                  </div>
                  <span class="badge-tag status-pill" :class="getStatusBadgeClass(item.status)">{{ item.status || 'Active' }}</span>
                </div>
              </div>

              <!-- Materials Category -->
              <div v-if="categorizedResults.materials.length" class="search-category-block">
                <div class="search-result-group-title d-flex align-items-center gap-1">
                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                  Materials ({{ categorizedResults.materials.length }})
                </div>
                <div 
                  v-for="item in categorizedResults.materials" 
                  :key="'mat-' + item.id"
                  class="search-result-item"
                  :class="{ active: flatResultsList[activeIndex]?.id === item.id && flatResultsList[activeIndex]?.type === 'material' }"
                  @click="goToResult('/materials', { search: item.name })"
                >
                  <div class="d-flex flex-column gap-1 overflow-hidden me-2">
                    <span class="item-title text-truncate">{{ item.name }}</span>
                    <span class="item-sub text-truncate">{{ item.category || 'General' }} • Stock: {{ item.quantity ?? item.stock_quantity ?? 0 }} {{ item.unit || 'units' }}</span>
                  </div>
                  <span class="badge-tag bg-material">{{ item.category || 'Material' }}</span>
                </div>
              </div>

              <!-- Staff Roster Category -->
              <div v-if="categorizedResults.staff.length" class="search-category-block">
                <div class="search-result-group-title d-flex align-items-center gap-1">
                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  Staff Roster ({{ categorizedResults.staff.length }})
                </div>
                <div 
                  v-for="item in categorizedResults.staff" 
                  :key="'staff-' + item.id"
                  class="search-result-item"
                  :class="{ active: flatResultsList[activeIndex]?.id === item.id && flatResultsList[activeIndex]?.type === 'staff' }"
                  @click="goToResult('/staff', { search: item.name })"
                >
                  <div class="d-flex flex-column gap-1 overflow-hidden me-2">
                    <span class="item-title text-truncate">{{ item.name }}</span>
                    <span class="item-sub text-truncate">{{ item.role || 'Staff Member' }} • {{ item.department || 'Operations' }}</span>
                  </div>
                  <span class="badge-tag bg-staff">{{ item.role || 'Staff' }}</span>
                </div>
              </div>

              <!-- Tasks & Work Orders Category -->
              <div v-if="categorizedResults.tasks.length" class="search-category-block">
                <div class="search-result-group-title d-flex align-items-center gap-1">
                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                  Tasks ({{ categorizedResults.tasks.length }})
                </div>
                <div 
                  v-for="item in categorizedResults.tasks" 
                  :key="'task-' + item.id"
                  class="search-result-item"
                  :class="{ active: flatResultsList[activeIndex]?.id === item.id && flatResultsList[activeIndex]?.type === 'task' }"
                  @click="goToResult('/tasks', { search: item.title })"
                >
                  <div class="d-flex flex-column gap-1 overflow-hidden me-2">
                    <span class="item-title text-truncate">{{ item.title || item.name }}</span>
                    <span class="item-sub text-truncate">Priority: {{ item.priority || 'Normal' }} • {{ item.assigned_to ? 'Assigned to ' + item.assigned_to : 'Unassigned' }}</span>
                  </div>
                  <span class="badge-tag status-pill" :class="getStatusBadgeClass(item.status)">{{ item.status || 'Pending' }}</span>
                </div>
              </div>

              <!-- Equipment Category -->
              <div v-if="categorizedResults.equipment.length" class="search-category-block">
                <div class="search-result-group-title d-flex align-items-center gap-1">
                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  Equipment ({{ categorizedResults.equipment.length }})
                </div>
                <div 
                  v-for="item in categorizedResults.equipment" 
                  :key="'eq-' + item.id"
                  class="search-result-item"
                  :class="{ active: flatResultsList[activeIndex]?.id === item.id && flatResultsList[activeIndex]?.type === 'equipment' }"
                  @click="goToResult('/equipment', { search: item.name })"
                >
                  <div class="d-flex flex-column gap-1 overflow-hidden me-2">
                    <span class="item-title text-truncate">{{ item.name }}</span>
                    <span class="item-sub text-truncate">{{ item.category || 'Machinery' }} • {{ item.location || 'Storage Yard' }}</span>
                  </div>
                  <span class="badge-tag status-pill" :class="getStatusBadgeClass(item.status)">{{ item.status || 'Available' }}</span>
                </div>
              </div>
            </template>

            <!-- No Results Found State -->
            <div v-else class="p-3 text-center text-muted">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" class="mb-2 text-secondary">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <div class="font-13 text-light font-weight-600">No matching records found</div>
              <div class="font-11 text-muted mt-1">No items match "{{ searchQuery }}" across projects, materials, staff, or equipment.</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Section: System Telemetry, Notifications & Profile -->
      <div class="d-flex align-items-center gap-2 gap-sm-3">
        
        <!-- Live System Clock & Location -->
        <div class="sys-telemetry-pill d-none d-xl-flex align-items-center gap-2">
          <span class="status-indicator-dot green"></span>
          <span class="telemetry-text">Phnom Penh HQ • UTC+7</span>
        </div>

        <!-- Quick Notifications Bell -->
        <div class="position-relative">
          <button 
            class="btn-action-icon position-relative" 
            type="button" 
            aria-label="Notifications"
            @click="toggleNotifications"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span v-if="unreadCount > 0" class="notification-indicator">{{ unreadCount > 99 ? '99+' : unreadCount }}</span>
          </button>

          <!-- Notifications Popup -->
          <div v-if="showNotifications" class="notifications-dropdown">
            <div class="notif-header">
              <span class="notif-title">System Notifications</span>
              <div class="d-flex align-items-center gap-2">
                <span class="notif-count">{{ unreadCount }} New</span>
                <button v-if="unreadCount > 0" @click="handleMarkAllRead" class="btn-mark-read" title="Mark All as Read">
                  ✓ Read All
                </button>
              </div>
            </div>
            <div class="notif-list">
              <div v-for="item in notifications.slice(0, 6)" :key="item.id" class="notif-item" :class="{ unread: !item.is_read }" @click="openNotification(item)">
                <div class="notif-icon" :class="getNotifIconBg(item.severity)">
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div>
                  <div class="notif-text">{{ item.message }}</div>
                  <div class="notif-time">{{ item.projectName || 'Project workflow' }} • {{ formatTimeAgo(item.created_at) }}</div>
                </div>
              </div>
              <div v-if="notifications.length === 0" class="text-center text-muted py-3 font-12">
                No active notifications
              </div>
            </div>
          </div>
        </div>

        <div class="header-divider d-none d-sm-block"></div>

        <!-- User Profile Dropdown Button -->
        <div class="position-relative">
          <div 
            class="user-profile-btn d-flex align-items-center gap-2 px-2 py-1 rounded"
            @click="toggleUserMenu"
          >
            <div class="user-avatar d-flex align-items-center justify-content-center">
              {{ getUserInitials(currentUser.name) }}
            </div>
            <div class="user-info d-none d-sm-block text-start">
              <div class="user-name">{{ currentUser.name || 'Admin User' }}</div>
              <div class="user-role">{{ currentUser.role ? currentUser.role.toUpperCase() : 'ADMIN' }}</div>
            </div>
            <svg class="chevron-down" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          <!-- User Menu Dropdown -->
          <div v-if="showUserMenu" class="user-menu-dropdown">
            <div class="user-menu-header">
              <div class="user-menu-name">{{ currentUser.name || 'Admin User' }}</div>
              <div class="user-menu-email">{{ currentUser.email || 'admin@cms.kh' }}</div>
            </div>
            <div class="menu-divider"></div>
            <router-link to="/dashboard" class="menu-item" @click="showUserMenu = false">
              <span class="d-flex align-items-center gap-2">
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 12a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1v-7z" /></svg>
                Operations Dashboard
              </span>
            </router-link>
            <router-link to="/projects" class="menu-item" @click="showUserMenu = false">
              <span class="d-flex align-items-center gap-2">
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4m-8-11h.01M12 10h.01M16 10h.01M9 14h.01M12 14h.01M16 14h.01" /></svg>
                Projects Directory
              </span>
            </router-link>
            <router-link to="/staff" class="menu-item" @click="showUserMenu = false">
              <span class="d-flex align-items-center gap-2">
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                Staff Roster
              </span>
            </router-link>
            <div class="menu-divider"></div>
            <div class="menu-item text-danger" @click="handleLogout">
              <span class="d-flex align-items-center gap-2">
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                Sign Out
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter } from 'vue-router'
import { 
  authApi, 
  notificationsApi, 
  projectsApi, 
  materialsApi, 
  staffApi, 
  tasksApi, 
  equipmentApi 
} from '../services/api'
import { useAlert } from '../composables/useAlert'

const { showInfo } = useAlert()

defineEmits(['toggle-sidebar'])

const searchQuery = ref('')
const showSearchDropdown = ref(false)
const showNotifications = ref(false)
const showUserMenu = ref(false)
const notifications = ref([])
const currentUser = ref(JSON.parse(localStorage.getItem('cms_user') || '{}'))
const router = useRouter()

// Real-Time Search Indexes & States
const searchWrapperRef = ref(null)
const isLoadingSearch = ref(false)
const isSearchIndexLoaded = ref(false)
const activeIndex = ref(-1)

const rawSearchData = ref({
  projects: [],
  materials: [],
  staff: [],
  tasks: [],
  equipment: []
})

// Load Search Indexes lazily on focus/mount
const loadSearchIndex = async () => {
  if (isSearchIndexLoaded.value || isLoadingSearch.value) return
  isLoadingSearch.value = true
  try {
    const [projRes, matRes, staffRes, taskRes, eqRes] = await Promise.allSettled([
      projectsApi.getAll(),
      materialsApi.getAll(),
      staffApi.getAll(),
      tasksApi.getAll(),
      equipmentApi.getAll()
    ])

    rawSearchData.value = {
      projects: projRes.status === 'fulfilled' ? (projRes.value.data || []) : [],
      materials: matRes.status === 'fulfilled' ? (matRes.value.data || []) : [],
      staff: staffRes.status === 'fulfilled' ? (staffRes.value.data || []) : [],
      tasks: taskRes.status === 'fulfilled' ? (taskRes.value.data || []) : [],
      equipment: eqRes.status === 'fulfilled' ? (eqRes.value.data || []) : []
    }
    isSearchIndexLoaded.value = true
  } catch (err) {
    console.error('Failed to load search indexes:', err)
  } finally {
    isLoadingSearch.value = false
  }
}

const handleSearchFocus = () => {
  showSearchDropdown.value = true
  loadSearchIndex()
}

// Categorized results filtering
const categorizedResults = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) {
    return { projects: [], materials: [], staff: [], tasks: [], equipment: [] }
  }

  const matchStr = (val) => String(val || '').toLowerCase().includes(query)

  return {
    projects: rawSearchData.value.projects.filter(p => 
      matchStr(p.name) || matchStr(p.client) || matchStr(p.location) || matchStr(p.status)
    ).slice(0, 4),

    materials: rawSearchData.value.materials.filter(m => 
      matchStr(m.name) || matchStr(m.category) || matchStr(m.supplier)
    ).slice(0, 4),

    staff: rawSearchData.value.staff.filter(s => 
      matchStr(s.name) || matchStr(s.role) || matchStr(s.department) || matchStr(s.email)
    ).slice(0, 4),

    tasks: rawSearchData.value.tasks.filter(t => 
      matchStr(t.title || t.name) || matchStr(t.priority) || matchStr(t.status) || matchStr(t.assigned_to)
    ).slice(0, 4),

    equipment: rawSearchData.value.equipment.filter(e => 
      matchStr(e.name) || matchStr(e.category) || matchStr(e.status) || matchStr(e.location)
    ).slice(0, 4)
  }
})

// Flatten results for keyboard navigation
const flatResultsList = computed(() => {
  const list = []
  categorizedResults.value.projects.forEach(item => list.push({ ...item, type: 'project', route: '/projects' }))
  categorizedResults.value.materials.forEach(item => list.push({ ...item, type: 'material', route: '/materials' }))
  categorizedResults.value.staff.forEach(item => list.push({ ...item, type: 'staff', route: '/staff' }))
  categorizedResults.value.tasks.forEach(item => list.push({ ...item, type: 'task', route: '/tasks' }))
  categorizedResults.value.equipment.forEach(item => list.push({ ...item, type: 'equipment', route: '/equipment' }))
  return list
})

const totalResultsCount = computed(() => flatResultsList.value.length)

watch(searchQuery, () => {
  activeIndex.value = -1
  if (searchQuery.value.trim()) {
    showSearchDropdown.value = true
  }
})

const navigateResults = (direction) => {
  if (!flatResultsList.value.length) return
  const max = flatResultsList.value.length - 1
  let next = activeIndex.value + direction
  if (next < 0) next = max
  if (next > max) next = 0
  activeIndex.value = next
}

const selectCurrentResult = () => {
  if (activeIndex.value >= 0 && activeIndex.value < flatResultsList.value.length) {
    const item = flatResultsList.value[activeIndex.value]
    const label = item.name || item.title
    goToResult(item.route, { search: label })
  }
}

const goToResult = (routePath, queryParams = {}) => {
  showSearchDropdown.value = false
  searchQuery.value = ''
  router.push({ path: routePath, query: queryParams })
}

const getStatusBadgeClass = (status) => {
  const s = String(status || '').toLowerCase()
  if (['active', 'completed', 'available', 'approved', 'in progress', 'high'].includes(s)) return 'bg-success-subtle text-success border border-success-subtle'
  if (['pending', 'in maintenance', 'medium'].includes(s)) return 'bg-warning-subtle text-warning border border-warning-subtle'
  if (['delayed', 'cancelled', 'inactive', 'critical'].includes(s)) return 'bg-danger-subtle text-danger border border-danger-subtle'
  return 'bg-secondary-subtle text-light border border-secondary-subtle'
}

// Close dropdown on outside click
const handleClickOutside = (event) => {
  if (searchWrapperRef.value && !searchWrapperRef.value.contains(event.target)) {
    showSearchDropdown.value = false
  }
}

const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.is_read).length
})

const fetchNotifications = async () => {
  try {
    const res = await notificationsApi.getAll()
    notifications.value = res.data || []
  } catch (err) {
    console.error('Failed to load notifications:', err)
  }
}

const handleMarkAllRead = async () => {
  try {
    await notificationsApi.markAllRead()
    notifications.value.forEach(n => { n.is_read = 1 })
  } catch (err) {
    console.error('Failed to mark read:', err)
  }
}

const openNotification = async (notification) => {
  showNotifications.value = false
  if (notification.project_id) router.push({ path: '/projects', query: { projectId: notification.project_id } })
}

const getNotifIconBg = (severity) => {
  if (severity === 'success') return 'bg-green'
  if (severity === 'warning') return 'bg-amber'
  if (severity === 'critical') return 'bg-rose'
  return 'bg-blue'
}

const formatTimeAgo = (dateStr) => {
  if (!dateStr) return 'Just now'
  const date = new Date(dateStr)
  const seconds = Math.floor((new Date() - date) / 1000)
  if (seconds < 60) return 'Just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return date.toLocaleDateString()
}

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  showUserMenu.value = false
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
  showNotifications.value = false
}

const getUserInitials = (name = '') => {
  if (!name) return 'AU'
  const parts = name.split(' ').filter(Boolean)
  return parts.slice(0, 2).map(part => part[0]?.toUpperCase() || '').join('') || 'AU'
}

const syncUser = () => {
  currentUser.value = JSON.parse(localStorage.getItem('cms_user') || '{}')
}

const handleLogout = async () => {
  showUserMenu.value = false

  try {
    await authApi.logout()
  } catch (error) {
    console.warn('Logout request failed; clearing local session:', error)
  }
  localStorage.removeItem('cms_token')
  localStorage.removeItem('cms_user')
  window.dispatchEvent(new Event('cms-auth-change'))
  syncUser()
  window.location.href = '/login'

  showInfo('You have logged out of MGM Command System.', 'Logged Out')
}

// Global keyboard shortcut for Cmd/Ctrl+K
const handleKeyDown = (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    const input = document.querySelector('.search-input')
    if (input) {
      input.focus()
      showSearchDropdown.value = true
    }
  }
}

onMounted(() => {
  syncUser()
  window.addEventListener('keydown', handleKeyDown)
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('cms-auth-change', syncUser)
  window.addEventListener('cms-notifications-refresh', fetchNotifications)
  fetchNotifications()
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown)
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('cms-auth-change', syncUser)
  window.removeEventListener('cms-notifications-refresh', fetchNotifications)
})
</script>

<style scoped>
.app-header {
  --header-bg: rgba(15, 23, 42, 0.95);
  --header-border: #1e293b;
  --text-muted: #94a3b8;
  --text-hover: #f8fafc;
  --accent-color: #3b82f6;
  --hover-bg: rgba(255, 255, 255, 0.06);
  --input-bg: rgba(30, 41, 59, 0.8);

  height: 64px;
  background-color: var(--header-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--header-border);
  z-index: 1030;
}

.header-search-wrapper {
  position: relative;
  width: 320px;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: var(--text-muted);
  pointer-events: none;
}

.search-input {
  width: 100%;
  height: 38px;
  padding: 0 44px 0 36px;
  background-color: var(--input-bg);
  border: 1px solid var(--header-border);
  border-radius: 999px;
  color: var(--text-hover);
  font-size: 0.85rem;
  transition: all 0.2s ease;
}

.search-input::placeholder {
  color: var(--text-muted);
}

.search-input:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  background-color: #0f172a;
}

.search-shortcut {
  position: absolute;
  right: 12px;
  background: var(--header-border);
  color: var(--text-muted);
  font-size: 0.68rem;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
}

.search-results-dropdown {
  position: absolute;
  top: 44px;
  left: 0;
  right: 0;
  width: 420px;
  max-height: 480px;
  overflow-y: auto;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 12px;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.65);
  padding: 8px;
  z-index: 1040;
}

.search-category-block {
  margin-bottom: 8px;
}

.search-category-block:last-child {
  margin-bottom: 0;
}

.search-result-group-title {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: #38bdf8;
  padding: 6px 10px 4px 10px;
  letter-spacing: 0.5px;
}

.search-result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 10px;
  color: #f8fafc;
  text-decoration: none;
  font-size: 13px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.search-result-item:hover,
.search-result-item.active {
  background: rgba(56, 189, 248, 0.15);
  border-left: 3px solid #38bdf8;
}

.item-title {
  font-weight: 600;
  font-size: 13px;
  color: #f1f5f9;
}

.item-sub {
  font-size: 11px;
  color: #94a3b8;
}

.badge-tag {
  font-size: 10.5px;
  padding: 2px 8px;
  border-radius: 6px;
  font-weight: 600;
  white-space: nowrap;
}

.bg-material {
  background: rgba(168, 85, 247, 0.2);
  color: #c084fc;
  border: 1px solid rgba(168, 85, 247, 0.3);
}

.bg-staff {
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.sys-telemetry-pill {
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid var(--header-border);
  padding: 6px 12px;
  border-radius: 999px;
}

.telemetry-text {
  font-size: 11.5px;
  font-weight: 500;
  color: #94a3b8;
}

.status-indicator-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.status-indicator-dot.green {
  background: #10b981;
  box-shadow: 0 0 6px #10b981;
}

.btn-action-icon {
  background: transparent;
  border: 1px solid transparent;
  color: var(--text-muted);
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-action-icon:hover {
  color: var(--text-hover);
  background-color: var(--hover-bg);
  border-color: var(--header-border);
}

.notification-indicator {
  position: absolute;
  top: 3px;
  right: 3px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  background-color: #3b82f6;
  color: #ffffff;
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.6);
  border: 1.5px solid #0f172a;
}

.notifications-dropdown {
  position: absolute;
  top: 48px;
  right: 0;
  width: 320px;
  background: #1e293b;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 14px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.5);
  padding: 14px;
  z-index: 1050;
}

.notif-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.notif-title { font-size: 13.5px; font-weight: 700; color: #fff; }
.notif-count { font-size: 11px; background: rgba(59, 130, 246, 0.2); color: #60a5fa; padding: 2px 8px; border-radius: 999px; font-weight: 600; }

.btn-mark-read {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.12);
  color: #94a3b8;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-mark-read:hover {
  color: #ffffff;
  background: rgba(59, 130, 246, 0.2);
  border-color: #3b82f6;
}

.notif-list { display: flex; flex-direction: column; gap: 10px; }
.notif-item { display: flex; gap: 10px; font-size: 12px; }
.notif-icon { width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
.bg-blue { background: rgba(59, 130, 246, 0.2); } .bg-green { background: rgba(16, 185, 129, 0.2); } .bg-purple { background: rgba(139, 92, 246, 0.2); }
.notif-text { color: #cbd5e1; line-height: 1.3; }
.notif-time { font-size: 10.5px; color: #64748b; margin-top: 2px; }

.header-divider {
  width: 1px;
  height: 24px;
  background-color: var(--header-border);
}

.user-profile-btn {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.user-profile-btn:hover {
  background-color: var(--hover-bg);
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: #ffffff;
  font-weight: 800;
  font-size: 0.85rem;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.user-name {
  color: var(--text-hover);
  font-weight: 700;
  font-size: 0.85rem;
  line-height: 1.1;
}

.user-role {
  color: var(--text-muted);
  font-size: 0.72rem;
}

.chevron-down {
  color: var(--text-muted);
}

.user-menu-dropdown {
  position: absolute;
  top: 48px;
  right: 0;
  width: 220px;
  background: #1e293b;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 14px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.5);
  padding: 8px;
  z-index: 1050;
}

.user-menu-header { padding: 8px 12px; }
.user-menu-name { font-size: 13.5px; font-weight: 700; color: #fff; }
.user-menu-email { font-size: 11px; color: #94a3b8; }
.menu-divider { height: 1px; background: rgba(255,255,255,0.08); margin: 6px 0; }
.menu-item { display: block; padding: 8px 12px; color: #cbd5e1; text-decoration: none; font-size: 13px; border-radius: 8px; cursor: pointer; transition: background 0.15s ease; }
.menu-item:hover { background: rgba(255, 255, 255, 0.08); color: #fff; }
.menu-item.text-danger { color: #f43f5e; }
.menu-item.text-danger:hover { background: rgba(244, 63, 94, 0.15); color: #f43f5e; }
</style>