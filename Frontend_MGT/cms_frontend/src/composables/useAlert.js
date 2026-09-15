import { ref } from 'vue'

const alerts = ref([])

let alertCounter = 0

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

  return {
    alerts,
    showAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeAlert,
    clearAlerts
  }
}
