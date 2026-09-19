<template>
  <Teleport to="body">
    <Transition name="confirm-modal-fade">
      <div
        v-if="confirmDialogState.isOpen"
        class="confirm-modal-backdrop"
        @click.self="handleConfirmResponse(false)"
      >
        <div class="confirm-modal-card" role="dialog" aria-modal="true">
          <!-- Icon Header Badge -->
          <div class="modal-badge-wrapper" :class="`badge-${confirmDialogState.type}`">
            <!-- Danger / Delete Icon -->
            <svg
              v-if="confirmDialogState.type === 'danger'"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>

            <!-- Warning Triangle Icon -->
            <svg
              v-else-if="confirmDialogState.type === 'warning'"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.2"
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
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </div>

          <!-- Content Title & Message -->
          <div class="confirm-content text-center">
            <h5 class="confirm-title">{{ confirmDialogState.title }}</h5>
            <p class="confirm-message">{{ confirmDialogState.message }}</p>
          </div>

          <!-- Action Buttons -->
          <div class="confirm-actions">
            <button
              type="button"
              class="btn-confirm-cancel"
              @click="handleConfirmResponse(false)"
            >
              {{ confirmDialogState.cancelText || 'Cancel' }}
            </button>

            <button
              type="button"
              class="btn-confirm-submit"
              :class="`btn-${confirmDialogState.type}`"
              @click="handleConfirmResponse(true)"
            >
              {{ confirmDialogState.confirmText || 'Confirm' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { useAlert } from '../composables/useAlert'

const { confirmDialogState, handleConfirmResponse } = useAlert()

const handleKeydown = (e) => {
  if (!confirmDialogState.value.isOpen) return
  if (e.key === 'Escape') {
    handleConfirmResponse(false)
  } else if (e.key === 'Enter') {
    handleConfirmResponse(true)
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
/* =========================================================
   BACKDROP OVERLAY
========================================================= */
.confirm-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100000;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

/* =========================================================
   MODAL CARD
========================================================= */
.confirm-modal-card {
  width: 100%;
  max-width: 420px;
  background-color: #1e293b;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  padding: 28px 24px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.7),
    0 0 30px rgba(0, 0, 0, 0.4);
  transform: translateZ(0);
}

/* =========================================================
   BADGE WRAPPER & ICON
========================================================= */
.modal-badge-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
  transition: all 0.3s ease;
}

.badge-danger {
  background: rgba(239, 68, 68, 0.14);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.3);
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.2);
}

.badge-warning {
  background: rgba(245, 158, 11, 0.14);
  color: #fbbf24;
  border: 1px solid rgba(245, 158, 11, 0.3);
  box-shadow: 0 0 20px rgba(245, 158, 11, 0.2);
}

.badge-info {
  background: rgba(59, 130, 246, 0.14);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.3);
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
}

/* =========================================================
   CONTENT TYPOGRAPHY
========================================================= */
.confirm-content {
  margin-bottom: 24px;
  width: 100%;
}

.confirm-title {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.2px;
}

.confirm-message {
  margin: 0;
  font-size: 14px;
  color: #94a3b8;
  line-height: 1.5;
}

/* =========================================================
   ACTIONS
========================================================= */
.confirm-actions {
  display: flex;
  gap: 12px;
  width: 100%;
}

.btn-confirm-cancel {
  flex: 1;
  padding: 11px 16px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #cbd5e1;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-confirm-cancel:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.2);
}

.btn-confirm-submit {
  flex: 1;
  padding: 11px 16px;
  border-radius: 12px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.btn-danger {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.btn-danger:hover {
  background: linear-gradient(135deg, #f87171, #ef4444);
  box-shadow: 0 6px 18px rgba(239, 68, 68, 0.4);
  transform: translateY(-1px);
}

.btn-warning {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.btn-warning:hover {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  box-shadow: 0 6px 18px rgba(245, 158, 11, 0.4);
  transform: translateY(-1px);
}

.btn-info {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.btn-info:hover {
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
  box-shadow: 0 6px 18px rgba(59, 130, 246, 0.4);
  transform: translateY(-1px);
}

/* =========================================================
   ANIMATION TRANSITION
========================================================= */
.confirm-modal-fade-enter-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.confirm-modal-fade-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 1, 1);
}

.confirm-modal-fade-enter-from {
  opacity: 0;
}

.confirm-modal-fade-enter-from .confirm-modal-card {
  transform: scale(0.9) translateY(15px);
  opacity: 0;
}

.confirm-modal-fade-leave-to {
  opacity: 0;
}

.confirm-modal-fade-leave-to .confirm-modal-card {
  transform: scale(0.92) translateY(10px);
  opacity: 0;
}
</style>
