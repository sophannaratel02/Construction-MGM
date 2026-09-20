<template>
  <div class="module-root">
    <!-- Header -->
    <header class="module-header">
      <div class="header-left">
        <div class="breadcrumb-trail">
          <span class="trail-item">MGM Workspace</span>
          <span class="trail-sep">/</span>
          <span class="trail-active">Materials & Stock</span>
        </div>
        <h1 class="module-title">Materials & Inventory Management</h1>
        <p class="module-subtitle">Track raw construction materials, unit pricing, supplier sourcing, and stock levels.</p>
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
          <span>Add Material</span>
        </button>
      </div>
    </header>

    <!-- Top KPI Summary Cards -->
    <section class="kpi-summary-grid">
      <div class="kpi-card kpi-blue">
        <div class="kpi-icon-glow icon-blue">
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
        </div>
        <div class="kpi-info">
          <div class="kpi-num-row">
            <span class="kpi-num color-blue">{{ items.length }}</span>
            <span class="kpi-mini-tag tag-blue">Types</span>
          </div>
          <div class="kpi-label">Material Types</div>
        </div>
      </div>

      <div class="kpi-card kpi-emerald">
        <div class="kpi-icon-glow icon-emerald">
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <div class="kpi-info">
          <div class="kpi-num-row">
            <span class="kpi-num color-emerald">{{ formatCurrency(totalValue) }}</span>
            <span class="kpi-mini-tag tag-emerald">Valuation</span>
          </div>
          <div class="kpi-label">Total Stock Valuation</div>
        </div>
      </div>

      <div class="kpi-card kpi-amber">
        <div class="kpi-icon-glow icon-amber">
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        </div>
        <div class="kpi-info">
          <div class="kpi-num-row">
            <span class="kpi-num color-amber">{{ lowStockCount }}</span>
            <span class="kpi-mini-tag tag-amber">Alerts</span>
          </div>
          <div class="kpi-label">Low Stock Alerts</div>
        </div>
      </div>

      <div class="kpi-card kpi-purple">
        <div class="kpi-icon-glow icon-purple">
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4m-8-11h.01M12 10h.01M16 10h.01M9 14h.01M12 14h.01M16 14h.01"/></svg>
        </div>
        <div class="kpi-info">
          <div class="kpi-num-row">
            <span class="kpi-num color-purple">{{ uniqueSuppliersCount }}</span>
            <span class="kpi-mini-tag tag-purple">Suppliers</span>
          </div>
          <div class="kpi-label">Active Suppliers</div>
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
          v-for="cat in ['All', 'Building Materials', 'Steel', 'Masonry', 'Aggregates', 'Plumbing']"
          :key="cat"
          class="filter-pill"
          :class="{ active: currentCategory === cat }"
          @click="currentCategory = cat"
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <!-- Main Content Box -->
    <div class="content-box">
      <!-- Loading State -->
      <div v-if="loading" class="state-box">
        <div class="spinner"></div>
        <p>Loading material stock directory...</p>
      </div>

      <!-- Data Table -->
      <div v-else-if="filteredItems.length > 0" class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Material Details</th>
              <th>Category</th>
              <th>Quantity & Unit</th>
              <th>Unit Price</th>
              <th>Total Value</th>
              <th>Supplier</th>
              <th>Status</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredItems" :key="item.id" class="table-row">
              <td>
                <div class="name-cell">
                  <div class="mat-icon-box"><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg></div>
                  <div>
                    <div class="mat-name">{{ item.name }}</div>
                    <div class="mat-desc" v-if="item.description">{{ item.description }}</div>
                  </div>
                </div>
              </td>
              <td>
                <span class="category-badge">{{ item.category || 'General' }}</span>
              </td>
              <td>
                <span class="qty-pill" :class="{ 'qty-low': isLowStock(item) }">
                  {{ formatNumber(item.quantity) }} {{ item.unit || 'Units' }}
                  <span v-if="isLowStock(item)" class="alert-icon d-inline-flex align-items-center"><svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="me-1"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg> Low</span>
                </span>
              </td>
              <td>
                <span class="price-val">{{ formatCurrency(item.unitPrice) }}</span>
              </td>
              <td>
                <strong class="total-val">{{ formatCurrency(lineTotal(item)) }}</strong>
              </td>
              <td>
                <span class="supplier-text"><svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="me-1 align-text-bottom"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4m-8-11h.01M12 10h.01M16 10h.01M9 14h.01M12 14h.01M16 14h.01"/></svg> {{ item.supplier || 'Direct Supplier' }}</span>
              </td>
              <td>
                <span class="status-badge" :class="getStatusClass(item.status)">
                  <span class="status-dot"></span>
                  {{ item.status || 'Pending' }}
                </span>
              </td>
              <td class="text-right">
                <div class="actions-group">
                  <button v-if="isAdmin && item.status === 'Pending'" @click="approveItem(item)" class="btn-action approve" title="Approve Material"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="me-1"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>Approve</button>
                  <button @click="editItem(item)" class="btn-action edit" title="Edit Material"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="me-1"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>Edit</button>
                  <button v-if="isAdmin" @click="deleteItem(item.id)" class="btn-action delete" title="Delete Material"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="me-1"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/></svg>Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-icon"><svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg></div>
        <h3>No Materials Found</h3>
        <p>No materials match your current search or category filter.</p>
        <button @click="openAddForm" class="btn-primary-custom">+ Add New Material</button>
      </div>
    </div>

    <!-- Modal Form -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showAddForm" class="modal-backdrop staff-style-modal" @click.self="resetForm">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">{{ editingId ? 'Edit Material Record' : 'Add New Material' }}</h5>
                <button type="button" class="btn-close-white d-flex align-items-center justify-content-center" @click="resetForm"><svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>

              <form @submit.prevent="saveItem">
                <div class="modal-body">
                  <div class="form-group mb-3">
                    <label class="form-label">Material Name *</label>
                    <input v-model="form.name" type="text" class="form-control" placeholder="e.g. K-Cement Portland Type 1" required />
                  </div>

                  <div class="form-row mb-3">
                    <div class="col">
                      <label class="form-label">Category *</label>
                      <CustomSelect 
                        v-model="form.category" 
                        :options="['Building Materials', 'Steel', 'Masonry', 'Aggregates', 'Plumbing']" 
                        placeholder="Select Category" 
                        :allowClear="false" 
                      />
                    </div>

                    <div class="col">
                      <label class="form-label">Measurement Unit *</label>
                      <input v-model="form.unit" type="text" class="form-control" placeholder="e.g. Bag, Ton, Meter, Piece" required />
                    </div>
                  </div>

                  <div class="form-row mb-3">
                    <div class="col">
                      <label class="form-label">Quantity in Stock *</label>
                      <input v-model.number="form.quantity" type="number" min="0" class="form-control" placeholder="2500" required />
                    </div>

                    <div class="col">
                      <label class="form-label">Unit Price (USD) *</label>
                      <input v-model.number="form.unitPrice" type="number" step="any" min="0" class="form-control" placeholder="6.80" required />
                    </div>
                  </div>

                  <div class="form-row mb-3">
                    <div class="col">
                      <label class="form-label">Supplier Company *</label>
                      <CustomSelect 
                        v-model="form.supplier_id" 
                        :options="suppliersList" 
                        placeholder="Select Supplier" 
                        @change="onSupplierChange" 
                        required 
                      />
                    </div>

                    <div class="col">
                      <label class="form-label">Target Construction Project</label>
                      <CustomSelect 
                        v-model="form.project_id" 
                        :options="projectsList" 
                        placeholder="Select Project (Optional)" 
                        :allowClear="true" 
                      />
                    </div>
                  </div>

                  <div class="form-group mb-3">
                    <label class="form-label">Description & Notes</label>
                    <textarea v-model="form.description" class="form-control" rows="3" placeholder="Enter specifications, grade, or storage location..."></textarea>
                  </div>
                </div>

                <div class="modal-footer">
                  <button type="button" class="btn-cancel" @click="resetForm">Cancel</button>
                  <button type="submit" class="btn-save" :disabled="saving">
                    {{ saving ? 'Saving...' : 'Save Material' }}
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
import { materialsApi, suppliersApi, projectsApi } from '../services/api'
import { useAlert } from '../composables/useAlert'
import CustomSelect from '../components/CustomSelect.vue'

