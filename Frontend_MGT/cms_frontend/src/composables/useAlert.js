import { ref } from 'vue'

const alerts = ref([])
let alertCounter = 0

// Custom On-Screen Confirmation Modal State
const confirmDialogState = ref({
  isOpen: false,
  title: 'Confirm Action',
  message: 'Are you sure you want to proceed?',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  type: 'danger', // 'danger' | 'warning' | 'info'
  resolve: null
})

export function useAlert() {
  const showAlert = ({
    type = 'success',
    title = '',
    message = '',
    duration = 4000
  }) => {
    const id = ++alertCounter

    const alertItem = {
      id,
      type,
      title: title || (type === 'success' ? 'Success' : type === 'error' ? 'Error' : type === 'warning' ? 'Notice' : 'Information'),
      message,
      duration,
      createdAt: Date.now()
    }

    alerts.value.push(alertItem)

    if (duration > 0) {
      setTimeout(() => {
        removeAlert(id)
      }, duration)
    }

    return id
  }

  const showSuccess = (message, title = 'Saved Successfully', duration = 4000) => {
    return showAlert({ type: 'success', title, message, duration })
  }

  const showError = (message, title = 'Action Failed', duration = 5000) => {
    return showAlert({ type: 'error', title, message, duration })
  }

  const showWarning = (message, title = 'Attention Required', duration = 4500) => {
    return showAlert({ type: 'warning', title, message, duration })
  }

  const showInfo = (message, title = 'System Information', duration = 4000) => {
    return showAlert({ type: 'info', title, message, duration })
  }

  const removeAlert = (id) => {
    const index = alerts.value.findIndex(a => a.id === id)
    if (index !== -1) {
      alerts.value.splice(index, 1)
    }
  }

  const clearAlerts = () => {
    alerts.value = []
  }

  // Custom On-Screen Confirm Alert Trigger
  const showConfirm = ({
    title = 'Confirm Action',
    message = 'Are you sure you want to perform this action?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'danger'
  } = {}) => {
    return new Promise((resolve) => {
      confirmDialogState.value = {
        isOpen: true,
        title,
        message,
        confirmText,
        cancelText,
        type,
        resolve
      }
    })
  }

  const handleConfirmResponse = (isConfirmed) => {
    if (confirmDialogState.value.resolve) {
      confirmDialogState.value.resolve(isConfirmed)
    }
    confirmDialogState.value.isOpen = false
  }

  return {
    alerts,
    confirmDialogState,
    showAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm,
    handleConfirmResponse,
    removeAlert,
    clearAlerts
  }
}
