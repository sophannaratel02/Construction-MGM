<template>
  <div class="module-root">
    <!-- Header -->
    <header class="module-header">
      <div class="header-left">
        <div class="breadcrumb-trail">
          <span class="trail-item">MGM Workspace</span>
          <span class="trail-sep">/</span>
          <span class="trail-active">Fleet & Equipment</span>
        </div>
        <h1 class="module-title">Heavy Fleet & Equipment Assets</h1>
        <p class="module-subtitle">Monitor machinery utilization, site deployments, maintenance logs, and asset valuations.</p>
      </div>

      <div class="header-right">
        <button type="button" @click="load" class="btn-secondary-custom" :disabled="loading">
          <svg class="refresh-icon" :class="{ spinning: loading }" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M23 4v6h-6"/>
            <path d="M1 20v-6h6"/>
            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10"/>
            <path d="M20.49 15a9 9 0 01-14.85 3.36L1 14"/>
          </svg>
          <span>Refresh</span>
        </button>

        <button type="button" @click="openAddForm" class="btn-primary-custom">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>Add Machinery</span>
        </button>
      </div>
    </header>

    <!-- Top KPI Summary Cards -->
    <section class="kpi-summary-grid">
      <div class="kpi-card">
        <div class="kpi-icon bg-amber"><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg></div>
        <div>
          <div class="kpi-num">{{ items.length }}</div>
          <div class="kpi-label">Heavy Machinery Units</div>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-icon bg-blue"><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg></div>
        <div>
          <div class="kpi-num">{{ inUseCount }}</div>
          <div class="kpi-label">Deployed In Field</div>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-icon bg-emerald"><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
        <div>
          <div class="kpi-num">{{ availableCount }}</div>
          <div class="kpi-label">Available / Ready</div>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-icon bg-rose"><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg></div>
        <div>
          <div class="kpi-num">{{ maintenanceCount }}</div>
          <div class="kpi-label">Under Maintenance</div>
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
          v-for="status in ['All', 'Available', 'In Use', 'Maintenance']"
          :key="status"
          class="filter-pill"
          :class="{ active: currentStatus === status }"
          @click="currentStatus = status"
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
        <p>Loading equipment directory...</p>
      </div>

      <!-- Data Table -->
      <div v-else-if="filteredItems.length > 0" class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Equipment Unit</th>
              <th>Category Type</th>
              <th>Serial Tag</th>
              <th>Operational Status</th>
              <th>Current Site Location</th>
              <th>Asset Cost</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredItems" :key="item.id" class="table-row">
              <td>
                <div class="name-cell">
                  <div class="equip-icon-box"><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg></div>
                  <div>
                    <div class="equip-name">{{ item.name }}</div>
                    <div class="equip-desc" v-if="item.description">{{ item.description }}</div>
                  </div>
                </div>
              </td>
              <td>
                <span class="type-badge">{{ item.type || 'Machinery' }}</span>
              </td>
              <td>
                <code class="serial-code">{{ item.serialNumber || 'SN-N/A' }}</code>
              </td>
              <td>
                <span class="status-badge" :class="getStatusClass(item.status)">
                  <span class="status-dot"></span>
                  {{ item.status || 'Available' }}
                </span>
              </td>
              <td>
                <span class="location-text"><svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="me-1 align-text-bottom"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg> {{ item.location || 'Central Yard' }}</span>
              </td>
              <td>
                <strong class="cost-val">{{ formatCurrency(item.cost) }}</strong>
              </td>
              <td class="text-right">
                <div class="actions-group">
                  <button @click="editItem(item)" class="btn-action edit" title="Edit Asset"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="me-1"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>Edit</button>
                  <button @click="deleteItem(item.id)" class="btn-action delete" title="Delete Asset"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="me-1"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/></svg>Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-icon"><svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg></div>
        <h3>No Equipment Found</h3>
        <p>No machinery units match your current search or status filter.</p>
        <button @click="openAddForm" class="btn-primary-custom">+ Add New Equipment</button>
      </div>
    </div>

    <!-- Modal Form -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showAddForm" class="modal-backdrop staff-style-modal" @click.self="resetForm">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">{{ editingId ? 'Edit Equipment Asset' : 'Add Heavy Equipment' }}</h5>
                <button type="button" class="btn-close-white d-flex align-items-center justify-content-center" @click="resetForm"><svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>

              <form @submit.prevent="saveItem">
                <div class="modal-body">
                  <div class="form-group mb-3">
                    <label class="form-label">Equipment Name *</label>
                    <input v-model="form.name" type="text" class="form-control" placeholder="e.g. CAT Excavator 320D" required />
                  </div>

                  <div class="form-row mb-3">
                    <div class="col">
                      <label class="form-label">Machinery Type *</label>
                      <select v-model="form.type" class="form-control">
                        <option value="Excavator">Excavator</option>
                        <option value="Crane">Crane</option>
                        <option value="Concrete Pump">Concrete Pump</option>
                        <option value="Loader">Loader</option>
                        <option value="Mixer">Mixer</option>
                        <option value="Forklift">Forklift</option>
                      </select>
                    </div>

                    <div class="col">
                      <label class="form-label">Serial Tag Number *</label>
                      <input v-model="form.serialNumber" type="text" class="form-control" placeholder="CAT320D-KH-2023" required />
                    </div>
                  </div>

                  <div class="form-row mb-3">
                    <div class="col">
                      <label class="form-label">Operational Status</label>
                      <select v-model="form.status" class="form-control">
                        <option value="Available">Available</option>
                        <option value="In Use">In Use</option>
                        <option value="Maintenance">Maintenance</option>
                      </select>
                    </div>

                    <div class="col">
                      <label class="form-label">Current Site Location</label>
                      <input v-model="form.location" type="text" class="form-control" placeholder="e.g. BKK1 Site, Phnom Penh" />
                    </div>
                  </div>

                  <div class="form-row mb-3">
                    <div class="col">
                      <label class="form-label">Purchase Date *</label>
                      <CustomDatePicker v-model="form.purchaseDate" required />
                    </div>

                    <div class="col">
                      <label class="form-label">Acquisition Cost (USD) *</label>
                      <input v-model.number="form.cost" type="number" step="any" min="0" class="form-control" placeholder="180000" required />
                    </div>
                  </div>

                  <div class="form-group mb-3">
                    <label class="form-label">Specifications & History</label>
                    <textarea v-model="form.description" class="form-control" rows="3" placeholder="Enter engine specs, attachments, or service history..."></textarea>
                  </div>
                </div>

                <div class="modal-footer">
                  <button type="button" class="btn-cancel" @click="resetForm">Cancel</button>
                  <button type="submit" class="btn-save" :disabled="saving">
                    {{ saving ? 'Saving...' : 'Save Asset' }}
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
import { equipmentApi } from '../services/api'
import CustomDatePicker from '../components/CustomDatePicker.vue'
import { useAlert } from '../composables/useAlert'

