<template>
  <div class="auth-page-wrapper">
    <div class="split-auth-container">
      <!-- Left Hero Panel: Khmer Title & Skyscraper Image -->
      <div class="hero-showcase-panel">
        <div class="hero-content">
          <div class="hero-brand-tag">
            <svg class="badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 21h18M3 10h18M3 15h18M5 6l7-3 7 3M4 10v11M20 10v11M8 10v11M12 10v11M16 10v11"/>
            </svg>
            <span>ប្រព័ន្ធគ្រប់គ្រងសំណង់</span>
          </div>

          <h1 class="hero-headline">
            ប្រព័ន្ធគ្រប់គ្រង<br/>
            <span class="gold-gradient">គម្រោងសំណង់</span>
          </h1>

         <p class="hero-subtitle">
            គ្រប់គ្រងគម្រោង សម្ភារៈ បុគ្គលិក ថវិកា និងរបាយការណ៍ ក្នុងប្រព័ន្ធតែមួយ។
          </p>

          <!-- Featured Construction Image Showcase Card -->
          <div class="image-showcase-card">
            <img src="../../assets/modern_construction_hero.jpg" alt="Modern Skyscraper Construction" class="hero-building-img" />
            
            <!-- Live Status Overlay -->
            <div class="image-overlay-badge">
              <span class="pulse-dot"></span>
              <span>ការដ្ឋានដំណើរការផ្សាយបន្តផ្ទាល់ (Live Site Status)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Auth Form Panel: Khmer Form Card -->
      <div class="auth-form-panel">
        <div class="glass-auth-card">
          <div class="brand-header">
            <div class="brand-logo">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 21h18M3 10h18M3 15h18M5 6l7-3 7 3M4 10v11M20 10v11M8 10v11M12 10v11M16 10v11"/>
              </svg>
            </div>
            <div>
              <span class="portal-eyebrow">CONSTRUCTION MANAGEMENT SYSTEM</span>
              <h2 class="auth-title">ចូលប្រើប្រព័ន្ធ</h2>
              <p class="auth-desc">សូមបញ្ចូលអ៊ីមែល និងពាក្យសម្ងាត់ដើម្បីបន្តទៅផ្ទាំងគ្រប់គ្រង</p>
            </div>
          </div>

          <form @submit.prevent="handleSubmit" class="auth-form">
            <div class="form-group">
              <label for="email">អាសយដ្ឋានអ៊ីមែល (Email)</label>
              <div class="input-wrapper">
                <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  placeholder="admin@cms.kh"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <div class="label-row">
                <label for="password">ពាក្យសម្ងាត់ (Password)</label>
                <router-link to="/forgot-password" class="forgot-link">ភ្លេចពាក្យសម្ងាត់?</router-link>
              </div>
              <div class="input-wrapper">
                <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="បញ្ចូលពាក្យសម្ងាត់របស់អ្នក"
                  required
                />
                <button
                  type="button"
                  class="password-toggle"
                  @click="showPassword = !showPassword"
                  :title="showPassword ? 'Hide Password' : 'Show Password'"
                >
                  <svg v-if="!showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Error Banner -->
            <div v-if="errorMessage" class="alert-banner error-alert">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>{{ errorMessage }}</span>
            </div>

            <!-- Success Banner -->
            <div v-if="successMessage" class="alert-banner success-alert">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <span>{{ successMessage }}</span>
            </div>

            <button type="submit" class="submit-btn" :disabled="isSubmitting">
              <span v-if="!isSubmitting">ចូលប្រើប្រព័ន្ធ</span>
              <span v-else class="btn-spinner-row">
                <svg class="spinner-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="10"/>
                </svg>
                កំពុងផ្ទៀងផ្ទាត់...
              </span>
            </button>

            <div class="auth-footer-row">
              <span>មិនទាន់មានគណនីមែនទេ?</span>
              <router-link to="/register" class="register-link">បង្កើតគណនីថ្មី</router-link>
            </div>
          </form>
        </div>
      </div>
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
const showPassword = ref(false)
const errorMessage = ref('')
const isSubmitting = ref(false)
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const successMessage = ref(route.query.registered ? 'គណនីត្រូវបានបង្កើតដោយជោគជ័យ។ អ្នកអាចចូលប្រើប្រព័ន្ធបានឥឡូវនេះ។' : '')

