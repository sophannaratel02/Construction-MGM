<template>
  <div class="toast-container-fixed" aria-live="polite">
    <TransitionGroup name="toast-slide" tag="div" class="toast-stack">
      <div
        v-for="alert in alerts"
        :key="alert.id"
        class="custom-toast-card"
        :class="`toast-${alert.type}`"
        role="alert"
      >
        <!-- Left Glow / Icon Column -->
        <div class="toast-icon-wrap" :class="`icon-${alert.type}`">
          <!-- Success Check Icon -->
          <svg
            v-if="alert.type === 'success'"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>

          <!-- Error Alert Icon -->
          <svg
            v-else-if="alert.type === 'error'"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>

          <!-- Warning Alert Icon -->
          <svg
            v-else-if="alert.type === 'warning'"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>

          <!-- Info Icon -->
          <svg
            v-else
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        </div>

        <!-- Content Column -->
        <div class="toast-body-content">
          <div class="toast-title-row">
            <h6 class="toast-title">{{ alert.title }}</h6>
            <button
              type="button"
              class="toast-close-btn"
              @click="removeAlert(alert.id)"
              aria-label="Close notification"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <p class="toast-message">{{ alert.message }}</p>
        </div>

        <!-- Progress Bar Indicator -->
        <div
          v-if="alert.duration > 0"
          class="toast-progress-bar"
          :class="`progress-${alert.type}`"
          :style="{ animationDuration: `${alert.duration}ms` }"
        ></div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useAlert } from '../composables/useAlert'

const { alerts, removeAlert } = useAlert()
</script>

<style scoped>
/* =========================================================
   CONTAINER & LAYOUT
========================================================= */
.toast-container-fixed {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 99999;
  max-width: 420px;
  width: calc(100% - 48px);
  pointer-events: none;
}

.toast-stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* =========================================================
   TOAST CARD
========================================================= */
.custom-toast-card {
  pointer-events: auto;
  position: relative;
  overflow: hidden;
  background-color: #1e293b;
  color: #f8fafc;
  border-radius: 14px;
  padding: 14px 16px 16px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.55),
    0 8px 10px -6px rgba(0, 0, 0, 0.4);
  transition: all 0.25s ease;
}

.custom-toast-card:hover {
  transform: translateY(-2px);
  box-shadow:
    0 25px 30px -5px rgba(0, 0, 0, 0.65),
    0 10px 12px -6px rgba(0, 0, 0, 0.5);
}

/* =========================================================
   THEME STYLES (MATCH PROJECT UI)
========================================================= */
/* Success (Emerald Accent) */
.toast-success {
  border: 1px solid rgba(16, 185, 129, 0.4);
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.55),
    0 0 20px -3px rgba(16, 185, 129, 0.2);
}

.icon-success {
  background: rgba(16, 185, 129, 0.16);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.35);
  box-shadow: 0 0 12px rgba(16, 185, 129, 0.2);
}

.progress-success {
  background: linear-gradient(90deg, #10b981, #34d399);
}

/* Error (Red Accent) */
.toast-error {
  border: 1px solid rgba(239, 68, 68, 0.45);
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.55),
    0 0 20px -3px rgba(239, 68, 68, 0.2);
}

.icon-error {
  background: rgba(239, 68, 68, 0.16);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.35);
  box-shadow: 0 0 12px rgba(239, 68, 68, 0.2);
}

.progress-error {
  background: linear-gradient(90deg, #ef4444, #f87171);
}

/* Warning (Amber Accent) */
.toast-warning {
  border: 1px solid rgba(245, 158, 11, 0.45);
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.55),
    0 0 20px -3px rgba(245, 158, 11, 0.2);
}

.icon-warning {
  background: rgba(245, 158, 11, 0.16);
  color: #fbbf24;
  border: 1px solid rgba(245, 158, 11, 0.35);
  box-shadow: 0 0 12px rgba(245, 158, 11, 0.2);
}

.progress-warning {
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
}

/* Info (Blue Accent) */
.toast-info {
  border: 1px solid rgba(59, 130, 246, 0.45);
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.55),
    0 0 20px -3px rgba(59, 130, 246, 0.2);
}

.icon-info {
  background: rgba(59, 130, 246, 0.16);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.35);
  box-shadow: 0 0 12px rgba(59, 130, 246, 0.2);
}

.progress-info {
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
}

/* =========================================================
   ICON WRAPPER
========================================================= */
.toast-icon-wrap {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
}

/* =========================================================
   BODY CONTENT
========================================================= */
.toast-body-content {
  flex: 1;
  min-width: 0;
}

.toast-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 3px;
}

.toast-title {
  margin: 0;
  font-size: 13.5px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.1px;
  line-height: 1.25;
}

.toast-message {
  margin: 0;
  font-size: 12.5px;
  color: #cbd5e1;
  line-height: 1.45;
  word-break: break-word;
}

/* =========================================================
   CLOSE BUTTON
========================================================= */
.toast-close-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
  transition: all 0.15s ease;
}

.toast-close-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
}

/* =========================================================
   ANIMATED PROGRESS BAR
========================================================= */
.toast-progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  width: 100%;
  animation: shrinkProgress linear forwards;
}

@keyframes shrinkProgress {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

/* =========================================================
   VUE TRANSITION ANIMATIONS
========================================================= */
.toast-slide-enter-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-slide-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 1, 1);
}

.toast-slide-enter-from {
  opacity: 0;
  transform: translateX(40px) scale(0.95);
}

.toast-slide-leave-to {
  opacity: 0;
  transform: translateX(60px) scale(0.9);
}

/* Responsive adjustments */
@media (max-width: 576px) {
  .toast-container-fixed {
    top: 16px;
    right: 16px;
    left: 16px;
    width: auto;
    max-width: none;
  }
}
</style>
