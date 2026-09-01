```vue
<template>
  <div class="app-container">

    <!-- Sidebar -->
    <Sidebar
      :is-open="isSidebarOpen"
      @close="isSidebarOpen = false"
    />

    <!-- Mobile Backdrop -->
    <Transition name="backdrop">
      <div
        v-if="isSidebarOpen"
        class="sidebar-backdrop d-lg-none"
        @click="isSidebarOpen = false"
      ></div>
    </Transition>

    <!-- Application Content -->
    <div
      class="app-content"
      :class="{ 'sidebar-collapsed': !isSidebarOpen }"
    >

      <!-- Navbar -->
      <Navbar
        @toggle-sidebar="toggleSidebar"
      />

      <!-- Main Content -->
      <main class="app-main">
        <div class="content-wrapper">
          <router-view />
        </div>
      </main>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Navbar from './components/navbar.vue'
import Sidebar from './components/sidebar.vue'

const isSidebarOpen = ref(true)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}
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
    width 0.3s ease,
    margin-left 0.3s ease;

  position: relative;
}


/* =========================================================
   COLLAPSED SIDEBAR
========================================================= */

.app-content.sidebar-collapsed {
  width: 100%;
  margin-left: 0;
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
    width: 100%;
    margin-left: 0;
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
```
