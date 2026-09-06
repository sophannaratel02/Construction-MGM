<template>
  <div class="module-root">
    <!-- Header -->
    <header class="module-header">
      <div class="header-left">
        <div class="breadcrumb-trail">
          <span class="trail-item">MGM Workspace</span>
          <span class="trail-sep">/</span>
          <span class="trail-active">Tasks & Work Orders</span>
        </div>
        <h1 class="module-title">Work Orders & Task Command</h1>
        <p class="module-subtitle">Track task execution, site milestones, priority assignments, and progress velocity.</p>
      </div>

      <div class="header-right">
        <button type="button" @click="loadTasks" class="btn-secondary-custom" :disabled="loading">
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
          <span>New Work Order</span>
        </button>
      </div>
    </header>

    <!-- Top KPI Summary Cards -->
    <section class="kpi-summary-grid">
      <div class="kpi-card">
        <div class="kpi-icon bg-blue"><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg></div>
        <div>
          <div class="kpi-num">{{ items.length }}</div>
          <div class="kpi-label">Total Work Orders</div>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-icon bg-cyan"><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg></div>
        <div>
          <div class="kpi-num">{{ inProgressCount }}</div>
          <div class="kpi-label">In Progress</div>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-icon bg-emerald"><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
        <div>
          <div class="kpi-num">{{ completedCount }}</div>
          <div class="kpi-label">Completed</div>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-icon bg-rose"><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg></div>
        <div>
          <div class="kpi-num">{{ criticalCount }}</div>
          <div class="kpi-label">Critical / High Urgency</div>
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
          v-for="status in ['All', 'In Progress', 'Not Started', 'Completed']"
          :key="status"
          class="filter-pill"
          :class="{ active: currentFilter === status }"
          @click="currentFilter = status"
        >
          {{ status }}
        </button>
      </div>
    </div>

    <!-- Main Content Box -->
    <div class="content-box">
      <!-- Loading State -->
      <div v-if="loading" class="state-box">
        <div class="spinner"></div>
        <p>Loading task records...</p>
      </div>

      <!-- Data Table -->
      <div v-else-if="filteredItems.length > 0" class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Task Title & Scope</th>
              <th>Assigned Project</th>
              <th>Assignee Lead</th>
              <th>Priority</th>
              <th>Execution Status</th>
              <th>Progress</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredItems" :key="item.id" class="table-row">
              <td>
                <div class="task-title-cell">
                  <div class="task-icon-box" :class="getPriorityClass(item.priority)">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                  </div>
                  <div>
                    <div class="task-title">{{ item.title }}</div>
                    <div class="task-desc" v-if="item.description">{{ item.description }}</div>
                  </div>
                </div>
              </td>
              <td>
                <span class="proj-badge">{{ item.project || 'Unassigned Site' }}</span>
              </td>
              <td>
                <span class="assignee-tag"><svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="me-1 align-text-bottom"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg> {{ item.assignedTo || 'Unassigned' }}</span>
              </td>
              <td>
                <span class="priority-pill" :class="getPriorityClass(item.priority)">
                  {{ item.priority || 'Medium' }}
                </span>
              </td>
              <td>
                <span class="status-badge" :class="getStatusClass(item.status)">
                  <span class="status-dot"></span>
                  {{ item.status || 'Not Started' }}
                </span>
              </td>
              <td>
                <div class="progress-cell">
                  <div class="progress-info">
                    <span>Complete</span>
                    <strong>{{ item.progress || 0 }}%</strong>
                  </div>
                  <div class="progress-bar-track">
                    <div class="progress-bar-fill" :style="{ width: Math.min(100, Math.max(0, item.progress || 0)) + '%' }"></div>
                  </div>
                </div>
              </td>
              <td class="text-right">
                <div class="actions-group">
                  <button @click="editItem(item)" class="btn-action edit" title="Edit Task"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="me-1"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>Edit</button>
                  <button @click="deleteItem(item.id)" class="btn-action delete" title="Delete Task"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="me-1"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/></svg>Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-icon"><svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg></div>
        <h3>No Tasks Found</h3>
        <p>No work orders match your search or filter requirements.</p>
        <button @click="openCreateModal" class="btn-primary-custom">+ Add New Task</button>
      </div>
    </div>

    <!-- Modal Drawer / Form -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showAddForm" class="modal-backdrop staff-style-modal" @click.self="resetForm">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">{{ editingId ? 'Edit Work Order Task' : 'Create New Work Order' }}</h5>
                <button type="button" class="btn-close-white d-flex align-items-center justify-content-center" @click="resetForm"><svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>

              <form @submit.prevent="saveItem">
                <div class="modal-body">
                  <div class="form-group mb-3">
                    <label class="form-label">Task Title *</label>
                    <input v-model="form.title" type="text" class="form-control" placeholder="e.g. Concrete Pouring B2 Substructure" required />
                  </div>

                  <div class="form-row mb-3">
                    <div class="col">
                      <label class="form-label">Assigned Project</label>
                      <input v-model="form.project" type="text" class="form-control" placeholder="e.g. Phnom Penh Tower Extension" />
                    </div>

                    <div class="col">
                      <label class="form-label">Assignee Lead</label>
                      <input v-model="form.assignedTo" type="text" class="form-control" placeholder="e.g. Vannak Heng" />
                    </div>
                  </div>

                  <div class="form-row mb-3">
                    <div class="col">
                      <label class="form-label">Priority Level</label>
                      <select v-model="form.priority" class="form-control">
                        <option value="Critical">Critical</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>

                    <div class="col">
                      <label class="form-label">Execution Status</label>
                      <select v-model="form.status" class="form-control">
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </div>

                  <div class="form-row mb-3">
                    <div class="col">
                      <label class="form-label">Due Date *</label>
                      <CustomDatePicker v-model="form.dueDate" required />
                    </div>

                    <div class="col">
                      <label class="form-label">Progress Percentage (%)</label>
                      <input v-model.number="form.progress" type="number" min="0" max="100" class="form-control" placeholder="0 - 100" />
                    </div>
                  </div>

                  <div class="form-group mb-3">
                    <label class="form-label">Task Description & Requirements</label>
                    <textarea v-model="form.description" class="form-control" rows="3" placeholder="Enter task instructions, site notes, or specs..."></textarea>
                  </div>
                </div>

                <div class="modal-footer">
                  <button type="button" class="btn-cancel" @click="resetForm">Cancel</button>
                  <button type="submit" class="btn-save" :disabled="saving">
                    {{ saving ? 'Saving...' : 'Save Task' }}
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
import { tasksApi } from '../services/api'
import CustomDatePicker from '../components/CustomDatePicker.vue'