const { showSuccess, showError } = useAlert()

const items = ref([])
const loading = ref(false)
const saving = ref(false)
const showAddForm = ref(false)
const editingId = ref(null)
const searchQuery = ref('')
const currentStatus = ref('All')

const initialFormState = () => ({
  name: '',
  type: 'Excavator',
  serialNumber: '',
  status: 'Available',
  purchaseDate: '',
  cost: 0,
  location: '',
  description: ''
})

const form = ref(initialFormState())

const inUseCount = computed(() => items.value.filter(i => (i.status || '').toLowerCase().includes('use')).length)
const availableCount = computed(() => items.value.filter(i => (i.status || '').toLowerCase().includes('avail')).length)
const maintenanceCount = computed(() => items.value.filter(i => (i.status || '').toLowerCase().includes('maint')).length)

const filteredItems = computed(() => {
  return items.value.filter(item => {
    const matchesStatus = currentStatus.value === 'All' || (item.status || '').toLowerCase().includes(currentStatus.value.toLowerCase())
    const query = searchQuery.value.toLowerCase()
    const matchesSearch = !query ||
      (item.name || '').toLowerCase().includes(query) ||
      (item.type || '').toLowerCase().includes(query) ||
      (item.serialNumber || '').toLowerCase().includes(query) ||
      (item.location || '').toLowerCase().includes(query)
    return matchesStatus && matchesSearch
  })
})

