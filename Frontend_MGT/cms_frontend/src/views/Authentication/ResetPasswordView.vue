<template>
  <div class="auth-shell">
    <div class="auth-card">
      <div class="brand-block">
        <div class="brand-logo">C</div>
        <div>
          <p class="eyebrow">Construction Management System</p>
          <h1>Reset Password</h1>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="auth-form">
        <div class="form-group">
          <label>New Password</label>
          <input v-model="password" type="password" placeholder="New password" required />
        </div>

        <div class="form-group">
          <label>Confirm Password</label>
          <input v-model="confirmPassword" type="password" placeholder="Confirm new password" required />
        </div>

        <button type="submit" class="primary-button" :disabled="isSubmitting">
          {{ isSubmitting ? 'Updating...' : 'Update Password' }}
        </button>

        <p v-if="message" :class="messageType === 'error' ? 'error-message' : 'success-message'">{{ message }}</p>

        <div class="auth-link-row">
          <router-link to="/login">Back to login</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { authApi } from '../../services/api.js'

const route = useRoute()
const router = useRouter()
const password = ref('')
const confirmPassword = ref('')
const isSubmitting = ref(false)
const message = ref('')
const messageType = ref('error')
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/

const handleSubmit = async () => {
  if (isSubmitting.value) return
  if (!route.params.token) {
    message.value = 'This reset link is missing its token.'
    messageType.value = 'error'
    return
  }

  if (password.value !== confirmPassword.value) {
    message.value = 'Passwords do not match.'
    messageType.value = 'error'
    return
  }

  if (!passwordPattern.test(password.value)) {
    message.value = 'Password must be at least 8 characters and include uppercase, lowercase, and a number.'
    messageType.value = 'error'
    return
  }

  isSubmitting.value = true
  message.value = ''

  try {
    const token = route.params.token || ''
    const response = await authApi.resetPassword(token, password.value)

    message.value = response.data.message
    messageType.value = 'success'

    setTimeout(() => router.push('/login'), 1200)
  } catch (error) {
    message.value = error.response?.data?.message || 'Unable to reset password.'
    messageType.value = 'error'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.auth-shell {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f172a, #1e293b 35%, #0ea5e9 100%);
  padding: 24px;
}

.auth-card {
  width: min(100%, 470px);
  background: rgba(15, 23, 42, 0.78);
  border: 1px solid rgba(148, 163, 184, 0.28);
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 24px 80px rgba(15, 23, 42, 0.45);
}

.brand-block {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.brand-logo {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  font-weight: 900;
  font-size: 1.5rem;
}

.eyebrow {
  margin: 0;
  color: #93c5fd;
  letter-spacing: 0.12em;
  font-size: 0.72rem;
  text-transform: uppercase;
}

h1 {
  margin: 6px 0 0;
  color: white;
  font-size: clamp(1.8rem, 2.7vw, 2.4rem);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  color: #dbeafe;
  font-weight: 600;
}

input {
  border: 1px solid rgba(148, 163, 184, 0.3);
  background: rgba(15, 23, 42, 0.6);
  color: white;
  border-radius: 12px;
  padding: 0.8rem 0.9rem;
}

.primary-button {
  border: none;
  border-radius: 12px;
  padding: 0.9rem 1rem;
  font-weight: 700;
  color: white;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  cursor: pointer;
}

.auth-link-row {
  display: flex;
  justify-content: center;
}

.auth-link-row a {
  color: #93c5fd;
  text-decoration: none;
  font-weight: 600;
}

.error-message, .success-message {
  padding: 0.8rem 0.9rem;
  border-radius: 10px;
  margin: 0;
}

.error-message {
  background: rgba(127, 29, 29, 0.25);
  border: 1px solid rgba(248, 113, 113, 0.35);
  color: #fecaca;
}

.success-message {
  background: rgba(20, 83, 45, 0.25);
  border: 1px solid rgba(74, 222, 128, 0.35);
  color: #bbf7d0;
}
</style>