const items = ref([])
const loading = ref(false)
const saving = ref(false)
const showAddForm = ref(false)
const editingId = ref(null)
const searchQuery = ref('')
const currentFilter = ref('All')

const initialFormState = () => ({
  title: '',
  project: '',
  assignedTo: '',
  description: '',
  priority: 'Medium',
  status: 'Not Started',
  dueDate: '',
  progress: 0
})

const form = ref(initialFormState())

const inProgressCount = computed(() => items.value.filter(i => (i.status || '').toLowerCase() === 'in progress').length)
const completedCount = computed(() => items.value.filter(i => (i.status || '').toLowerCase() === 'completed').length)
const criticalCount = computed(() => items.value.filter(i => (i.priority || '').toLowerCase() === 'critical' || (i.priority || '').toLowerCase() === 'high').length)

const filteredItems = computed(() => {
  return items.value.filter(item => {
    const matchesFilter = currentFilter.value === 'All' || (item.status || '').toLowerCase() === currentFilter.value.toLowerCase()
    const query = searchQuery.value.toLowerCase()
    const matchesSearch = !query ||
      (item.title || '').toLowerCase().includes(query) ||
      (item.project || '').toLowerCase().includes(query) ||
      (item.assignedTo || '').toLowerCase().includes(query)
    return matchesFilter && matchesSearch
  })
})

const loadTasks = async () => {
  loading.value = true
  try {
    const res = await tasksApi.getAll()
    if (Array.isArray(res?.data)) {
      items.value = res.data
    }
  } catch (err) {
    console.error('Failed to load tasks:', err)
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
    title: item.title || '',
    project: item.project || '',
    assignedTo: item.assignedTo || '',
    description: item.description || '',
    priority: item.priority || 'Medium',
    status: item.status || 'Not Started',
    dueDate: item.dueDate ? item.dueDate.split('T')[0] : '',
    progress: item.progress || 0
  }
  showAddForm.value = true
}

