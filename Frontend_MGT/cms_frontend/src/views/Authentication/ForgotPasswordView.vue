<template>
  <div class="auth-page-wrapper">
    <div class="split-auth-container">
      <!-- Left Hero Panel: Khmer Title & Skyscraper Image -->
      <div class="hero-showcase-panel">
        <div class="hero-content">
          <div class="hero-brand-tag">
            <svg class="badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
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

          <!-- Featured Construction Image Showcase Card with Floating Badges -->
          <div class="image-showcase-card">
            <img src="../../assets/modern_construction_hero.jpg" alt="Modern Skyscraper Construction" class="hero-building-img" />
            
            <div class="image-overlay-badge">
              <span class="pulse-dot"></span>
              <span>ការកំណត់ពាក្យសម្ងាត់ឡើងវិញ (Account Recovery)</span>
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
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <div>
              <span class="portal-eyebrow">CONSTRUCTION MANAGEMENT SYSTEM</span>
              <h2 class="auth-title">ភ្លេចពាក្យសម្ងាត់</h2>
              <p class="auth-desc">សូមបញ្ចូលអ៊ីមែលរបស់អ្នកដើម្បីទទួលបានតំណភ្ជាប់កំណត់ពាក្យសម្ងាត់ឡើងវិញ</p>
            </div>
          </div>

          <form @submit.prevent="handleSubmit" class="auth-form">
            <div class="form-group">
              <label for="recovery-email">អាសយដ្ឋានអ៊ីមែល (Email)</label>
              <div class="input-wrapper">
                <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <input
                  id="recovery-email"
                  v-model="email"
                  type="email"
                  placeholder="បញ្ចូលអ៊ីមែលដែលបានចុះឈ្មោះ"
                  required
                />
              </div>
            </div>

            <!-- Message Alert Banner -->
            <div v-if="message" :class="['alert-banner', messageType === 'error' ? 'error-alert' : 'success-alert']">
              <svg v-if="messageType === 'error'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <span>{{ message }}</span>
            </div>

            <!-- Dev Mode Direct Reset Link Box -->
            <div v-if="resetUrl" class="dev-reset-box">
              <div class="dev-reset-header">
                <span class="dev-tag">DEV MODE</span>
                <span>តំណកំណត់ពាក្យសម្ងាត់ឡើងវិញ៖</span>
              </div>
              <a :href="resetUrl" class="dev-reset-link">បើកទំព័រកំណត់ពាក្យសម្ងាត់ →</a>
            </div>

            <button type="submit" class="submit-btn" :disabled="isSubmitting">
              <span v-if="!isSubmitting">ផ្ញើតំណកំណត់ពាក្យសម្ងាត់</span>
              <span v-else class="btn-spinner-row">
                <svg class="spinner-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="10"/>
                </svg>
                កំពុងដំណើរការ...
              </span>
            </button>

            <div class="auth-footer-row">
              <router-link to="/login" class="login-link">← ត្រឡប់ទៅទំព័រចូលប្រើប្រព័ន្ធ</router-link>
            </div>
          </form>
        </div>
      </div>
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
    message.value = 'សូមបញ្ចូលអាសយដ្ឋានអ៊ីមែលត្រឹមត្រូវ។'
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
    message.value = error.response?.data?.message || 'មិនអាចដំណើរការបានទេ។'
    messageType.value = 'error'
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

label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #cbd5e1;
}

.input-wrapper {
  position: relative;
  display: flex;
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
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.25);
}

.submit-btn:disabled {
  opacity: 0.7;
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
  font-size: 0.88rem;
  margin-top: 8px;
}

.login-link {
  color: #fbbf24;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s ease;
}

.login-link:hover {
  color: #fef08a;
  text-decoration: underline;
}

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
