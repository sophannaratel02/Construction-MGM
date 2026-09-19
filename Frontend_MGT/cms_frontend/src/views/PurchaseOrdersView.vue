<template>
  <div class="module-root">
    <!-- Header -->
    <header class="module-header">
      <div class="header-left">
        <div class="breadcrumb-trail">
          <span class="trail-item">MGM Workspace</span>
          <span class="trail-sep">/</span>
          <span class="trail-active">Purchase Orders</span>
        </div>
        <h1 class="module-title">Purchase Orders & Material Requisitions</h1>
        <p class="module-subtitle">Manage procurement orders, material requisitions, supplier deliveries, and project material expenses.</p>
      </div>

      <div class="header-right">
        <button type="button" @click="load" class="btn-secondary-custom" :disabled="loading">
          <svg class="refresh-icon" :class="{ spinning: loading }" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M23 4v6h-6"/>
            <path d="M1 20v-6h6"/>
            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10"/>
            <path d="M20.49 15a9 9 0 0114.85 3.36L1 14"/>
          </svg>
          <span>Refresh</span>
        </button>

        <button type="button" @click="openAddModal" class="btn-primary-custom">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>New Purchase Order</span>
        </button>
      </div>
    </header>

    <!-- Top KPI Summary Cards -->
    <section class="kpi-summary-grid">
      <div class="kpi-card">
        <div class="kpi-icon bg-blue">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </div>
        <div>
          <div class="kpi-num">{{ orders.length }}</div>
          <div class="kpi-label">Total Purchase Orders</div>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-icon bg-emerald">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div>
          <div class="kpi-num">{{ formatCurrency(totalValuation) }}</div>
          <div class="kpi-label">Total Order Valuation</div>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-icon bg-amber">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div>
          <div class="kpi-num">{{ pendingCount }}</div>
          <div class="kpi-label">Pending / In Review</div>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-icon bg-purple">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <div>
          <div class="kpi-num">{{ deliveredCount }}</div>
          <div class="kpi-label">Fulfilling / Delivered</div>
        </div>
      </div>
    </section>

    <!-- Toolbar -->
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
          placeholder="Search by PO#, project, supplier..."
        />
      </div>

      <div class="filter-pills">
        <button
          v-for="st in ['All', 'Pending', 'Approved', 'Delivered', 'Cancelled']"
          :key="st"
          class="filter-pill"
          :class="{ active: currentStatus === st }"
          @click="currentStatus = st"
        >
          {{ st }}
        </button>
      </div>
    </div>

    <!-- Main Content Table -->
    <div class="content-box">
      <div class="table-responsive">
        <table class="premium-table">
          <thead>
            <tr>
              <th>PO Number</th>
              <th>Project Target</th>
              <th>Supplier</th>
              <th>Material</th>
              <th>Qty & Price</th>
              <th>Total Cost</th>
              <th>Status</th>
              <th>Order Date</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in filteredOrders" :key="order.id">
              <td>
                <div class="fw-bold text-primary">{{ order.po_number }}</div>
              </td>
              <td>
                <span class="text-slate font-13">{{ order.projectName || 'General Supply' }}</span>
              </td>
              <td>
                <span class="text-dark fw-medium">{{ order.supplierName || 'Unassigned Supplier' }}</span>
              </td>
              <td>
                <span class="text-slate">{{ order.materialName || 'Bulk Materials' }}</span>
              </td>
              <td>
                <div class="font-12">
                  <span class="fw-bold">{{ order.quantity }}</span> @ {{ formatCurrency(order.unit_price) }}
                </div>
              </td>
              <td>
                <span class="fw-bold text-emerald">{{ formatCurrency(order.total_amount) }}</span>
              </td>
              <td>
                <span class="status-badge" :class="getStatusClass(order.status)">
                  <span class="status-dot"></span>
                  {{ order.status }}
                </span>
              </td>
              <td>
                <span class="text-muted font-12">{{ formatDate(order.order_date) }}</span>
              </td>
              <td class="text-right">
                <div class="actions-cell">
                  <button type="button" @click="openEditModal(order)" class="btn-action edit" title="Edit Order">
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button type="button" @click="confirmDelete(order)" class="btn-action delete" title="Delete Order">
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="filteredOrders.length === 0">
              <td colspan="9" class="text-center py-4 text-muted">
                No purchase orders matching filter criteria.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showModal" class="modal-backdrop staff-style-modal" @click.self="closeModal">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">{{ editingId ? 'Edit Purchase Order' : 'New Purchase Order Requisition' }}</h5>
                <button type="button" class="btn-close-white d-flex align-items-center justify-content-center" @click="closeModal" aria-label="Close">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form @submit.prevent="saveOrder">
                <div class="modal-body">
                  <div class="form-row mb-3">
                    <div class="col">
                      <label class="form-label">PO Number *</label>
                      <input v-model="form.po_number" type="text" class="form-control" placeholder="PO-2026-001" required />
                    </div>
                    <div class="col">
                      <label class="form-label">Status</label>
                      <CustomSelect v-model="form.status" :options="['Pending', 'Approved', 'Delivered', 'Cancelled']" placeholder="Select Status" :allowClear="false" />
                    </div>
                  </div>

                  <div class="form-row mb-3">
                    <div class="col">
                      <label class="form-label">Project Target</label>
                      <CustomSelect v-model="form.project_id" :options="projects" placeholder="Select Project" />
                    </div>
                    <div class="col">
                      <label class="form-label">Supplier</label>
                      <CustomSelect v-model="form.supplier_id" :options="suppliers" placeholder="Select Supplier" />
                    </div>
                  </div>

                  <div class="form-row mb-3">
                    <div class="col">
                      <label class="form-label">Material</label>
                      <CustomSelect v-model="form.material_id" :options="materials" placeholder="Select Material" />
                    </div>
                    <div class="col">
                      <label class="form-label">Quantity *</label>
                      <input v-model.number="form.quantity" type="number" min="1" class="form-control" required />
                    </div>
                  </div>

                  <div class="form-row mb-3">
                    <div class="col">
                      <label class="form-label">Unit Price (USD) *</label>
                      <input v-model.number="form.unit_price" type="number" step="0.01" min="0" class="form-control" required />
                    </div>
                    <div class="col">
                      <label class="form-label">Order Date *</label>
                      <input v-model="form.order_date" type="date" class="form-control" required />
                    </div>
                  </div>

                  <div class="form-row mb-3">
                    <div class="col">
                      <label class="form-label">Expected Delivery Date</label>
                      <input v-model="form.expected_delivery" type="date" class="form-control" />
                    </div>
                    <div class="col"></div>
                  </div>

                  <div class="form-group mb-3">
                    <label class="form-label">Notes / Requisition Details</label>
                    <textarea v-model="form.notes" class="form-control" rows="3" placeholder="Requisition rationale, specs, site contact..."></textarea>
                  </div>
                </div>

                <div class="modal-footer">
                  <button type="button" class="btn-cancel" @click="closeModal">Cancel</button>
                  <button type="submit" class="btn-save" :disabled="saving">
                    {{ saving ? 'Saving...' : 'Save Purchase Order' }}
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
import { purchaseOrdersApi, projectsApi, suppliersApi, materialsApi } from '../services/api'
import { useAlert } from '../composables/useAlert'
import CustomSelect from '../components/CustomSelect.vue'

