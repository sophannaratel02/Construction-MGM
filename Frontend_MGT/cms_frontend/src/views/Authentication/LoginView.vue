<template>
  <div class="login-shell">
    <div class="login-card">
      <div class="brand-block">
        <div class="brand-logo">C</div>
        <div>
          <p class="eyebrow">Construction Management System</p>
          <h1>Secure Access Portal</h1>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="login-form">
        <div class="form-group">
          <label for="email">Email Address</label>
          <input id="email" v-model="email" type="email" placeholder="admin@cms.kh" required />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input id="password" v-model="password" type="password" placeholder="Enter your password" required />
        </div>

        <!-- <div class="form-row">
          <span>Default admin</span>
          <span class="meta-pill">Admin@123</span>
        </div> -->

        <button type="submit" class="login-button" :disabled="isSubmitting">
          {{ isSubmitting ? 'Signing in...' : 'Sign in' }}
        </button>

        <div class="auth-link-row">
          <router-link to="/forgot-password">Forgot password?</router-link>
          <span>•</span>
          <router-link to="/register">Create account</router-link>
        </div>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { authApi } from '../../services/api.js'

const router = useRouter()
const route = useRoute()
const email = ref('admin@cms.kh')
const password = ref('Admin@123')
const errorMessage = ref('')
const isSubmitting = ref(false)
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const successMessage = ref(route.query.registered ? 'Account created. You can now sign in.' : '')

const handleSubmit = async () => {
  if (isSubmitting.value) return
  errorMessage.value = ''

  if (!emailPattern.test(email.value.trim())) {
    errorMessage.value = 'Enter a valid email address.'
    return
  }

  if (!password.value) {
    errorMessage.value = 'Enter your password.'
    return
  }

  isSubmitting.value = true

  try {
    const response = await authApi.login(email.value.trim(), password.value)
    const { token, user } = response.data

    localStorage.setItem('cms_token', token)
    localStorage.setItem('cms_user', JSON.stringify(user))
    window.dispatchEvent(new Event('cms-auth-change'))

    router.push(user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard')
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Unable to sign in. Please check your credentials.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.login-shell {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at top, #dfeafc 0%, #edf4ff 28%, #0f172a 100%);
  padding: 24px;
}

.login-card {
  width: min(100%, 480px);
  background: rgba(15, 23, 42, 0.82);
  border: 1px solid rgba(148, 163, 184, 0.25);
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 24px 80px rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(10px);
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
  font-weight: 800;
  font-size: 1.5rem;
}

.eyebrow {
  margin: 0;
  color: #93c5fd;
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

h1 {
  margin: 6px 0 0;
  color: white;
  font-size: clamp(1.8rem, 3vw, 2.4rem);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  color: #dbeafe;
  font-size: 0.9rem;
  font-weight: 600;
}

input {
  border: 1px solid rgba(148, 163, 184, 0.28);
  background: rgba(15, 23, 42, 0.6);
  color: white;
  border-radius: 12px;
  padding: 0.8rem 0.9rem;
  outline: none;
  transition: border-color 0.2s ease;
}

input:focus {
  border-color: #60a5fa;
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.15);
}

.form-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #cbd5e1;
  font-size: 0.82rem;
}

.meta-pill {
  background: rgba(59, 130, 246, 0.14);
  border: 1px solid rgba(96, 165, 250, 0.3);
  border-radius: 999px;
  padding: 0.4rem 0.75rem;
  color: #dbeafe;
  font-weight: 600;
}

.login-button {
  border: none;
  border-radius: 12px;
  padding: 0.9rem 1rem;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.login-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.35);
}

.login-button:disabled {
  opacity: 0.8;
  cursor: wait;
}

.auth-link-row {
  display: flex;
  justify-content: center;
  gap: 10px;
  color: #cbd5e1;
  font-size: 0.9rem;
}

.auth-link-row a {
  color: #93c5fd;
  text-decoration: none;
  font-weight: 600;
}

.error-message {
  margin: 0;
  color: #fca5a5;
  border-radius: 10px;
  background: rgba(127, 29, 29, 0.2);
  border: 1px solid rgba(248, 113, 113, 0.3);
  padding: 0.8rem 0.9rem;
}
</style>
