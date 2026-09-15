<template>
  <div class="auth-shell">
    <div class="auth-card">
      <div class="brand-block">
        <div class="brand-logo">C</div>
        <div>
          <p class="eyebrow">Construction Management System</p>
          <h1>Forgot Password</h1>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="auth-form">
        <div class="form-group">
          <label>Email Address</label>
          <input v-model="email" type="email" placeholder="Enter your email" required />
        </div>

        <button type="submit" class="primary-button" :disabled="isSubmitting">
          {{ isSubmitting ? 'Processing...' : 'Send Reset Link' }}
        </button>

        <p v-if="message" :class="messageType === 'error' ? 'error-message' : 'success-message'">{{ message }}</p>
        <p v-if="resetUrl" class="success-message">
          Development reset link:
          <a :href="resetUrl">Open reset page</a>
        </p>

        <div class="auth-link-row">
          <router-link to="/login">Back to login</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { authApi } from '../../services/api.js'

const email = ref('')
const isSubmitting = ref(false)
const message = ref('')
const messageType = ref('error')
const resetUrl = ref('')
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const handleSubmit = async () => {
  if (isSubmitting.value) return
  if (!emailPattern.test(email.value.trim())) {
    message.value = 'Enter a valid email address.'
    messageType.value = 'error'
    return
  }

  isSubmitting.value = true
  message.value = ''
  resetUrl.value = ''

  try {
    const response = await authApi.forgotPassword(email.value.trim())
    message.value = response.data.message
    resetUrl.value = response.data.resetUrl || ''
    messageType.value = 'success'
  } catch (error) {
    message.value = error.response?.data?.message || 'Unable to process request.'
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