const { showSuccess, showError, showConfirm } = useAlert()

const items = ref([])
const suppliersList = ref([])
const projectsList = ref([])
const loading = ref(false)
const saving = ref(false)
const showAddForm = ref(false)
const editingId = ref(null)
const searchQuery = ref('')
const currentCategory = ref('All')

const userObj = computed(() => {
  try { return JSON.parse(localStorage.getItem('cms_user') || '{}') } catch { return {} }
})
const isAdmin = computed(() => userObj.value.role === 'admin')

const initialFormState = () => ({
  name: '',
  category: 'Building Materials',
  unit: 'Bag',
  quantity: 0,
  unitPrice: 0,
  supplier: '',
  supplier_id: null,
  project_id: null,
  status: 'Pending',
  description: ''
})

const form = ref(initialFormState())

const onSupplierChange = () => {
  const selected = suppliersList.value.find(s => s.id === form.value.supplier_id)
  if (selected) {
    form.value.supplier = selected.companyName
  }
}

const getStatusClass = (status) => {
  const s = (status || 'Pending').toLowerCase()
  if (s === 'approved') return 'badge-active'
  if (s === 'pending') return 'badge-warning'
  if (s === 'out of stock' || s === 'discontinued') return 'badge-danger'
  return 'badge-info'
}

