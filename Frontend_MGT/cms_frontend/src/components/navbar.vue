<template>
  <header class="app-header sticky-top d-flex align-items-center">
    <div class="header-container container-fluid px-3 px-lg-4 d-flex align-items-center justify-content-between">
      
      <div class="d-flex align-items-center gap-3">
        <button
          @click="$emit('toggle-sidebar')"
          class="btn-action-icon d-lg-none"
          type="button"
          aria-label="Toggle Navigation"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div class="header-search-wrapper d-none d-md-flex align-items-center">
          <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            class="search-input" 
            placeholder="Search projects, tasks, staff..."
          />
          <kbd class="search-shortcut">⌘K</kbd>
        </div>
      </div>

      <div class="d-flex align-items-center gap-2 gap-sm-3">
        
        <button class="btn-action-icon d-md-none" type="button" aria-label="Search">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>

        <button class="btn-action-icon position-relative" type="button" aria-label="Notifications">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span class="notification-indicator"></span>
        </button>

        <div class="header-divider d-none d-sm-block"></div>

        <div class="user-profile-btn d-flex align-items-center gap-2 px-2 py-1 rounded">
          <div class="user-avatar d-flex align-items-center justify-content-center">
            AU
          </div>
          <div class="user-info d-none d-sm-block text-start">
            <div class="user-name">Admin User</div>
            <div class="user-role">Project Manager</div>
          </div>
        </div>

      </div>
    </div>
  </header>
</template>

<script setup>
defineEmits(['toggle-sidebar'])
</script>

<style scoped>
/* Color Palette & CSS Variables matching Sidebar */
.app-header {
  --header-bg: rgba(15, 23, 42, 0.85); /* Matches --sidebar-bg (#0f172a) */
  --header-border: #1e293b;            /* Matches --sidebar-border */
  --text-muted: #94a3b8;
  --text-hover: #f8fafc;
  --accent-color: #3b82f6;
  --hover-bg: rgba(255, 255, 255, 0.04);
  --input-bg: rgba(30, 41, 59, 0.6);

  height: 64px; /* Matches Sidebar Header Height */
  background-color: var(--header-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--header-border);
  z-index: 1030;
}

/* Global Search Component */
.header-search-wrapper {
  position: relative;
  width: 280px;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: var(--text-muted);
  pointer-events: none;
}

.search-input {
  width: 100%;
  height: 36px;
  padding: 0 40px 0 36px;
  background-color: var(--input-bg);
  border: 1px solid var(--header-border);
  border-radius: 8px;
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
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  background-color: rgba(30, 41, 59, 0.9);
}

.search-shortcut {
  position: absolute;
  right: 10px;
  background: var(--header-border);
  color: var(--text-muted);
  font-size: 0.7rem;
  padding: 2px 5px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

/* Common Action Buttons */
.btn-action-icon {
  background: transparent;
  border: 1px solid transparent;
  color: var(--text-muted);
  width: 38px;
  height: 38px;
  border-radius: 8px;
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

/* Notification Pulse Badge */
.notification-indicator {
  position: absolute;
  top: 9px;
  right: 9px;
  width: 7px;
  height: 7px;
  background-color: var(--accent-color);
  border-radius: 50%;
  box-shadow: 0 0 8px var(--accent-color);
}

/* Vertical Separator */
.header-divider {
  width: 1px;
  height: 22px;
  background-color: var(--header-border);
  margin: 0 4px;
}

/* User Profile Badge Styling */
.user-profile-btn {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.user-profile-btn:hover {
  background-color: var(--hover-bg);
}

.user-avatar {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: #ffffff;
  font-weight: 700;
  font-size: 0.8rem;
  box-shadow: 0 2px 6px rgba(59, 130, 246, 0.25);
}

.user-name {
  color: var(--text-hover);
  font-weight: 600;
  font-size: 0.85rem;
  line-height: 1.1;
}

.user-role {
  color: var(--text-muted);
  font-size: 0.72rem;
  line-weight: 1;
}
</style>