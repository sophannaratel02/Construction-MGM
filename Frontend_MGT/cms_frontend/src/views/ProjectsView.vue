<template>
  <div class="view-container">
    <!-- Header -->
    <div class="view-header">
      <div class="header-title-group">
        <h1 class="page-title">Projects</h1>
        <p class="page-subtitle">Track, manage, and deliver construction projects</p>
      </div>

      <button
        type="button"
        @click="openAddForm"
        class="btn btn-primary primary-btn"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="me-1_5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        New Project
      </button>
    </div>

    <!-- Main Card -->
    <div class="card shadow-sm border-0 main-card">
      <div class="card-header bg-white">
        <div class="d-flex align-items-center gap-2">
          <h5 class="mb-0 fw-semibold text-dark fs-6">Project List</h5>
          <span class="badge bg-light text-secondary border count-badge">
            {{ projects.length }}
          </span>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="state-container py-5">
        <div class="spinner-border text-primary me-2 spinner-border-sm" role="status"></div>
        <span class="text-secondary fw-medium fs-7">Loading project directory...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="errorMessage" class="state-container py-4 px-3">
        <div class="alert alert-danger border-0 shadow-sm d-flex align-items-center mb-3 text-start max-w-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="me-2 flex-shrink-0"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          <div>{{ errorMessage }}</div>
        </div>
        <button
          type="button"
          class="btn btn-sm btn-outline-primary"
          @click="loadProjects"
        >
          Try Again
        </button>
      </div>

      <!-- Projects Table -->
      <div v-else-if="projects.length > 0" class="table-responsive">
        <table class="table align-middle mb-0 custom-table">
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Client</th>
              <th>Status</th>
              <th>Start Date</th>
              <th>Budget</th>
              <th style="min-width: 140px;">Progress</th>
              <th class="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="project in projects" :key="project.id || project._id">
              <!-- Name -->
              <td>
                <span class="fw-semibold text-dark d-block">
                  {{ project.name || '-' }}
                </span>
              </td>

              <!-- Client -->
              <td class="text-secondary fs-7">
                {{ project.client || '-' }}
              </td>

              <!-- Status -->
              <td>
                <span :class="['badge-status', getStatusClass(project.status)]">
                  <span class="status-dot"></span>
                  {{ project.status || 'Unknown' }}
                </span>
              </td>

              <!-- Start Date -->
              <td class="text-secondary fs-7">
                {{ formatDate(project.startDate) }}
              </td>

              <!-- Budget -->
              <td class="fw-semibold text-dark fs-7">
                ${{ formatNumber(project.budget) }}
              </td>

              <!-- Progress -->
              <td>
                <div class="d-flex align-items-center gap-2">
                  <div class="progress flex-grow-1">
                    <div
                      class="progress-bar bg-primary"
                      role="progressbar"
                      :style="{ width: `${getProgress(project.progress)}%` }"
                    ></div>
                  </div>
                  <span class="text-secondary fs-8 fw-semibold font-mono">
                    {{ getProgress(project.progress) }}%
                  </span>
                </div>
              </td>

              <!-- Actions -->
              <td class="text-end">
                <div class="d-inline-flex gap-1">
                  <button
                    type="button"
                    @click="editProject(project)"
                    class="btn-action-icon edit"
                    title="Edit Project"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  </button>
                  <button
                    type="button"
                    @click="deleteProject(project.id || project._id)"
                    class="btn-action-icon delete"
                    title="Delete Project"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state py-5">
        <div class="empty-icon-wrapper mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
        </div>
        <h6 class="fw-semibold text-dark mb-1">No projects found</h6>
        <p class="text-muted fs-7 mb-3 max-w-xs mx-auto">Get started by creating your first construction project directory.</p>
        <button
          type="button"
          class="btn btn-sm btn-primary primary-btn"
          @click="openAddForm"
        >
          Create First Project
        </button>
      </div>
    </div>

    <!-- Modal Form -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div
          v-if="showAddForm"
          class="modal-backdrop-custom"
          @click.self="closeForm"
        >
          <div class="modal-dialog-custom">
            <div class="modal-content-custom">
              <!-- Modal Header -->
              <div class="modal-header-custom">
                <h5 class="modal-title-custom">
                  {{ editingId ? 'Edit Project' : 'Create New Project' }}
                </h5>
                <button
                  type="button"
                  class="btn-close-custom"
                  @click="closeForm"
                  aria-label="Close"
                >
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <!-- Modal Form -->
              <form @submit.prevent="saveProject">
                <div class="modal-body-custom">
                  <!-- Name & Client -->
                  <div class="row g-3 mb-3">
                    <div class="col-md-6">
                      <label class="form-label-custom">
                        Project Name <span class="text-danger-custom">*</span>
                      </label>
                      <input
                        v-model.trim="form.name"
                        type="text"
                        class="form-control-custom"
                        placeholder="e.g. Skyline Tower"
                        required
                      />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label-custom">
                        Client <span class="text-danger-custom">*</span>
                      </label>
                      <input
                        v-model.trim="form.client"
                        type="text"
                        class="form-control-custom"
                        placeholder="e.g. Acme Corp"
                        required
                      />
                    </div>
                  </div>

                  <!-- Status & Progress -->
                  <div class="row g-3 mb-3">
                    <div class="col-md-6">
                      <label class="form-label-custom">Status</label>
                      <select v-model="form.status" class="form-control-custom form-select-custom">
                        <option value="Active">Active</option>
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="On Hold">On Hold</option>
                      </select>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label-custom">Progress (%)</label>
                      <input
                        v-model.number="form.progress"
                        type="number"
                        min="0"
                        max="100"
                        class="form-control-custom"
                        placeholder="0 - 100"
                      />
                    </div>
                  </div>

                  <!-- Dates -->
                  <div class="row g-3 mb-3">
                    <div class="col-md-6">
                      <label class="form-label-custom">
                        Start Date <span class="text-danger-custom">*</span>
                      </label>
                      <input
                        v-model="form.startDate"
                        type="date"
                        class="form-control-custom date-input-custom"
                        required
                      />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label-custom">End Date</label>
                      <input
                        v-model="form.endDate"
                        type="date"
                        class="form-control-custom date-input-custom"
                      />
                    </div>
                  </div>

                  <!-- Budget -->
                  <div class="mb-3">
                    <label class="form-label-custom">
                      Budget <span class="text-danger-custom">*</span>
                    </label>
                    <div class="input-group-custom">
                      <span class="input-prefix-custom">$</span>
                      <input
                        v-model.number="form.budget"
                        type="number"
                        min="0"
                        step="0.01"
                        class="form-control-custom input-has-prefix-custom"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>

                  <!-- Description -->
                  <div>
                    <label class="form-label-custom">Description</label>
                    <textarea
                      v-model.trim="form.description"
                      class="form-control-custom"
                      rows="3"
                      placeholder="Brief details about scope or requirements..."
                    ></textarea>
                  </div>
                </div>

                <!-- Modal Footer -->
                <div class="modal-footer-custom">
                  <button
                    type="button"
                    class="btn-cancel-custom"
                    @click="closeForm"
                    :disabled="saving"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    class="btn-save-custom"
                    :disabled="saving"
                  >
                    <span
                      v-if="saving"
                      class="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>
                    {{ saving ? 'Saving...' : 'Save Project' }}
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
import { ref, onMounted } from 'vue'
import { projectsApi } from '../services/api'