const { showSuccess, showError } = useAlert()

const orders = ref([])
const projects = ref([])
const suppliers = ref([])
const materials = ref([])
const loading = ref(false)
const saving = ref(false)
const showModal = ref(false)
const editingId = ref(null)

const searchQuery = ref('')
const currentStatus = ref('All')

const form = ref({
  po_number: '',
  project_id: null,
  supplier_id: null,
  material_id: null,
  quantity: 100,
  unit_price: 10.00,
  status: 'Pending',
  order_date: new Date().toISOString().split('T')[0],
  expected_delivery: '',
  notes: ''
})

const totalValuation = computed(() => {
  return orders.value.reduce((acc, o) => acc + (Number(o.total_amount) || 0), 0)
})

const pendingCount = computed(() => {
  return orders.value.filter(o => o.status === 'Pending').length
})

const deliveredCount = computed(() => {
  return orders.value.filter(o => o.status === 'Delivered' || o.status === 'Approved').length
})

const filteredOrders = computed(() => {
  return orders.value.filter(o => {
    const matchesSearch = 
      (o.po_number || '').toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (o.projectName || '').toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (o.supplierName || '').toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesStatus = currentStatus.value === 'All' || o.status === currentStatus.value
    return matchesSearch && matchesStatus
  })
})

const load = async () => {
  loading.value = true
  try {
    const [ordersRes, projRes, supRes, matRes] = await Promise.all([
      purchaseOrdersApi.getAll(),
      projectsApi.getAll(),
      suppliersApi.getAll(),
      materialsApi.getAll()
    ])
    orders.value = ordersRes.data || []
    projects.value = projRes.data || []
    suppliers.value = supRes.data || []
    materials.value = matRes.data || []
  } catch (err) {
    showError('Failed to load purchase orders.')
  } finally {
    loading.value = false
  }
}

const openAddModal = () => {
  editingId.value = null
  form.value = {
    po_number: `PO-${new Date().getFullYear()}-${String(orders.value.length + 1).padStart(3, '0')}`,
    project_id: null,
    supplier_id: null,
    material_id: null,
    quantity: 100,
    unit_price: 10.00,
    status: 'Pending',
    order_date: new Date().toISOString().split('T')[0],
    expected_delivery: '',
    notes: ''
  }
  showModal.value = true
}

