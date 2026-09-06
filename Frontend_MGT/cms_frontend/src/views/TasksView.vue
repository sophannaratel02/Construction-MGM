<template>
  <div class="tasks-view-container p-3 p-lg-4">
    <!-- View Header -->
    <div class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
      <div>
        <h2 class="page-title mb-1">Tasks Management</h2>
        <p class="page-subtitle mb-0">Track, prioritize, and manage project workflows</p>
      </div>
      <button @click="openCreateModal" class="btn btn-primary-custom d-flex align-items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        <span>Add New Task</span>
      </button>
    </div>

    <!-- Main Table Card -->
    <div class="card content-card border-0 shadow-sm">
      <div class="card-header border-bottom-0 d-flex justify-content-between align-items-center p-3 px-4">
        <h5 class="card-header-title mb-0">Task Overview</h5>
        <span class="badge count-badge">{{ items.length }} Total</span>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="card-body text-center py-5">
        <div class="spinner-border text-primary spinner-border-sm me-2" role="status"></div>
        <span class="text-muted">Fetching task records...</span>
      </div>

      <!-- Data Table -->
      <div v-else-if="items.length" class="table-responsive">
        <table class="table align-middle mb-0">
          <thead>
            <tr>
              <th>Task Title</th>
              <th>Project</th>
              <th>Priority</th>
              <th>Status</th>
              <th class="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.id">
              <td>
                <span class="fw-semibold text-light">{{ item.title }}</span>
              </td>
              <td class="text-muted-custom">{{ item.project || 'Unassigned' }}</td>
              <td>
                <span :class="['badge-status', getPriorityClass(item.priority)]">
                  {{ item.priority || 'Normal' }}
                </span>
              </td>
              <td>
                <span :class="['badge-status', getStatusClass(item.status)]">
                  {{ item.status || 'Pending' }}
                </span>
              </td>
              <td class="text-end">
                <div class="d-inline-flex gap-2">
                  <button @click="editItem(item)" class="btn-action-sm btn-action-edit" title="Edit Task">
                    Edit
                  </button>
                  <button @click="deleteItem(item.id)" class="btn-action-sm btn-action-delete" title="Delete Task">
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
        <div class="empty-state-icon mb-3">📋</div>
        <h6 class="text-light fw-semibold">No tasks available</h6>
        <p class="empty-state-text mb-3">Create your first task to start tracking project progress.</p>
        <button @click="openCreateModal" class="btn btn-outline-custom btn-sm">
          + Add New Task
        </button>
      </div>
    </div>

    <!-- Modal Drawer / Overlay -->
    <div v-if="showAddForm" class="custom-modal-backdrop d-flex align-items-center justify-content-center">
      <div class="custom-modal-dialog w-100 max-w-lg">
        <div class="modal-content-custom">
          <div class="modal-header-custom d-flex align-items-center justify-content-between p-4">
            <h5 class="modal-title mb-0">{{ editingId ? 'Edit Task' : 'Create New Task' }}</h5>
            <button type="button" class="btn-close-custom" @click="resetForm">✕</button>
          </div>
          
          <form @submit.prevent="saveItem">
            <div class="modal-body-custom p-4 d-flex flex-column gap-3">
              <div>
                <label class="form-label-custom">Task Title *</label>
                <input v-model="form.title" type="text" class="form-input-custom" placeholder="e.g. Foundation Pouring Inspection" required />
              </div>

              <div>
                <label class="form-label-custom">Project *</label>
                <input v-model="form.project" type="text" class="form-input-custom" placeholder="e.g. Sector 7 Commercial Hub" required />
              </div>

              <div class="row g-3">
                <div class="col-6">
                  <label class="form-label-custom">Assigned To *</label>
                  <input v-model="form.assignedTo" type="text" class="form-input-custom" placeholder="e.g. John Smith" required />
                </div>
                <div class="col-6">
                  <label class="form-label-custom">Due Date *</label>
                  <input v-model="form.dueDate" type="date" class="form-input-custom" required />
                </div>
              </div>

              <div class="row g-3">
                <div class="col-6">
                  <label class="form-label-custom">Priority</label>
                  <select v-model="form.priority" class="form-input-custom form-select-custom">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>

                <div class="col-6">
                  <label class="form-label-custom">Status</label>
                  <select v-model="form.status" class="form-input-custom form-select-custom">
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="modal-footer-custom p-4 d-flex justify-content-end gap-2">
              <button type="button" class="btn btn-outline-custom" @click="resetForm">Cancel</button>
              <button type="submit" class="btn btn-primary-custom" :disabled="submitting">
                <span v-if="submitting" class="spinner-border spinner-border-sm me-1"></span>
                {{ editingId ? 'Update Task' : 'Save Task' }}
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
import { tasksApi } from '../services/api'

const items = ref([])
const loading = ref(false)
const submitting = ref(false)
const showAddForm = ref(false)
const editingId = ref(null)

const defaultForm = () => ({
  title: '',
  project: '',
  assignedTo: '',
  dueDate: '',
  priority: 'Medium',
  status: 'Pending'
})

const form = ref(defaultForm())

const load = async () => {
  loading.value = true
  try {
    const response = await tasksApi.getAll()
    items.value = response.data || []
  } catch (error) {
    console.error('Failed to load tasks:', error)
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
  form.value = { ...item }
  showAddForm.value = true
}

const saveItem = async () => {
  submitting.value = true
  try {
    if (editingId.value) {
      await tasksApi.update(editingId.value, form.value)
    } else {
      await tasksApi.create(form.value)
    }
    resetForm()
    await load()
  } catch (error) {
    console.error('Failed to save task:', error)
  } finally {
    submitting.value = false
  }
}

const deleteItem = async (id) => {
  if (confirm('Are you sure you want to delete this task?')) {
    try {
      await tasksApi.delete(id)
      await load()
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }
}

const resetForm = () => {
  editingId.value = null
  showAddForm.value = false
  form.value = defaultForm()
}

// Styling badge color helpers
const getPriorityClass = (priority) => {
  switch (priority?.toLowerCase()) {
    case 'urgent': return 'badge-danger'
    case 'high': return 'badge-warning'
    case 'medium': return 'badge-info'
    default: return 'badge-secondary'
  }
}

const getStatusClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'completed': return 'badge-success'
    case 'in progress': return 'badge-info'
    case 'on hold': return 'badge-warning'
    default: return 'badge-secondary'
  }
}

onMounted(load)
</script>

<style scoped>
.tasks-view-container {
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

/* Card Styling */
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

.text-muted-custom {
  color: var(--text-muted);
}

/* Badge Status Styles */
.badge-status {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-block;
}

.badge-success { background: rgba(34, 197, 94, 0.15); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.2); }
.badge-warning { background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.2); }
.badge-danger { background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.2); }
.badge-info { background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.2); }
.badge-secondary { background: rgba(148, 163, 184, 0.15); color: #cbd5e1; border: 1px solid rgba(148, 163, 184, 0.2); }

/* Custom Action Buttons */
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

/* Modal Custom Overlay */
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