/* State */
const projects = ref([])
const loading = ref(false)
const saving = ref(false)
const showAddForm = ref(false)
const editingId = ref(null)
const errorMessage = ref('')

const emptyForm = () => ({
  name: '',
  client: '',
  status: 'Active',
  startDate: '',
  endDate: '',
  budget: 0,
  progress: 0,
  description: ''
})

const form = ref(emptyForm())

/* Actions */
const loadProjects = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await projectsApi.getAll()
    const data = response?.data

    if (Array.isArray(data)) {
      projects.value = data
    } else if (Array.isArray(data?.data)) {
      projects.value = data.data
    } else if (Array.isArray(data?.projects)) {
      projects.value = data.projects
    } else {
      projects.value = []
    }
  } catch (error) {
    console.error('Failed to load projects:', error)
    errorMessage.value =
      error?.response?.data?.message || 'Failed to load projects. Please try again.'
  } finally {
    loading.value = false
  }
}

const openAddForm = () => {
  editingId.value = null
  form.value = emptyForm()
  showAddForm.value = true
}

const closeForm = () => {
  if (saving.value) return
  showAddForm.value = false
  editingId.value = null
  form.value = emptyForm()
}

const saveProject = async () => {
  if (saving.value) return
  saving.value = true

  try {
    const payload = {
      name: form.value.name,
      client: form.value.client,
      status: form.value.status,
      startDate: form.value.startDate,
      endDate: form.value.endDate || null,
      budget: Number(form.value.budget) || 0,
      progress: Number(form.value.progress) || 0,
      description: form.value.description || ''
    }

    if (editingId.value) {
      await projectsApi.update(editingId.value, payload)
    } else {
      await projectsApi.create(payload)
    }

    // Explicitly hide modal before refreshing list
    showAddForm.value = false
    editingId.value = null
    form.value = emptyForm()

    // Reload directory data
    await loadProjects()
  } catch (error) {
    console.error('Failed to save project:', error)
    alert(error?.response?.data?.message || 'Failed to save project. Please try again.')
  } finally {
    saving.value = false
  }
}