const openEditModal = (order) => {
  editingId.value = order.id
  form.value = {
    po_number: order.po_number,
    project_id: order.project_id || null,
    supplier_id: order.supplier_id || null,
    material_id: order.material_id || null,
    quantity: order.quantity,
    unit_price: order.unit_price,
    status: order.status || 'Pending',
    order_date: order.order_date ? order.order_date.split('T')[0] : '',
    expected_delivery: order.expected_delivery ? order.expected_delivery.split('T')[0] : '',
    notes: order.notes || ''
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const saveOrder = async () => {
  saving.value = true
  try {
    if (editingId.value) {
      await purchaseOrdersApi.update(editingId.value, form.value)
      showSuccess('Purchase order updated successfully.')
    } else {
      await purchaseOrdersApi.create(form.value)
      showSuccess('Purchase order created successfully.')
    }
    closeModal()
    load()
  } catch (err) {
    showError(err.response?.data?.message || 'Failed to save purchase order.')
  } finally {
    saving.value = false
  }
}

const confirmDelete = async (order) => {
  if (confirm(`Delete purchase order ${order.po_number}?`)) {
    try {
      await purchaseOrdersApi.delete(order.id)
      showSuccess('Purchase order deleted.')
      load()
    } catch (err) {
      showError('Failed to delete purchase order.')
    }
  }
}

const formatCurrency = (val) => {
  const num = Number(val)
  if (isNaN(num)) return '$0'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(num)
}

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const getStatusClass = (status) => {
  const s = (status || '').toLowerCase()
  if (s === 'delivered' || s === 'approved') return 'badge-active'
  if (s === 'pending') return 'badge-warning'
  if (s === 'cancelled') return 'badge-danger'
  return 'badge-info'
}

onMounted(() => {
  load()
})
</script>

<style scoped>
.module-root {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.breadcrumb-trail {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  color: #64748b;
  margin-bottom: 4px;
}

.trail-active { color: #3b82f6; font-weight: 600; }
.module-title { font-size: 1.6rem; font-weight: 800; color: #0f172a; margin: 0; }
.module-subtitle { font-size: 0.88rem; color: #64748b; margin: 4px 0 0; }

.header-right { display: flex; align-items: center; gap: 12px; }

.btn-primary-custom {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white; border: none; padding: 10px 18px; border-radius: 10px; font-weight: 600; font-size: 0.88rem;
  display: flex; align-items: center; gap: 8px; cursor: pointer; transition: all 0.2s ease;
}
.btn-primary-custom:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3); }

.btn-secondary-custom {
  background: white; color: #475569; border: 1px solid #e2e8f0; padding: 10px 16px; border-radius: 10px; font-weight: 600; font-size: 0.88rem;
  display: flex; align-items: center; gap: 8px; cursor: pointer; transition: all 0.2s ease;
}
.btn-secondary-custom:hover { background: #f8fafc; border-color: #cbd5e1; }

.kpi-summary-grid {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px;
}
.kpi-card {
  background: white; border-radius: 16px; padding: 20px; border: 1px solid #e2e8f0; display: flex; align-items: center; gap: 16px;
}
.kpi-icon {
  width: 46px; height: 46px; border-radius: 12px; display: flex; align-items: center; justify-content: center;
}
.bg-blue { background: rgba(59, 130, 246, 0.12); color: #2563eb; }
.bg-emerald { background: rgba(16, 185, 129, 0.12); color: #059669; }
.bg-amber { background: rgba(245, 158, 11, 0.12); color: #d97706; }
.bg-purple { background: rgba(124, 58, 237, 0.12); color: #7c3aed; }
.kpi-num { font-size: 1.4rem; font-weight: 800; color: #0f172a; }
.kpi-label { font-size: 0.82rem; color: #64748b; font-weight: 500; }

.toolbar-box {
  background: white; border-radius: 14px; padding: 14px 18px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;
}
.search-input-wrap { position: relative; width: 300px; }
.search-icon { position: absolute; left: 12px; top: 12px; color: #94a3b8; }
.search-field { width: 100%; padding: 8px 12px 8px 36px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.88rem; outline: none; }
.filter-pills { display: flex; gap: 8px; flex-wrap: wrap; }
.filter-pill { background: #f1f5f9; border: none; color: #64748b; padding: 6px 14px; border-radius: 999px; font-size: 0.82rem; font-weight: 600; cursor: pointer; }
.filter-pill.active { background: #2563eb; color: white; }

.content-box { background: white; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; }
.premium-table { width: 100%; border-collapse: collapse; }
.premium-table th { background: #f8fafc; padding: 14px 16px; font-size: 0.8rem; font-weight: 700; color: #475569; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; text-align: left; }
.premium-table td { padding: 14px 16px; border-bottom: 1px solid #f1f5f9; font-size: 0.88rem; }
.status-badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 999px; font-size: 0.78rem; font-weight: 600; }
.badge-active { background: #d1fae5; color: #065f46; }
.badge-warning { background: #fef3c7; color: #92400e; }
.badge-danger { background: #fee2e2; color: #991b1b; }
.badge-info { background: #dbeafe; color: #1e40af; }
.status-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

.actions-cell { display: flex; gap: 6px; justify-content: flex-end; }
.btn-action { background: #f1f5f9; border: none; padding: 6px; border-radius: 6px; color: #64748b; cursor: pointer; }
.btn-action:hover { background: #e2e8f0; color: #0f172a; }
.btn-action.delete:hover { background: #fee2e2; color: #dc2626; }
</style>