const approveItem = async (item) => {
  try {
    await materialsApi.approve(item.id)
    await load()
    showSuccess(`Material "${item.name}" has been approved.`, 'Material Approved')
  } catch (err) {
    console.error('Failed to approve material:', err)
    showError(err?.response?.data?.message || 'Failed to approve material.')
  }
}

const totalValue = computed(() => {
  return items.value.reduce((acc, item) => acc + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0), 0)
})

const lowStockCount = computed(() => {
  return items.value.filter(isLowStock).length
})

const uniqueSuppliersCount = computed(() => {
  const set = new Set(items.value.map(i => i.supplier).filter(Boolean))
  return set.size
})

const filteredItems = computed(() => {
  return items.value.filter(item => {
    const matchesCategory = currentCategory.value === 'All' || (item.category || '').toLowerCase().includes(currentCategory.value.toLowerCase())
    const query = searchQuery.value.toLowerCase()
    const matchesSearch = !query ||
      (item.name || '').toLowerCase().includes(query) ||
      (item.category || '').toLowerCase().includes(query) ||
      (item.supplier || '').toLowerCase().includes(query)
    return matchesCategory && matchesSearch
  })
})

const load = async () => {
  loading.value = true
  try {
    const [matRes, supRes, projRes] = await Promise.all([
      materialsApi.getAll(),
      suppliersApi.getAll(),
      projectsApi.getAll()
    ])
    suppliersList.value = supRes?.data || []
    projectsList.value = projRes?.data || []
    if (Array.isArray(matRes?.data)) {
      items.value = matRes.data
    }
  } catch (err) {
    console.error('Failed to load materials:', err)
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
    category: item.category || 'Building Materials',
    unit: item.unit || 'Bag',
    quantity: Number(item.quantity) || 0,
    unitPrice: Number(item.unitPrice) || 0,
    supplier: item.supplier || '',
    supplier_id: item.supplier_id || null,
    status: item.status || 'Approved',
    description: item.description || ''
  }
  showAddForm.value = true
}

const saveItem = async () => {
  saving.value = true
  try {
    const isEditing = Boolean(editingId.value)
    const matName = form.value.name || 'Material'
    const payload = { ...form.value }
    if (editingId.value) {
      await materialsApi.update(editingId.value, payload)
    } else {
      await materialsApi.create(payload)
    }
    resetForm()
    await load()
    if (isAdmin.value) {
      showSuccess(
        isEditing
          ? `Material "${matName}" updated successfully.`
          : `Material "${matName}" added to inventory successfully.`,
        isEditing ? 'Material Updated' : 'Material Added'
      )
    } else {
      showSuccess(
        isEditing
          ? `Material "${matName}" update submitted for Admin review.`
          : `Material "${matName}" submitted with Pending status. Auto-alert sent to Admin for approval.`,
        'Submitted for Approval'
      )
    }
  } catch (err) {
    console.error('Failed to save material:', err)
    showError(err?.response?.data?.message || 'Failed to save material record.')
  } finally {
    saving.value = false
  }
}