const editProject = (project) => {
  editingId.value = project.id || project._id

  form.value = {
    name: project.name || '',
    client: project.client || '',
    status: project.status || 'Active',
    startDate: formatDateForInput(project.startDate),
    endDate: formatDateForInput(project.endDate),
    budget: Number(project.budget) || 0,
    progress: Number(project.progress) || 0,
    description: project.description || ''
  }

  showAddForm.value = true
}

const deleteProject = async (id) => {
  if (!id) {
    alert('Project ID is missing.')
    return
  }

  if (!confirm('Are you sure you want to delete this project?')) return

  try {
    await projectsApi.delete(id)
    await loadProjects()
  } catch (error) {
    console.error('Failed to delete project:', error)
    alert(error?.response?.data?.message || 'Failed to delete project. Please try again.')
  }
}

/* Helpers */
const getStatusClass = (status) => {
  const classes = {
    Active: 'status-active',
    Pending: 'status-pending',
    Completed: 'status-completed',
    'On Hold': 'status-onhold'
  }
  return classes[status] || 'status-default'
}

const getProgress = (progress) => {
  const value = Number(progress)
  if (Number.isNaN(value)) return 0
  return Math.min(100, Math.max(0, value))
}

const formatDate = (date) => {
  if (!date) return '-'
  const parsedDate = new Date(date)
  if (Number.isNaN(parsedDate.getTime())) return '-'
  return parsedDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const formatDateForInput = (date) => {
  if (!date) return ''
  const parsedDate = new Date(date)
  if (Number.isNaN(parsedDate.getTime())) return ''
  return parsedDate.toISOString().split('T')[0]
}

const formatNumber = (number) => {
  const value = Number(number)
  if (Number.isNaN(value)) return '0'
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })
}

onMounted(() => {
  loadProjects()
})
</script>

<style scoped>
/* Base Setup */
.view-container {
  padding: 0;
  color: #111827;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

/* Utilities */
.fs-7 { font-size: 0.8125rem; }
.fs-8 { font-size: 0.75rem; }
.font-mono { font-family: SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
.max-w-xs { max-width: 20rem; }
.max-w-lg { max-width: 32rem; }

/* Header Styling */
.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1.25rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
  letter-spacing: -0.025em;
}

.page-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0.25rem 0 0 0;
}

/* Buttons */
.primary-btn {
  background-color: #2563eb;
  border-color: #2563eb;
  font-weight: 500;
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.15s ease-in-out;
}

.primary-btn:hover {
  background-color: #1d4ed8;
  border-color: #1d4ed8;
}

.btn-action-icon {
  border: none;
  background: transparent;
  padding: 0.375rem;
  border-radius: 4px;
  color: #6b7280;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.btn-action-icon.edit:hover {
  background-color: #eff6ff;
  color: #2563eb;
}

.btn-action-icon.delete:hover {
  background-color: #fef2f2;
  color: #dc2626;
}

