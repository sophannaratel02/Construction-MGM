<template>
  <div class="staff-view-container p-3 p-lg-4">
    <!-- View Header -->
    <div class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
      <div>
        <h2 class="page-title mb-1">Staff Management</h2>
        <p class="page-subtitle mb-0">Oversee team members, roles, compensation, and active directory records</p>
      </div>
      <button @click="openCreateModal" class="btn btn-primary-custom d-flex align-items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        <span>Add Staff Member</span>
      </button>
    </div>

    <!-- Main Table Card -->
    <div class="card content-card border-0 shadow-sm">
      <div class="card-header border-bottom-0 d-flex justify-content-between align-items-center p-3 px-4">
        <h5 class="card-header-title mb-0">Team Roster</h5>
        <span class="badge count-badge">{{ items.length }} Members</span>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="card-body text-center py-5">
        <div class="spinner-border text-primary spinner-border-sm me-2" role="status"></div>
        <span class="text-muted-custom">Loading staff directory...</span>
      </div>

      <!-- Data Table -->
      <div v-else-if="items.length" class="table-responsive">
        <table class="table align-middle mb-0">
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Role</th>
              <th>Email Address</th>
              <th>Salary (USD)</th>
              <th class="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.id">
              <td>
                <div class="d-flex align-items-center gap-3">
                  <div class="staff-avatar d-flex align-items-center justify-content-center">
                    {{ getInitials(item.name) }}
                  </div>
                  <span class="fw-semibold text-light">{{ item.name }}</span>
                </div>
              </td>
              <td>
                <span :class="['badge-role', getRoleClass(item.role)]">
                  {{ item.role || 'Team Member' }}
                </span>
              </td>
              <td class="text-muted-custom">
                <a v-if="item.email" :href="'mailto:' + item.email" class="text-decoration-none email-link">
                  {{ item.email }}
                </a>
                <span v-else class="text-muted-dim">—</span>
              </td>
              <td class="fw-medium text-light">
                {{ formatCurrency(item.salary) }}
              </td>
              <td class="text-end">
                <div class="d-inline-flex gap-2">
                  <button @click="editItem(item)" class="btn-action-sm btn-action-edit" title="Edit Staff Member">
                    Edit
                  </button>
                  <button @click="deleteItem(item.id)" class="btn-action-sm btn-action-delete" title="Delete Staff Member">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state py-5 text-center">
        <div class="empty-state-icon mb-3">👥</div>
        <h6 class="text-light fw-semibold">No staff records found</h6>
        <p class="empty-state-text mb-3">Add employees to manage roles, contact information, and payroll details.</p>
        <button @click="openCreateModal" class="btn btn-outline-custom btn-sm">
          + Add First Member
        </button>
      </div>
    </div>

    <!-- Modal Overlay -->
    <div v-if="showAddForm" class="custom-modal-backdrop d-flex align-items-center justify-content-center">
      <div class="custom-modal-dialog w-100 max-w-lg">
        <div class="modal-content-custom">
          <div class="modal-header-custom d-flex align-items-center justify-content-between p-4">
            <h5 class="modal-title mb-0">{{ editingId ? 'Edit Staff Profile' : 'Add Staff Member' }}</h5>
            <button type="button" class="btn-close-custom" @click="resetForm">✕</button>
          </div>
          
          <form @submit.prevent="saveItem">
            <div class="modal-body-custom p-4 d-flex flex-column gap-3">
              <div>
                <label class="form-label-custom">Full Name *</label>
                <input v-model="form.name" type="text" class="form-input-custom" placeholder="e.g. Jane Doe" required />
              </div>

              <div class="row g-3">
                <div class="col-6">
                  <label class="form-label-custom">Role / Position *</label>
                  <select v-model="form.role" class="form-input-custom form-select-custom" required>
                    <option value="Manager">Manager</option>
                    <option value="Developer">Developer</option>
                    <option value="Designer">Designer</option>
                    <option value="Site Engineer">Site Engineer</option>
                    <option value="Accountant">Accountant</option>
                    <option value="General Staff">General Staff</option>
                  </select>
                </div>

                <div class="col-6">
                  <label class="form-label-custom">Annual Salary ($)</label>
                  <input v-model.number="form.salary" type="number" step="0.01" min="0" class="form-input-custom" placeholder="e.g. 65000" />
                </div>
              </div>

              <div>
                <label class="form-label-custom">Email Address *</label>
                <input v-model="form.email" type="email" class="form-input-custom" placeholder="jane.doe@company.com" required />
              </div>
            </div>

            <div class="modal-footer-custom p-4 d-flex justify-content-end gap-2">
              <button type="button" class="btn btn-outline-custom" @click="resetForm">Cancel</button>
              <button type="submit" class="btn btn-primary-custom" :disabled="submitting">
                <span v-if="submitting" class="spinner-border spinner-border-sm me-1"></span>
                {{ editingId ? 'Update Profile' : 'Save Member' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { staffApi } from '../services/api'

const items = ref([])
const loading = ref(false)
const submitting = ref(false)
const showAddForm = ref(false)
const editingId = ref(null)

const defaultForm = () => ({
  name: '',
  role: 'General Staff',
  email: '',
  salary: null
})

const form = ref(defaultForm())

const load = async () => {
  loading.value = true
  try {
    const response = await staffApi.getAll()
    items.value = response.data || []
  } catch (error) {
    console.error('Failed to load staff list:', error)
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  editingId.value = null
  form.value = defaultForm()
  showAddForm.value = true
}

const editItem = (item) => {
  editingId.value = item.id
  form.value = JSON.parse(JSON.stringify(item))
  showAddForm.value = true
}

const saveItem = async () => {
  if (submitting.value) return
  submitting.value = true
  
  try {
    if (editingId.value) {
      await staffApi.update(editingId.value, form.value)
    } else {
      await staffApi.create(form.value)
    }
    
    // Explicitly hide modal and clear form state before reloading directory
    showAddForm.value = false
    resetForm()
    await load()
  } catch (error) {
    console.error('Failed to save staff record:', error)
    alert('An error occurred while saving. Please try again.')
  } finally {
    submitting.value = false
  }
}

const deleteItem = async (id) => {
  if (confirm('Are you sure you want to remove this staff member?')) {
    try {
      await staffApi.delete(id)
      await load()
    } catch (error) {
      console.error('Failed to delete staff record:', error)
    }
  }
}

const resetForm = () => {
  editingId.value = null
  showAddForm.value = false
  form.value = defaultForm()
}

// Visual Helpers
const getInitials = (name) => {
  if (!name) return 'S'
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()
}

const formatCurrency = (val) => {
  if (val === null || val === undefined || val === '') return '—'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val)
}

const getRoleClass = (role) => {
  switch (role?.toLowerCase()) {
    case 'manager': return 'badge-manager'
    case 'developer': return 'badge-tech'
    case 'designer': return 'badge-design'
    case 'site engineer': return 'badge-engineering'
    case 'accountant': return 'badge-finance'
    default: return 'badge-default'
  }
}

onMounted(load)
</script>

<style scoped>
.staff-view-container {
  --view-bg: #0f172a;
  --card-bg: #1e293b;
  --card-border: rgba(255, 255, 255, 0.08);
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  --accent-blue: #3b82f6;
  --input-bg: rgba(15, 23, 42, 0.6);

  min-height: 100vh;
  color: var(--text-main);
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-main);
}

.page-subtitle {
  font-size: 0.875rem;
  color: var(--text-muted);
}

/* Card Container */
.content-card {
  background-color: var(--card-bg);
  border: 1px solid var(--card-border) !important;
  border-radius: 12px;
  overflow: hidden;
}

.card-header-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-main);
}

