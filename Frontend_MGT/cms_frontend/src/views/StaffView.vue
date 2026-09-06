<template>
  <div class="module-root">
    <!-- Header -->
    <header class="module-header">
      <div class="header-left">
        <div class="breadcrumb-trail">
          <span class="trail-item">MGM Workspace</span>
          <span class="trail-sep">/</span>
          <span class="trail-active">Staff Management</span>
        </div>
        <h1 class="module-title">Workforce & Team Roster</h1>
        <p class="module-subtitle">Oversee site personnel, engineering roles, contact details, and active payroll allocations.</p>
      </div>

      <div class="header-right">
        <button type="button" @click="loadStaff" class="btn-secondary-custom" :disabled="loading">
          <svg class="refresh-icon" :class="{ spinning: loading }" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M23 4v6h-6"/>
            <path d="M1 20v-6h6"/>
            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10"/>
            <path d="M20.49 15a9 9 0 01-14.85 3.36L1 14"/>
          </svg>
          <span>Refresh</span>
        </button>

        <button type="button" @click="openCreateModal" class="btn-primary-custom">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>Add Staff Member</span>
        </button>
      </div>
    </header>

    <!-- Top KPI Summary Cards -->
    <section class="kpi-summary-grid">
      <div class="kpi-card">
        <div class="kpi-icon bg-purple"><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg></div>
        <div>
          <div class="kpi-num">{{ items.length }}</div>
          <div class="kpi-label">Total Workforce</div>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-icon bg-blue"><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2H10a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg></div>
        <div>
          <div class="kpi-num">{{ mgmtCount }}</div>
          <div class="kpi-label">Project Management</div>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-icon bg-emerald"><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg></div>
        <div>
          <div class="kpi-num">{{ engineerCount }}</div>
          <div class="kpi-label">Site Engineers</div>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-icon bg-amber"><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg></div>
        <div>
          <div class="kpi-num">{{ opsCount }}</div>
          <div class="kpi-label">Site Operators</div>
        </div>
      </div>
    </section>

    <!-- Filter & Search Toolbar -->
    <div class="toolbar-box">
      <div class="search-input-wrap">
        <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          class="search-field"
          placeholder=""
        />
      </div>

      <div class="filter-pills">
        <button
          v-for="dept in ['All', 'Management', 'Engineering', 'Operations', 'Finance', 'Safety']"
          :key="dept"
          class="filter-pill"
          :class="{ active: currentFilter === dept }"
          @click="currentFilter = dept"
        >
          {{ dept }}
        </button>
      </div>
    </div>

    <!-- Main Content Box -->
    <div class="content-box">
      <!-- Loading State -->
      <div v-if="loading" class="state-box">
        <div class="spinner"></div>
        <p>Loading staff directory...</p>
      </div>

      <!-- Data Table -->
      <div v-else-if="filteredItems.length > 0" class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Role & Designation</th>
              <th>Department</th>
              <th>Email Address</th>
              <th>Phone Number</th>
              <th>Monthly Salary</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredItems" :key="item.id" class="table-row">
              <td>
                <div class="name-cell">
                  <img
                    v-if="item.image && !failedImages[item.id]"
                    :src="item.image"
                    :alt="item.name"
                    class="staff-avatar-img"
                    @error="failedImages[item.id] = true"
                  />
                  <div v-else class="staff-avatar" :style="getAvatarStyle(item.name)">
                    {{ getInitials(item.name) }}
                  </div>
                  <div>
                    <div class="staff-name">{{ item.name }}</div>
                    <div class="staff-id">EMP #{{ String(item.id).padStart(4, '0') }}</div>
                  </div>
                </div>
              </td>
              <td>
                <span class="role-badge" :class="getRoleClass(item.role)">
                  {{ item.role || 'Team Member' }}
                </span>
              </td>
              <td>
                <span class="dept-tag">{{ item.department || 'General' }}</span>
              </td>
              <td>
                <a v-if="item.email" :href="'mailto:' + item.email" class="email-link">
                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="me-1 align-text-bottom"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg> {{ item.email }}
                </a>
                <span v-else class="text-muted">—</span>
              </td>
              <td>
                <span class="phone-text"><svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="me-1 align-text-bottom"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg> {{ item.phone || 'N/A' }}</span>
              </td>
              <td>
                <strong class="salary-val">{{ formatCurrency(item.salary) }}</strong>
              </td>
              <td class="text-right">
                <div class="actions-group">
                  <button @click="editItem(item)" class="btn-action edit" title="Edit Staff"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="me-1"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>Edit</button>
                  <button @click="deleteItem(item.id)" class="btn-action delete" title="Delete Staff"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="me-1"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/></svg>Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-icon"><svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg></div>
        <h3>No Staff Members Found</h3>
        <p>No personnel match your search or department filter.</p>
        <button @click="openCreateModal" class="btn-primary-custom">+ Add Staff Member</button>
      </div>
    </div>

    <!-- Modal Form -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showAddForm" class="modal-backdrop staff-style-modal" @click.self="resetForm">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">{{ editingId ? 'Edit Staff Profile' : 'Add Staff Member' }}</h5>
                <button type="button" class="btn-close-white d-flex align-items-center justify-content-center" @click="resetForm"><svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>

              <form @submit.prevent="saveItem">
                <div class="modal-body">
                  <!-- Profile Image Picker Section -->
                  <div class="image-upload-container mb-3">
                    <label class="form-label">Profile Photo / Avatar</label>
                    <div class="image-upload-row">
                      <div class="avatar-preview-box">
                        <img v-if="form.image" :src="form.image" alt="Preview" class="preview-img" @error="form.image = ''" />
                        <div v-else class="preview-placeholder" :style="getAvatarStyle(form.name || 'Staff')">
                          {{ getInitials(form.name || 'Staff Member') }}
                        </div>
                      </div>
                      <div class="image-inputs-flex">
                        <div class="file-upload-btn-wrap">
                          <label class="btn-upload-local">
                            <span class="d-inline-flex align-items-center"><svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="me-1"><path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg> Upload Local Image</span>
                            <input type="file" accept="image/*" @change="onFileSelected" hidden />
                          </label>
                          <button type="button" v-if="form.image" class="btn-remove-photo" @click="form.image = ''">
                            Remove Photo
                          </button>
                        </div>
                        <input
                          v-model="form.image"
                          type="text"
                          class="form-control mt-2"
                          placeholder="Or paste image URL (https://...)"
                        />
                      </div>
                    </div>

                    <!-- Preset Sample Avatars -->
                    <div class="presets-section mt-2">
                      <span class="preset-label">Quick Presets:</span>
                      <div class="preset-items">
                        <button
                          type="button"
                          v-for="(url, idx) in presetAvatars"
                          :key="idx"
                          class="preset-avatar-btn"
                          :class="{ selected: form.image === url }"
                          @click="form.image = url"
                        >
                          <img :src="url" alt="Avatar preset" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div class="form-group mb-3">
                    <label class="form-label">Full Name *</label>
                    <input v-model="form.name" type="text" class="form-control" placeholder="e.g. Sokha Chan" required />
                  </div>

                  <div class="form-row mb-3">
                    <div class="col">
                      <label class="form-label">Role Designation *</label>
                      <input v-model="form.role" type="text" class="form-control" placeholder="e.g. Senior Site Engineer" required />
                    </div>

                    <div class="col">
                      <label class="form-label">Department</label>
                      <select v-model="form.department" class="form-control">
                        <option value="Management">Management</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Operations">Operations</option>
                        <option value="Finance">Finance</option>
                        <option value="Safety">Safety</option>
                      </select>
                    </div>
                  </div>

                  <div class="form-row mb-3">
                    <div class="col">
                      <label class="form-label">Email Address *</label>
                      <input v-model="form.email" type="email" class="form-control" placeholder="sokha.chan@cms.kh" required />
                    </div>

                    <div class="col">
                      <label class="form-label">Phone Number *</label>
                      <input v-model="form.phone" type="text" class="form-control" placeholder="012 888 901" required />
                    </div>
                  </div>

                  <div class="form-row mb-3">
                    <div class="col">
                      <label class="form-label">Monthly Salary (USD) *</label>
                      <input v-model.number="form.salary" type="number" step="any" min="0" class="form-control" placeholder="1500" required />
                    </div>

                    <div class="col">
                      <label class="form-label">Employment Status</label>
                      <select v-model="form.status" class="form-control">
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="On Leave">On Leave</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div class="modal-footer">
                  <button type="button" class="btn-cancel" @click="resetForm">Cancel</button>
                  <button type="submit" class="btn-save" :disabled="saving">
                    {{ saving ? 'Saving...' : 'Save Member' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { staffApi } from '../services/api'

const items = ref([])
const loading = ref(false)
const saving = ref(false)
const showAddForm = ref(false)
const editingId = ref(null)
const searchQuery = ref('')
const currentFilter = ref('All')
const failedImages = ref({})

const initialFormState = () => ({
  name: '',
  role: '',
  email: '',
  phone: '',
  salary: 0,
  department: 'Engineering',
  status: 'Active',
  image: ''
})

const form = ref(initialFormState())

const mgmtCount = computed(() => items.value.filter(i => (i.role || '').toLowerCase().includes('manager') || (i.department || '').toLowerCase() === 'management').length)
const engineerCount = computed(() => items.value.filter(i => (i.role || '').toLowerCase().includes('engineer') || (i.department || '').toLowerCase() === 'engineering').length)
const opsCount = computed(() => items.value.filter(i => (i.role || '').toLowerCase().includes('operator') || (i.department || '').toLowerCase() === 'operations').length)

const filteredItems = computed(() => {
  return items.value.filter(item => {
    const matchesFilter = currentFilter.value === 'All' ||
      (item.department || '').toLowerCase() === currentFilter.value.toLowerCase() ||
      (currentFilter.value === 'Management' && (item.role || '').toLowerCase().includes('manager'))
    const query = searchQuery.value.toLowerCase()
    const matchesSearch = !query ||
      (item.name || '').toLowerCase().includes(query) ||
      (item.role || '').toLowerCase().includes(query) ||
      (item.email || '').toLowerCase().includes(query)
    return matchesFilter && matchesSearch
  })
})

const loadStaff = async () => {
  loading.value = true
  try {
    const res = await staffApi.getAll()
    if (Array.isArray(res?.data)) {
      items.value = res.data
    }
  } catch (err) {
    console.error('Failed to load staff:', err)
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  editingId.value = null
  form.value = initialFormState()
  showAddForm.value = true
}

const editItem = (item) => {
  editingId.value = item.id
  form.value = {
    name: item.name || '',
    role: item.role || '',
    email: item.email || '',
    phone: item.phone || '',
    salary: Number(item.salary) || 0,
    department: item.department || 'Engineering',
    status: item.status || 'Active',
    image: item.image || ''
  }
  showAddForm.value = true
}

const saveItem = async () => {
  saving.value = true
  try {
    const payload = { ...form.value }
    if (editingId.value) {
      await staffApi.update(editingId.value, payload)
    } else {
      await staffApi.create(payload)
    }
    resetForm()
    await loadStaff()
  } catch (err) {
    console.error('Failed to save staff record:', err)
    alert('Failed to save staff record.')
  } finally {
    saving.value = false
  }
}

const deleteItem = async (id) => {
  if (!confirm('Are you sure you want to delete this staff member?')) return
  try {
    await staffApi.delete(id)
    await loadStaff()
  } catch (err) {
    console.error('Failed to delete staff:', err)
    alert('Failed to delete staff.')
  }
}

const onFileSelected = (event) => {
  const file = event.target.files[0]
  if (!file) return
  if (file.size > 5 * 1024 * 1024) {
    alert('Image size exceeds 5MB limit.')
    return
  }
  const reader = new FileReader()
  reader.onload = (e) => {
    form.value.image = e.target.result
  }
  reader.readAsDataURL(file)
}

const resetForm = () => {
  showAddForm.value = false
  editingId.value = null
  form.value = initialFormState()
}

const getInitials = (name = '') => {
  return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().substring(0, 2) || 'ST'
}

const formatCurrency = (val) => {
  const num = Number(val)
  if (isNaN(num)) return '$0'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num)
}

const getRoleClass = (role = '') => {
  const r = role.toLowerCase()
  if (r.includes('manager')) return 'role-mgmt'
  if (r.includes('engineer')) return 'role-eng'
  if (r.includes('accountant') || r.includes('finance')) return 'role-fin'
  if (r.includes('operator')) return 'role-ops'
  return 'role-default'
}

const getAvatarStyle = (name = '') => {
  const colors = [
    { background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', color: '#fff' },
    { background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#fff' },
    { background: 'linear-gradient(135deg, #10b981, #047857)', color: '#fff' },
    { background: 'linear-gradient(135deg, #f59e0b, #b45309)', color: '#fff' }
  ]
  return colors[name.length % colors.length]
}

onMounted(loadStaff)
</script>

<style scoped>
.module-root { width: 100%; max-width: 1600px; margin: 0 auto; padding: 16px 20px 48px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #0f172a; }
.module-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; gap: 16px; flex-wrap: wrap; }
.breadcrumb-trail { display: flex; gap: 8px; font-size: 13px; color: #64748b; margin-bottom: 4px; }
.trail-active { color: #2563eb; font-weight: 600; }
.module-title { font-size: 26px; font-weight: 800; margin: 0; color: #0f172a; }
.module-subtitle { font-size: 13.5px; color: #64748b; margin: 4px 0 0; }
.header-right { display: flex; gap: 10px; }

.btn-secondary-custom { display: inline-flex; align-items: center; gap: 8px; padding: 9px 15px; background: #fff; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 13px; font-weight: 600; color: #334155; cursor: pointer; }
.btn-primary-custom { display: inline-flex; align-items: center; gap: 8px; padding: 9px 18px; background: linear-gradient(135deg, #2563eb, #1d4ed8); border: none; border-radius: 10px; font-size: 13px; font-weight: 600; color: #fff; cursor: pointer; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25); }

.kpi-summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 20px; }
.kpi-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 16px 18px; display: flex; align-items: center; gap: 14px; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
.kpi-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
.bg-purple { background: #ede9fe; } .bg-blue { background: #dbeafe; } .bg-emerald { background: #d1fae5; } .bg-amber { background: #fef3c7; }
.kpi-num { font-size: 22px; font-weight: 800; color: #0f172a; line-height: 1.1; }
.kpi-label { font-size: 12px; color: #64748b; margin-top: 2px; }

.toolbar-box { display: flex; justify-content: space-between; align-items: center; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 10px 16px; margin-bottom: 20px; gap: 16px; flex-wrap: wrap; }
.search-input-wrap { display: flex; align-items: center; gap: 8px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 7px 12px; flex-grow: 1; max-width: 400px; }
.search-icon { color: #94a3b8; }
.search-field { border: none; background: transparent; font-size: 13px; outline: none; width: 100%; }

.filter-pills { display: flex; gap: 4px; background: #f1f5f9; padding: 3px; border-radius: 8px; }
.filter-pill { border: none; background: transparent; padding: 5px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; color: #64748b; cursor: pointer; }
.filter-pill.active { background: #fff; color: #0f172a; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }

.content-box { background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
.table-responsive { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.data-table th { text-align: left; padding: 12px 14px; color: #64748b; font-size: 11.5px; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; background: #f8fafc; }
.data-table td { padding: 14px 14px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }

.name-cell { display: flex; align-items: center; gap: 12px; }
.staff-avatar-img { width: 38px; height: 38px; border-radius: 10px; object-fit: cover; border: 1px solid #e2e8f0; flex-shrink: 0; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
.staff-avatar { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 13px; flex-shrink: 0; }
.staff-name { font-weight: 700; color: #0f172a; }
.staff-id { font-size: 11px; color: #94a3b8; }

.role-badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 11.5px; font-weight: 600; }
.role-mgmt { background: #ede9fe; color: #6d28d9; }
.role-eng { background: #dbeafe; color: #1d4ed8; }
.role-fin { background: #d1fae5; color: #047857; }
.role-ops { background: #fef3c7; color: #b45309; }
.role-default { background: #f1f5f9; color: #475569; }

.dept-tag { background: #f1f5f9; color: #334155; padding: 3px 8px; border-radius: 6px; font-size: 12px; font-weight: 500; }
.email-link { color: #2563eb; text-decoration: none; font-weight: 500; }
.email-link:hover { text-decoration: underline; }
.phone-text { color: #475569; font-weight: 500; }
.salary-val { color: #0f172a; font-weight: 700; }

.actions-group { display: flex; gap: 6px; justify-content: flex-end; }
.btn-action { border: 1px solid #e2e8f0; background: #fff; padding: 4px 9px; border-radius: 6px; font-size: 11.5px; font-weight: 600; cursor: pointer; }
.btn-action.edit:hover { background: #eff6ff; color: #2563eb; border-color: #bfdbfe; }
.btn-action.delete:hover { background: #fff1f2; color: #e11d48; border-color: #fecdd3; }
.text-right { text-align: right; }

.modal-backdrop { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(4px); z-index: 1050; display: flex; align-items: center; justify-content: center; }
.modal-dialog { width: min(100% - 2rem, 540px); }
.modal-content { background: #1e293b; color: #f8fafc; border-radius: 14px; border: 1px solid rgba(255,255,255,0.1); padding: 20px; }
.modal-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 12px; margin-bottom: 16px; }
.modal-title { font-size: 17px; font-weight: 700; color: #fff; margin: 0; }
.btn-close-white { background: transparent; border: none; color: #94a3b8; font-size: 18px; cursor: pointer; }

/* Image upload styles */
.image-upload-container { background: rgba(15, 23, 42, 0.6); padding: 14px; border-radius: 10px; border: 1px dashed #334155; }
.image-upload-row { display: flex; gap: 14px; align-items: center; }
.avatar-preview-box { width: 64px; height: 64px; border-radius: 12px; overflow: hidden; flex-shrink: 0; background: #0f172a; border: 2px solid #3b82f6; display: flex; align-items: center; justify-content: center; }
.preview-img { width: 100%; height: 100%; object-fit: cover; }
.preview-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 18px; }
.image-inputs-flex { flex-grow: 1; display: flex; flex-direction: column; }
.file-upload-btn-wrap { display: flex; gap: 8px; align-items: center; }
.btn-upload-local { background: #3b82f6; color: #fff; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; display: inline-block; }
.btn-upload-local:hover { background: #2563eb; }
.btn-remove-photo { background: rgba(225, 29, 72, 0.2); border: 1px solid #e11d48; color: #f43f5e; padding: 5px 10px; border-radius: 6px; font-size: 12px; cursor: pointer; }

.presets-section { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-top: 10px; }
.preset-label { font-size: 11.5px; color: #94a3b8; }
.preset-items { display: flex; gap: 6px; }
.preset-avatar-btn { width: 28px; height: 28px; border-radius: 50%; padding: 0; border: 2px solid transparent; overflow: hidden; cursor: pointer; background: transparent; }
.preset-avatar-btn.selected { border-color: #3b82f6; transform: scale(1.1); }
.preset-avatar-btn img { width: 100%; height: 100%; object-fit: cover; }

.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-row { display: flex; gap: 12px; }
.form-row .col { flex: 1; display: flex; flex-direction: column; gap: 6px; }
.form-label { font-size: 12px; font-weight: 600; color: #cbd5e1; }
.form-control { background: #0f172a; border: 1px solid #334155; color: #fff; padding: 9px 12px; border-radius: 8px; font-size: 13px; outline: none; }
.form-control:focus { border-color: #3b82f6; }
.modal-footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 18px; padding-top: 14px; border-top: 1px solid rgba(255,255,255,0.1); }
.btn-cancel { background: transparent; border: 1px solid #475569; color: #cbd5e1; padding: 8px 16px; border-radius: 8px; font-size: 13px; cursor: pointer; }
.btn-save { background: #2563eb; border: none; color: #fff; padding: 8px 18px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; }

.state-box, .empty-state { text-align: center; padding: 40px; color: #64748b; }
.spinner { width: 24px; height: 24px; border: 3px solid #e2e8f0; border-top-color: #2563eb; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 10px; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
</style>