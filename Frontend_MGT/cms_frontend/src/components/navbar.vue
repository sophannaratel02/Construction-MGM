<template>
  <header class="app-header sticky-top d-flex align-items-center">
    <div class="header-container container-fluid px-3 px-lg-4 d-flex align-items-center justify-content-between">
      
      <!-- Left Section: Search Bar & System Branding -->
      <div class="d-flex align-items-center gap-3">
        <!-- Global Quick Search Input -->
        <div class="header-search-wrapper d-none d-md-flex align-items-center">
          <svg class="search-icon" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            v-model="searchQuery"
            type="text" 
            class="search-input" 
            placeholder=""
            @focus="showSearchDropdown = true"
            @blur="handleSearchBlur"
          />
          <kbd class="search-shortcut">⌘K</kbd>

          <!-- Search Dropdown Suggestions -->
          <div v-if="showSearchDropdown && searchQuery.trim()" class="search-results-dropdown">
            <div class="search-result-group-title">Quick Navigation</div>
            <router-link to="/projects" class="search-result-item" @click="showSearchDropdown = false">
              <span class="d-flex align-items-center gap-2">
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4m-8-11h.01M12 10h.01M16 10h.01M9 14h.01M12 14h.01M16 14h.01" /></svg>
                Projects Directory
              </span>
              <span class="badge-tag">Projects</span>
            </router-link>
            <router-link to="/tasks" class="search-result-item" @click="showSearchDropdown = false">
              <span class="d-flex align-items-center gap-2">
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                Work Orders & Tasks
              </span>
              <span class="badge-tag">Tasks</span>
            </router-link>
            <router-link to="/staff" class="search-result-item" @click="showSearchDropdown = false">
              <span class="d-flex align-items-center gap-2">
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                Staff Roster
              </span>
              <span class="badge-tag">Staff</span>
            </router-link>
            <router-link to="/equipment" class="search-result-item" @click="showSearchDropdown = false">
              <span class="d-flex align-items-center gap-2">
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                Fleet & Machinery
              </span>
              <span class="badge-tag">Equipment</span>
            </router-link>
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
            <span v-if="unreadCount > 0" class="notification-indicator"></span>
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
              <div v-for="item in notifications.slice(0, 6)" :key="item.id" class="notif-item" :class="{ unread: !item.isRead }">
                <div class="notif-icon" :class="getNotifIconBg(item.severity)">
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div>
                  <div class="notif-text">{{ item.description }}</div>
                  <div class="notif-time">{{ item.module }} • {{ formatTimeAgo(item.createdAt) }}</div>
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
              AU
            </div>
            <div class="user-info d-none d-sm-block text-start">
              <div class="user-name">Admin User</div>
              <div class="user-role">Project Director</div>
            </div>
            <svg class="chevron-down" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          <!-- User Menu Dropdown -->
          <div v-if="showUserMenu" class="user-menu-dropdown">
            <div class="user-menu-header">
              <div class="user-menu-name">Admin User</div>
              <div class="user-menu-email">admin@cms.kh</div>
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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { auditLogsApi } from '../services/api'
import { useAlert } from '../composables/useAlert'

const { showInfo } = useAlert()

defineEmits(['toggle-sidebar'])

const searchQuery = ref('')
const showSearchDropdown = ref(false)
const showNotifications = ref(false)
const showUserMenu = ref(false)
const notifications = ref([])

const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.isRead).length
})

const fetchNotifications = async () => {
  try {
    const res = await auditLogsApi.getAll()
    notifications.value = res.data || []
  } catch (err) {
    console.error('Failed to load notifications:', err)
  }
}

const handleMarkAllRead = async () => {
  try {
    await auditLogsApi.markAllRead()
    notifications.value.forEach(n => { n.isRead = 1 })
  } catch (err) {
    console.error('Failed to mark read:', err)
  }
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

const handleSearchBlur = () => {
  setTimeout(() => {
    showSearchDropdown.value = false
  }, 200)
}

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  showUserMenu.value = false
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
  showNotifications.value = false
}

const handleLogout = () => {
  showUserMenu.value = false
  showInfo('You have logged out of MGM Command System.', 'Logged Out')
}

// Global keyboard shortcut for Cmd/Ctrl+K
const handleKeyDown = (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    const input = document.querySelector('.search-input')
    if (input) input.focus()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  fetchNotifications()
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown)
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
  background: #1e293b;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.5);
  padding: 8px;
  z-index: 1040;
}

.search-result-group-title {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: #64748b;
  padding: 6px 10px;
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
  transition: background 0.15s ease;
}

.search-result-item:hover {
  background: rgba(255, 255, 255, 0.08);
}

.badge-tag {
  font-size: 10px;
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
  padding: 2px 6px;
  border-radius: 4px;
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
  top: 9px;
  right: 9px;
  width: 7px;
  height: 7px;
  background-color: #3b82f6;
  border-radius: 50%;
  box-shadow: 0 0 8px #3b82f6;
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