const saveItem = async () => {
  saving.value = true
  try {
    const payload = { ...form.value }
    if (editingId.value) {
      await tasksApi.update(editingId.value, payload)
    } else {
      await tasksApi.create(payload)
    }
    resetForm()
    await loadTasks()
  } catch (err) {
    console.error('Failed to save task:', err)
    alert('Failed to save task record.')
  } finally {
    saving.value = false
  }
}

const deleteItem = async (id) => {
  if (!confirm('Are you sure you want to delete this task?')) return
  try {
    await tasksApi.delete(id)
    await loadTasks()
  } catch (err) {
    console.error('Failed to delete task:', err)
    alert('Failed to delete task.')
  }
}

const resetForm = () => {
  showAddForm.value = false
  editingId.value = null
  form.value = initialFormState()
}

const getPriorityClass = (priority) => {
  const p = (priority || '').toLowerCase()
  if (p === 'critical') return 'p-critical'
  if (p === 'high') return 'p-high'
  if (p === 'low') return 'p-low'
  return 'p-medium'
}

const getStatusClass = (status) => {
  const s = (status || '').toLowerCase()
  if (s === 'completed') return 'badge-completed'
  if (s === 'in progress') return 'badge-active'
  return 'badge-pending'
}

onMounted(loadTasks)
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
.bg-blue { background: #dbeafe; } .bg-cyan { background: #cffafe; } .bg-emerald { background: #d1fae5; } .bg-rose { background: #ffe4e6; }
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

.task-title-cell { display: flex; align-items: center; gap: 12px; }
.task-icon-box { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 16px; background: #f1f5f9; flex-shrink: 0; }
.task-title { font-weight: 700; color: #0f172a; }
.task-desc { font-size: 11.5px; color: #64748b; max-width: 280px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.proj-badge { background: #f1f5f9; color: #334155; padding: 3px 8px; border-radius: 6px; font-size: 12px; font-weight: 500; }
.assignee-tag { font-size: 12px; color: #475569; font-weight: 500; }

.priority-pill { display: inline-block; padding: 3px 9px; border-radius: 6px; font-size: 11.5px; font-weight: 700; }
.priority-pill.p-critical { background: #fee2e2; color: #b91c1c; }
.priority-pill.p-high { background: #ffedd5; color: #c2410c; }
.priority-pill.p-medium { background: #e0f2fe; color: #0369a1; }
.priority-pill.p-low { background: #f1f5f9; color: #64748b; }

.status-badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 999px; font-size: 11.5px; font-weight: 600; }
.status-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.badge-active { background: #dbeafe; color: #1d4ed8; }
.badge-completed { background: #d1fae5; color: #047857; }
.badge-pending { background: #fef3c7; color: #b45309; }

.progress-cell { width: 120px; }
.progress-info { display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 3px; color: #64748b; }
.progress-bar-track { width: 100%; height: 6px; background: #f1f5f9; border-radius: 999px; overflow: hidden; }
.progress-bar-fill { height: 100%; background: #2563eb; border-radius: 999px; }

.actions-group { display: flex; gap: 6px; justify-content: flex-end; }
.btn-action { border: 1px solid #e2e8f0; background: #fff; padding: 4px 9px; border-radius: 6px; font-size: 11.5px; font-weight: 600; cursor: pointer; }
.btn-action.edit:hover { background: #eff6ff; color: #2563eb; border-color: #bfdbfe; }
.btn-action.delete:hover { background: #fff1f2; color: #e11d48; border-color: #fecdd3; }
.text-right { text-align: right; }

.modal-backdrop { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(4px); z-index: 1050; display: flex; align-items: center; justify-content: center; }
.modal-dialog { width: min(100% - 2rem, 520px); }
.modal-content { background: #1e293b; color: #f8fafc; border-radius: 14px; border: 1px solid rgba(255,255,255,0.1); padding: 20px; }
.modal-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 12px; margin-bottom: 16px; }
.modal-title { font-size: 17px; font-weight: 700; color: #fff; margin: 0; }
.btn-close-white { background: transparent; border: none; color: #94a3b8; font-size: 18px; cursor: pointer; }
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