.count-badge {
  background-color: rgba(59, 130, 246, 0.15);
  color: var(--accent-blue);
  border: 1px solid rgba(59, 130, 246, 0.2);
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 6px;
}

/* Table Styling */
.table {
  --bs-table-bg: transparent;
  --bs-table-color: var(--text-main);
  margin-bottom: 0;
}

.table th {
  background-color: rgba(15, 23, 42, 0.4);
  color: var(--text-muted);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
  padding: 12px 20px;
  border-bottom: 1px solid var(--card-border);
}

.table td {
  padding: 14px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  font-size: 0.88rem;
}

.table tbody tr:hover {
  background-color: rgba(255, 255, 255, 0.02);
}

.text-muted-custom { color: var(--text-muted); }
.text-muted-dim { color: rgba(148, 163, 184, 0.4); }

.email-link {
  color: #60a5fa;
  transition: color 0.2s ease;
}

.email-link:hover {
  color: #93c5fd;
  text-decoration: underline !important;
}

.staff-avatar {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(59, 130, 246, 0.15);
  color: var(--accent-blue);
  border: 1px solid rgba(59, 130, 246, 0.3);
  font-size: 0.75rem;
  font-weight: 700;
  flex-shrink: 0;
}

/* Role Badges */
.badge-role {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-block;
}

.badge-manager { background: rgba(168, 85, 247, 0.15); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.2); }
.badge-tech { background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.2); }
.badge-design { background: rgba(236, 72, 153, 0.15); color: #f472b6; border: 1px solid rgba(236, 72, 153, 0.2); }
.badge-engineering { background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.2); }
.badge-finance { background: rgba(34, 197, 94, 0.15); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.2); }
.badge-default { background: rgba(148, 163, 184, 0.15); color: #cbd5e1; border: 1px solid rgba(148, 163, 184, 0.2); }

/* Buttons */
.btn-primary-custom {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border: none;
  color: white;
  font-weight: 500;
  font-size: 0.875rem;
  padding: 8px 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.25);
  transition: all 0.2s ease;
}

.btn-primary-custom:hover {
  opacity: 0.95;
  transform: translateY(-1px);
}

.btn-outline-custom {
  background: transparent;
  border: 1px solid var(--card-border);
  color: var(--text-muted);
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.btn-outline-custom:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-main);
}

.btn-action-sm {
  border: none;
  background: transparent;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.btn-action-edit { color: #60a5fa; }
.btn-action-edit:hover { background: rgba(59, 130, 246, 0.15); }

.btn-action-delete { color: #f87171; }
.btn-action-delete:hover { background: rgba(239, 68, 68, 0.15); }

/* Custom Modal */
.custom-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(6px);
  z-index: 1050;
  padding: 1rem;
}

.max-w-lg { max-width: 500px; }

.modal-content-custom {
  background-color: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.modal-header-custom {
  border-bottom: 1px solid var(--card-border);
}

.modal-footer-custom {
  border-top: 1px solid var(--card-border);
  background-color: rgba(15, 23, 42, 0.3);
}

.btn-close-custom {
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 1.1rem;
  cursor: pointer;
}

.btn-close-custom:hover { color: var(--text-main); }

/* Form Controls */
.form-label-custom {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 6px;
}

.form-input-custom {
  width: 100%;
  background-color: var(--input-bg);
  border: 1px solid var(--card-border);
  border-radius: 8px;
  color: var(--text-main);
  padding: 8px 12px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.form-input-custom:focus {
  outline: none;
  border-color: var(--accent-blue);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.form-select-custom {
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%2394a3b8'%3e%3cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 12px 12px;
}

.form-select-custom option {
  background-color: #0f172a;
  color: var(--text-main);
}
</style>