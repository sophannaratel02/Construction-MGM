<template>
  <aside
    :class="[
      'position-fixed',
      'top-0',
      'start-0',
      'bottom-0',
      'd-flex',
      'flex-column',
      'sidebar-aside',
      isCollapsed ? 'is-collapsed' : '',
      isOpen ? 'show-mobile' : ''
    ]"
  >
    <!-- Sidebar Header -->
    <div 
      class="sidebar-header d-flex align-items-center py-3"
      :class="isCollapsed ? 'justify-content-center px-1' : 'justify-content-between px-3'"
    >
      <template v-if="!isCollapsed">
        <div class="d-flex align-items-center gap-2 overflow-hidden">
          <div class="brand-logo flex-shrink-0">C</div>
          <h5 class="brand-title mb-0 text-nowrap">Construction MGT</h5>
        </div>

        <!-- Desktop Collapse Toggle Button (Expanded Mode) -->
        <button
          type="button"
          @click="$emit('toggle-collapse')"
          class="btn-toggle-collapse d-none d-lg-flex align-items-center justify-content-center flex-shrink-0"
          aria-label="Collapse Sidebar"
          title="Collapse Sidebar"
        >
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </template>

      <template v-else>
        <!-- Collapsed Mode Header: Clean Side-by-Side Logo & Expand Button -->
        <div class="d-flex align-items-center justify-content-center gap-1 w-100">
          <div class="brand-logo flex-shrink-0" style="width: 32px; height: 32px; font-size: 0.9rem;" title="Construction Management System">C</div>
          <button
            type="button"
            @click="$emit('toggle-collapse')"
            class="btn-toggle-collapse d-none d-lg-flex align-items-center justify-content-center flex-shrink-0"
            style="width: 26px; height: 26px;"
            aria-label="Expand Sidebar"
            title="Expand Sidebar"
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </template>

      <!-- Mobile Close Button -->
      <button
        type="button"
        @click="$emit('close')"
        class="btn-close-sidebar d-lg-none position-absolute end-0 me-2"
        aria-label="Close navigation"
      >
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Navigation Menu -->
    <nav class="sidebar-nav flex-grow-1 px-2 py-3 overflow-y-auto">
      <div class="d-flex flex-column gap-1">
        <router-link
          v-for="item in navItems"
          :key="item.name"
          :to="item.path"
          class="nav-item-link d-flex align-items-center rounded py-2 text-decoration-none"
          :class="isCollapsed ? 'px-2 justify-content-center' : 'px-3'"
          active-class="active"
          :title="isCollapsed ? item.name : ''"
        >
          <span class="nav-icon d-flex align-items-center justify-content-center" :class="{ 'me-2': !isCollapsed }">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" :d="item.svgPath" />
            </svg>
          </span>
          <span class="nav-text text-nowrap" v-if="!isCollapsed">{{ item.name }}</span>
        </router-link>
      </div>
    </nav>
  </aside>
</template>

<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    default: true
  },
  isCollapsed: {
    type: Boolean,
    default: false
  }
})

defineEmits(['close', 'toggle-collapse'])

const navItems = [
  { 
    name: 'Dashboard', 
    path: '/dashboard', 
    svgPath: 'M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 12a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1v-7z'
  },
  { 
    name: 'Projects', 
    path: '/projects', 
    svgPath: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4m-8-11h.01M12 10h.01M16 10h.01M9 14h.01M12 14h.01M16 14h.01'
  },
  { 
    name: 'Staff Management', 
    path: '/staff', 
    svgPath: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
  },
  { 
    name: 'Materials & Stock', 
    path: '/materials', 
    svgPath: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
  },
  { 
    name: 'Equipment', 
    path: '/equipment', 
    svgPath: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z'
  },
  { 
    name: 'Tasks', 
    path: '/tasks', 
    svgPath: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4'
  },
  { 
    name: 'Accounting', 
    path: '/accounting', 
    svgPath: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  { 
    name: 'Clients', 
    path: '/clients', 
    svgPath: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
  },
  { 
    name: 'Suppliers', 
    path: '/suppliers', 
    svgPath: 'M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z'
  }
]
</script>

<style scoped>
/* Color Palette & Custom Properties */
.sidebar-aside {
  --sidebar-bg: #0f172a;
  --sidebar-border: #1e293b;
  --text-muted: #94a3b8;
  --text-hover: #f8fafc;
  --accent-color: #3b82f6;
  --active-bg: rgba(59, 130, 246, 0.12);
  --hover-bg: rgba(255, 255, 255, 0.04);
  
  width: 260px;
  z-index: 1040;
  background-color: var(--sidebar-bg);
  border-right: 1px solid var(--sidebar-border);
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Collapsed Mini Sidebar State */
.sidebar-aside.is-collapsed {
  width: 76px;
}

/* Mobile Visibility Handling */
@media (max-width: 991.98px) {
  .sidebar-aside {
    width: 260px !important;
    transform: translateX(-100%);
    box-shadow: 0 0 25px rgba(0, 0, 0, 0.5);
  }
  .sidebar-aside.show-mobile {
    transform: translateX(0);
  }
}

/* Header Styling */
.sidebar-header {
  height: 64px;
  border-bottom: 1px solid var(--sidebar-border);
}

.brand-logo {
  width: 34px;
  height: 34px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: #ffffff;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1rem;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.brand-title {
  color: #f8fafc;
  font-weight: 700;
  font-size: 0.95rem;
  letter-spacing: 0.5px;
}

/* Collapse Toggle Button */
.btn-toggle-collapse {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--sidebar-border);
  color: var(--text-muted);
  width: 28px;
  height: 28px;
  border-radius: 7px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-toggle-collapse:hover {
  color: #ffffff;
  background-color: rgba(59, 130, 246, 0.2);
  border-color: var(--accent-color);
}

.btn-toggle-collapse svg {
  transition: transform 0.3s ease;
}

.btn-toggle-collapse svg.rotated {
  transform: rotate(180deg);
}

.btn-close-sidebar {
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 1rem;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-close-sidebar:hover {
  color: var(--text-hover);
  background-color: var(--hover-bg);
}

/* Scrollbar Customization */
.sidebar-nav::-webkit-scrollbar {
  width: 4px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: #1e293b;
  border-radius: 4px;
}

.sidebar-nav::-webkit-scrollbar-thumb:hover {
  background: #334155;
}

/* Navigation Link Styling */
.nav-item-link {
  color: var(--text-muted);
  font-size: 0.88rem;
  font-weight: 500;
  position: relative;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
  height: 42px;
}

.nav-item-link:hover {
  color: var(--text-hover);
  background-color: var(--hover-bg);
}

.nav-icon {
  font-size: 1.1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Active State */
.nav-item-link.active {
  color: #ffffff;
  background-color: var(--active-bg);
  border-left-color: var(--accent-color);
  font-weight: 600;
}
</style>