const handleSubmit = async () => {
  if (isSubmitting.value) return
  errorMessage.value = ''

  if (!emailPattern.test(email.value.trim())) {
    errorMessage.value = 'សូមបញ្ចូលអាសយដ្ឋានអ៊ីមែលត្រឹមត្រូវ។'
    return
  }

  if (!password.value) {
    errorMessage.value = 'សូមបញ្ចូលពាក្យសម្ងាត់របស់អ្នក។'
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
    errorMessage.value = error.response?.data?.message || 'មិនអាចចូលប្រើប្រព័ន្ធបានទេ។ សូមពិនិត្យអ៊ីមែល និងពាក្យសម្ងាត់របស់អ្នកឡើងវិញ។'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.auth-page-wrapper {
  min-height: 100vh;
  background: #0b0f17;
  color: #f8fafc;
  font-family: 'Kantumruy Pro', 'Inter', sans-serif;
}

.split-auth-container {
  display: flex;
  width: 100%;
  min-height: 100vh;
}

/* Left Hero Showcase Panel - Human SaaS Style */
.hero-showcase-panel {
  flex: 1.1;
  background: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
  border-right: 1px solid #1e293b;
}

.hero-content {
  max-width: 500px;
  width: 100%;
}

.hero-brand-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.25);
  color: #f59e0b;
  font-size: 0.825rem;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 6px;
  margin-bottom: 20px;
}

.badge-icon {
  width: 16px;
  height: 16px;
}

.hero-headline {
  font-family: 'Kantumruy Pro', sans-serif;
  font-size: 2.25rem;
  font-weight: 700;
  line-height: 1.35;
  margin: 0 0 14px 0;
  color: #f8fafc;
}

.gold-gradient {
  color: #f59e0b;
}

.hero-subtitle {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #94a3b8;
  margin-bottom: 28px;
}

/* Image Showcase Card */
.image-showcase-card {
  position: relative;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid #1e293b;
  box-shadow: 0 20px 30px -10px rgba(0, 0, 0, 0.5);
  aspect-ratio: 16/10;
  background: #1e293b;
}

.hero-building-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.image-overlay-badge {
  position: absolute;
  bottom: 14px;
  left: 14px;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid #334155;
  border-radius: 6px;
  padding: 6px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.78rem;
  color: #cbd5e1;
  font-weight: 500;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
}

/* Right Auth Form Panel */
.auth-form-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  background: #0b0f17;
}

.glass-auth-card {
  width: 100%;
  max-width: 440px;
  background: #111827;
  border: 1px solid #1f2937;
  border-radius: 16px;
  padding: 36px 32px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
}

.brand-header {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 24px;
}

.brand-logo {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: #f59e0b;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0f172a;
  flex-shrink: 0;
}

.brand-logo svg {
  width: 24px;
  height: 24px;
}

.portal-eyebrow {
  display: block;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #f59e0b;
  text-transform: uppercase;
  margin-bottom: 2px;
}

.auth-title {
  font-family: 'Kantumruy Pro', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #f8fafc;
  margin: 0 0 4px 0;
}

.auth-desc {
  font-size: 0.875rem;
  color: #94a3b8;
  margin: 0;
  line-height: 1.45;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #cbd5e1;
}

.forgot-link {
  font-size: 0.825rem;
  color: #f59e0b;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.15s ease;
}

.forgot-link:hover {
  color: #fbbf24;
  text-decoration: underline;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 14px;
  width: 18px;
  height: 18px;
  color: #64748b;
  pointer-events: none;
  transition: color 0.15s ease;
}

input {
  width: 100%;
  background: #1f2937;
  border: 1px solid #374151;
  border-radius: 10px;
  padding: 12px 14px 12px 42px;
  color: #f8fafc;
  font-size: 0.95rem;
  font-family: 'Kantumruy Pro', 'Inter', sans-serif;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

input:focus {
  border-color: #f59e0b;
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.15);
}

input:focus + .input-icon,
.input-wrapper:focus-within .input-icon {
  color: #f59e0b;
}

.password-toggle {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: color 0.15s ease;
}

.password-toggle:hover {
  color: #94a3b8;
}

.password-toggle svg {
  width: 18px;
  height: 18px;
}

.alert-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 10px;
  font-size: 0.86rem;
  font-weight: 500;
}

.alert-banner svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.error-alert {
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.25);
  color: #fca5a5;
}

.success-alert {
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.25);
  color: #6ee7b7;
}

.submit-btn {
  width: 100%;
  background: #f59e0b;
  border: none;
  border-radius: 10px;
  padding: 12px 16px;
  color: #0f172a;
  font-size: 0.95rem;
  font-weight: 700;
  font-family: 'Kantumruy Pro', sans-serif;
  cursor: pointer;
  transition: all 0.15s ease;
  margin-top: 4px;
}

.submit-btn:hover:not(:disabled) {
  background: #d97706;
}

.submit-btn:disabled {
  opacity: 0.75;
  cursor: not-allowed;
}

.btn-spinner-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.spinner-icon {
  width: 18px;
  height: 18px;
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.auth-footer-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 0.88rem;
  color: #94a3b8;
  margin-top: 8px;
}

.register-link {
  color: #fbbf24;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s ease;
}

.register-link:hover {
  color: #fef08a;
  text-decoration: underline;
}

/* Responsive Breakpoints */
@media (max-width: 960px) {
  .hero-showcase-panel {
    display: none;
  }
  
  .auth-form-panel {
    padding: 24px 16px;
  }
  
  .glass-auth-card {
    padding: 28px 20px;
  }
}
</style>