const deleteItem = async (id) => {
  const confirmed = await showConfirm({
    title: 'Delete Material Item',
    message: 'Are you sure you want to delete this material from inventory? This action cannot be undone.',
    confirmText: 'Delete Material',
    type: 'danger'
  })
  if (!confirmed) return
  try {
    await materialsApi.delete(id)
    await load()
    showSuccess('Material removed from inventory.', 'Material Deleted')
  } catch (err) {
    console.error('Failed to delete material:', err)
    showError(err?.response?.data?.message || 'Failed to delete material.')
  }
}

const resetForm = () => {
  showAddForm.value = false
  editingId.value = null
  form.value = initialFormState()
}

const isLowStock = (item) => {
  return (Number(item.quantity) || 0) < 500
}

const lineTotal = (item) => {
  return (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0)
}

const formatNumber = (val) => {
  const num = Number(val)
  if (isNaN(num)) return '0'
  return new Intl.NumberFormat('en-US').format(num)
}

const formatCurrency = (val) => {
  const num = Number(val)
  if (isNaN(num)) return '$0'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(num)
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

.kpi-summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 18px; margin-bottom: 24px; }
.kpi-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 18px 20px; display: flex; align-items: center; gap: 16px; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); position: relative; overflow: hidden; box-shadow: 0 2px 6px rgba(15, 23, 42, 0.04); }

.kpi-purple, .kpi-blue, .kpi-emerald, .kpi-amber { background: #ffffff; border-color: #e2e8f0; }
.kpi-card:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(15, 23, 42, 0.08); border-color: #cbd5e1; }

.kpi-icon-glow { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: #ffffff; transition: transform 0.25s ease; }
.kpi-card:hover .kpi-icon-glow { transform: scale(1.08) rotate(3deg); }

.icon-purple, .icon-blue, .icon-emerald, .icon-amber { background: linear-gradient(135deg, #2563eb, #1d4ed8); box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2); }

.kpi-info { display: flex; flex-direction: column; flex-grow: 1; }
.kpi-num-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.kpi-num { font-size: 26px; font-weight: 800; line-height: 1.1; letter-spacing: -0.5px; color: #0f172a; }
.color-purple, .color-blue, .color-emerald, .color-amber { color: #0f172a; }

.kpi-mini-tag { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.4px; }
.tag-purple, .tag-blue, .tag-emerald, .tag-amber { background: #eff6ff; color: #1d4ed8; border: 1px solid #dbeafe; }

.kpi-label { font-size: 13px; font-weight: 600; color: #475569; margin-top: 3px; }

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
.mat-icon-box { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 16px; background: #eff6ff; flex-shrink: 0; }
.mat-name { font-weight: 700; color: #0f172a; }
.mat-desc { font-size: 11.5px; color: #64748b; max-width: 260px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.category-badge { background: #f1f5f9; color: #334155; padding: 3px 8px; border-radius: 6px; font-size: 12px; font-weight: 500; }
.qty-pill { font-weight: 700; color: #0f172a; }
.qty-pill.qty-low { color: #b45309; }
.alert-icon { font-size: 11px; background: #fef3c7; color: #b45309; padding: 2px 5px; border-radius: 4px; margin-left: 6px; }

.price-val { color: #475569; font-weight: 500; }
.total-val { color: #0f172a; font-weight: 700; }
.supplier-text { font-size: 12px; color: #475569; font-weight: 500; }

.actions-group { display: flex; gap: 6px; justify-content: flex-end; }
.btn-action { border: 1px solid #e2e8f0; background: #fff; padding: 4px 9px; border-radius: 6px; font-size: 11.5px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; }
.btn-action.approve:hover { background: #d1fae5; color: #047857; border-color: #a7f3d0; }
.btn-action.edit:hover { background: #eff6ff; color: #2563eb; border-color: #bfdbfe; }
.btn-action.delete:hover { background: #fff1f2; color: #e11d48; border-color: #fecdd3; }
.text-right { text-align: right; }

.state-box, .empty-state { text-align: center; padding: 40px; color: #64748b; }
.spinner { width: 24px; height: 24px; border: 3px solid #e2e8f0; border-top-color: #2563eb; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 10px; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
</style>