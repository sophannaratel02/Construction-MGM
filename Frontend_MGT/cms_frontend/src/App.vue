<template>
  <div v-if="showMainLayout" class="app-container">
    <Sidebar
      :is-open="isSidebarOpen"
      :is-collapsed="isSidebarCollapsed"
      :user-role="currentUser.role"
      @close="isSidebarOpen = false"
      @toggle-collapse="isSidebarCollapsed = !isSidebarCollapsed"
    />

    <Transition name="backdrop">
      <div
        v-if="isSidebarOpen"
        class="sidebar-backdrop d-lg-none"
        @click="isSidebarOpen = false"
      ></div>
    </Transition>

    <div
      class="app-content"
      :class="{ 'sidebar-collapsed': isSidebarCollapsed }"
    >
      <Navbar @toggle-sidebar="toggleSidebar" />
      <main class="app-main">
        <div class="content-wrapper">
          <router-view />
        </div>
      </main>
    </div>

    <!-- Global Project-Matched Alert Toast Notifications -->
    <AlertToast />
  </div>

  <router-view v-else />
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Navbar from './components/navbar.vue'
import Sidebar from './components/sidebar.vue'

import { authApi } from './services/api.js'
import AlertToast from './components/AlertToast.vue'
main

const route = useRoute()
const router = useRouter()
const isSidebarOpen = ref(window.matchMedia('(min-width: 992px)').matches)
const isSidebarCollapsed = ref(localStorage.getItem('sidebar_collapsed') === 'true')
const isAuthenticated = ref(!!localStorage.getItem('cms_token'))
const currentUser = ref(JSON.parse(localStorage.getItem('cms_user') || '{}'))
const showMainLayout = computed(() => route.meta.requiresAuth && isAuthenticated.value)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const syncAuthState = () => {
  isAuthenticated.value = !!localStorage.getItem('cms_token')
  currentUser.value = JSON.parse(localStorage.getItem('cms_user') || '{}')

  if (!isAuthenticated.value && route.meta.requiresAuth) {
    router.replace('/login')
  }
}

const validateSession = async () => {
  if (!localStorage.getItem('cms_token')) return

  try {
    const response = await authApi.me()
    localStorage.setItem('cms_user', JSON.stringify(response.data.user))
    currentUser.value = response.data.user
    isAuthenticated.value = true
  } catch (error) {
    localStorage.removeItem('cms_token')
    localStorage.removeItem('cms_user')
    isAuthenticated.value = false
    if (route.meta.requiresAuth) {
      router.replace('/login')
    }
  }
}

const syncViewport = () => {
  if (window.matchMedia('(min-width: 992px)').matches) {
    isSidebarOpen.value = true
  }
}

watch(isSidebarCollapsed, (newVal) => {
  localStorage.setItem('sidebar_collapsed', newVal.toString())
})

onMounted(() => {
  window.addEventListener('cms-auth-change', syncAuthState)
  window.addEventListener('resize', syncViewport)
  validateSession()
})

onBeforeUnmount(() => {
  window.removeEventListener('cms-auth-change', syncAuthState)
  window.removeEventListener('resize', syncViewport)
})
</script>

<style scoped>

/* =========================================================
   ROOT APPLICATION
========================================================= */

.app-container {
  width: 100%;
  min-height: 100vh;

  display: flex;

  background: #f5f7fb;

  overflow-x: hidden;
}


/* =========================================================
   APPLICATION CONTENT
========================================================= */

.app-content {
  width: calc(100% - 260px);
  min-height: 100vh;

  margin-left: 260px;

  display: flex;
  flex-direction: column;

  background: #f5f7fb;

  transition:
    width 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  position: relative;
}


/* =========================================================
   COLLAPSED SIDEBAR
========================================================= */

.app-content.sidebar-collapsed {
  width: calc(100% - 76px);
  margin-left: 76px;
}


/* =========================================================
   MAIN CONTENT
========================================================= */

.app-main {
  flex: 1;

  width: 100%;

  padding: 24px;

  background:
    linear-gradient(
      180deg,
      #f8fafc 0%,
      #f5f7fb 100%
    );

  overflow-x: hidden;
  overflow-y: auto;

  box-sizing: border-box;
}


/* =========================================================
   CONTENT WRAPPER
========================================================= */

.content-wrapper {
  width: 100%;
  max-width: 1600px;

  margin: 0 auto;
}


/* =========================================================
   MOBILE BACKDROP
========================================================= */

.sidebar-backdrop {
  position: fixed;

  inset: 0;

  width: 100%;
  height: 100%;

  background: rgba(15, 23, 42, 0.48);

  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);

  z-index: 999;

  cursor: pointer;
}


/* =========================================================
   BACKDROP ANIMATION
========================================================= */

.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.25s ease;
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}


/* =========================================================
   LARGE DESKTOP
========================================================= */

@media (min-width: 1400px) {

  .app-main {
    padding: 28px 32px;
  }

}


/* =========================================================
   TABLET
========================================================= */

@media (max-width: 1199.98px) {

  .app-content {
    width: calc(100% - 240px);
    margin-left: 240px;
  }

  .app-content.sidebar-collapsed {
    width: calc(100% - 76px);
    margin-left: 76px;
  }

  .app-main {
    padding: 22px;
  }

}


/* =========================================================
   LARGE TABLET / MOBILE
========================================================= */

@media (max-width: 991.98px) {

  .app-content {
    width: 100%;
    margin-left: 0;
  }

  .app-content.sidebar-collapsed {
    width: 100%;
  }

  .app-main {
    padding: 20px;
  }

}


/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 767.98px) {

  .app-main {
    padding: 16px;
  }

  .content-wrapper {
    width: 100%;
  }

}


/* =========================================================
   SMALL MOBILE
========================================================= */

@media (max-width: 575.98px) {

  .app-main {
    padding: 12px;
  }

  .content-wrapper {
    width: 100%;
    max-width: none;
  }

}


/* =========================================================
   VERY SMALL MOBILE
========================================================= */

@media (max-width: 375px) {

  .app-main {
    padding: 10px;
  }

}


/* =========================================================
   SCROLLBAR
========================================================= */

.app-main::-webkit-scrollbar {
  width: 6px;
}

.app-main::-webkit-scrollbar-track {
  background: transparent;
}

.app-main::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.app-main::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}


/* =========================================================
   SMOOTH RENDERING
========================================================= */

.app-container,
.app-content,
.app-main {
  box-sizing: border-box;
}

</style>