const load = async () => {
  loading.value = true
  try {
    const res = await equipmentApi.getAll()
    if (Array.isArray(res?.data)) {
      items.value = res.data
    }
  } catch (err) {
    console.error('Failed to load equipment:', err)
  } finally {
    loading.value = false
  }
}

const openAddForm = () => {
  editingId.value = null
  form.value = initialFormState()
  showAddForm.value = true
}

const editItem = (item) => {
  editingId.value = item.id
  form.value = {
    name: item.name || '',
    type: item.type || 'Excavator',
    serialNumber: item.serialNumber || '',
    status: item.status || 'Available',
    purchaseDate: item.purchaseDate ? item.purchaseDate.split('T')[0] : '',
    cost: Number(item.cost) || 0,
    location: item.location || '',
    description: item.description || ''
  }
  showAddForm.value = true
}

const saveItem = async () => {
  saving.value = true
  try {
    const isEditing = Boolean(editingId.value)
    const eqName = form.value.name || 'Equipment'
    const payload = { ...form.value }
    if (editingId.value) {
      await equipmentApi.update(editingId.value, payload)
    } else {
      await equipmentApi.create(payload)
    }
    resetForm()
    await load()
    showSuccess(
      isEditing
        ? `Equipment "${eqName}" updated successfully.`
        : `Equipment unit "${eqName}" registered successfully.`,
      isEditing ? 'Equipment Updated' : 'Equipment Added'
    )
  } catch (err) {
    console.error('Failed to save equipment:', err)
    showError(err?.response?.data?.message || 'Failed to save equipment asset.')
  } finally {
    saving.value = false
  }
}

const deleteItem = async (id) => {
  if (!confirm('Are you sure you want to delete this equipment unit?')) return
  try {
    await equipmentApi.delete(id)
    await load()
    showSuccess('Equipment unit removed successfully.', 'Equipment Deleted')
  } catch (err) {
    console.error('Failed to delete equipment:', err)
    showError(err?.response?.data?.message || 'Failed to delete equipment.')
  }
}

const resetForm = () => {
  showAddForm.value = false
  editingId.value = null
  form.value = initialFormState()
}

const formatCurrency = (val) => {
  const num = Number(val)
  if (isNaN(num)) return '$0'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num)
}

const getStatusClass = (status) => {
  const s = (status || '').toLowerCase()
  if (s.includes('use')) return 'badge-active'
  if (s.includes('avail')) return 'badge-completed'
  return 'badge-pending'
}

onMounted(load)
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
.bg-amber { background: #fef3c7; } .bg-blue { background: #dbeafe; } .bg-emerald { background: #d1fae5; } .bg-rose { background: #ffe4e6; }
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
.equip-icon-box { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 16px; background: #fef3c7; flex-shrink: 0; }
.equip-name { font-weight: 700; color: #0f172a; }
.equip-desc { font-size: 11.5px; color: #64748b; max-width: 260px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.type-badge { background: #f1f5f9; color: #334155; padding: 3px 8px; border-radius: 6px; font-size: 12px; font-weight: 500; }
.serial-code { font-family: monospace; font-size: 11.5px; background: #f8fafc; color: #0f172a; padding: 2px 6px; border-radius: 4px; border: 1px solid #e2e8f0; }

.status-badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 999px; font-size: 11.5px; font-weight: 600; }
.status-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.badge-active { background: #dbeafe; color: #1d4ed8; }
.badge-completed { background: #d1fae5; color: #047857; }
.badge-pending { background: #fef3c7; color: #b45309; }

.location-text { font-size: 12px; color: #475569; font-weight: 500; }
.cost-val { color: #0f172a; font-weight: 700; }

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