/* Main Card */
.main-card {
  border-radius: 8px;
  border: 1px solid #e5e7eb !important;
  overflow: hidden;
}

.card-header {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #e5e7eb;
}

.count-badge {
  font-weight: 500;
  font-size: 0.75rem;
  padding: 0.15rem 0.5rem;
  border-radius: 12px;
}

/* Table Styling */
.custom-table {
  margin-bottom: 0;
}

.custom-table th {
  background-color: #f9fafb;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #4b5563;
  padding: 0.75rem 1.25rem;
  border-bottom: 1px solid #e5e7eb;
}

.custom-table td {
  padding: 0.875rem 1.25rem;
  border-bottom: 1px solid #f3f4f6;
}

.custom-table tbody tr:last-child td {
  border-bottom: none;
}

.custom-table tbody tr:hover {
  background-color: #f9fafb;
}

/* Status Pill Badges */
.badge-status {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: currentColor;
}

.status-active {
  background-color: #ecfdf5;
  color: #047857;
}

.status-pending {
  background-color: #fffbeb;
  color: #b45309;
}

.status-completed {
  background-color: #eff6ff;
  color: #1d4ed8;
}

.status-onhold {
  background-color: #fef2f2;
  color: #b91c1c;
}

.status-default {
  background-color: #f3f4f6;
  color: #4b5563;
}

/* Progress Bar */
.progress {
  height: 6px;
  background-color: #f3f4f6;
  border-radius: 9999px;
  overflow: hidden;
}

.progress-bar {
  border-radius: 9999px;
  transition: width 0.3s ease;
}

/* Empty State & Loader */
.state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.empty-state {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empty-icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: #f3f4f6;
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Custom Dark Modal (Matching Staff Management Modal Style) */
.modal-backdrop-custom {
  position: fixed;
  inset: 0;
  z-index: 1050;
  background-color: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-dialog-custom {
  width: 100%;
  max-width: 540px;
  margin: auto;
}

.modal-content-custom {
  background: #1e293b;
  color: #f8fafc;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.4);
}

.modal-header-custom {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title-custom {
  font-size: 1.05rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
}

.btn-close-custom {
  background: rgba(255, 255, 255, 0.15);
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-close-custom:hover {
  background: rgba(255, 255, 255, 0.28);
  color: #ffffff;
}

.modal-body-custom {
  padding: 20px;
  background: #1e293b;
}

.form-label-custom {
  font-size: 12px;
  font-weight: 600;
  color: #cbd5e1;
  margin-bottom: 6px;
  display: block;
}

.text-danger-custom {
  color: #f87171;
}

.form-control-custom {
  width: 100%;
  background-color: #0f172a;
  border: 1px solid #334155;
  color: #ffffff;
  border-radius: 8px;
  padding: 9px 12px;
  font-size: 13px;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.form-control-custom::placeholder {
  color: #64748b;
}

.form-control-custom:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  background-color: #0f172a;
  color: #ffffff;
}

.form-select-custom {
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 16px 12px;
  padding-right: 2.25rem;
}

.form-select-custom option {
  background-color: #0f172a;
  color: #ffffff;
}

.date-input-custom {
  color-scheme: dark;
}

.input-group-custom {
  display: flex;
  align-items: center;
}

.input-prefix-custom {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0f172a;
  border: 1px solid #334155;
  border-right: none;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  color: #94a3b8;
  padding: 9px 14px;
  font-size: 13px;
  font-weight: 600;
}

.input-has-prefix-custom {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.modal-footer-custom {
  padding: 14px 20px;
  background: #1e293b;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}

.btn-cancel-custom {
  background: transparent;
  border: 1px solid #475569;
  color: #cbd5e1;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-cancel-custom:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
  border-color: #64748b;
}

.btn-save-custom {
  background: #2563eb;
  border: none;
  color: #ffffff;
  border-radius: 8px;
  padding: 8px 18px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
  transition: all 0.15s ease;
  display: inline-flex;
  align-items: center;
}

.btn-save-custom:hover:not(:disabled) {
  background: #1d4ed8;
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.35);
}

.btn-save-custom:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Modal Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 640px) {
  .view-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .primary-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>