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
      isOpen ? 'show-mobile' : ''
    ]"
  >
    <div class="sidebar-header d-flex align-items-center justify-content-between px-4 py-3">
      <div class="d-flex align-items-center gap-2">
        <div class="brand-logo">M</div>
        <h5 class="brand-title mb-0">MGM System</h5>
      </div>

      <button
        type="button"
        @click="$emit('close')"
        class="btn-close-sidebar d-lg-none"
        aria-label="Close navigation"
      >
        ✕
      </button>
    </div>

    <nav class="sidebar-nav flex-grow-1 px-3 py-3 overflow-y-auto">
      <div class="d-flex flex-column gap-1">
        <router-link
          v-for="item in navItems"
          :key="item.name"
          :to="item.path"
          class="nav-item-link d-flex align-items-center rounded px-3 py-2 text-decoration-none"
          active-class="active"
        >
          <span class="nav-text">{{ item.name }}</span>
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
  }
})

defineEmits(['close'])

const navItems = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Projects', path: '/projects' },
  { name: 'Staff Management', path: '/staff' },
  { name: 'Materials & Stock', path: '/materials' },
  { name: 'Equipment', path: '/equipment' },
  { name: 'Tasks', path: '/tasks' },
  { name: 'Accounting', path: '/accounting' },
  { name: 'Clients', path: '/clients' },
  { name: 'Suppliers', path: '/suppliers' }
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
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Mobile Visibility Handling */
@media (max-width: 991.98px) {
  .sidebar-aside {
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
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: #ffffff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.95rem;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.brand-title {
  color: #f8fafc;
  font-weight: 600;
  font-size: 0.95rem;
  letter-spacing: 0.5px;
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
  width: 5px;
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
}

.nav-item-link:hover {
  color: var(--text-hover);
  background-color: var(--hover-bg);
}

/* Active State */
.nav-item-link.active {
  color: #ffffff;
  background-color: var(--active-bg);
  border-left-color: var(--accent-color);
  font-weight: 600;
}

</style>