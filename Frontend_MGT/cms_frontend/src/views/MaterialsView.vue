<template>
  <div class="view-container">
    <!-- Header -->
    <div class="view-header mb-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
      <div>
        <h1 class="page-title mb-1">Materials & Stock</h1>
        <p class="page-subtitle">Manage your materials, quantities and pricing</p>
      </div>
      <button @click="openAddForm" class="btn btn-primary btn-add">
        <span class="me-2">+</span> Add New
      </button>
    </div>

    <!-- Stats -->
    <div class="stats-row mb-4">
      <div class="stat-card">
        <div class="stat-icon stat-icon-blue">📦</div>
        <div>
          <div class="stat-value">{{ items.length }}</div>
          <div class="stat-label">Total Materials</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon stat-icon-green">💰</div>
        <div>
          <div class="stat-value">{{ formatCurrency(totalValue) }}</div>
          <div class="stat-label">Total Stock Value</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon stat-icon-amber">⚠️</div>
        <div>
          <div class="stat-value">{{ lowStockCount }}</div>
          <div class="stat-label">Low Stock Items</div>
        </div>
      </div>
    </div>

    <!-- Table Card -->
    <div class="card shadow-md">
      <div class="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
        <h5 class="mb-0">Materials & Stock List</h5>
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input
            v-model="searchQuery"
            type="text"
            class="form-control search-input"
            placeholder="Search by name or category..."
          />
        </div>
      </div>

      <div v-if="loading" class="state-block text-center text-muted">
        <div class="spinner-border spinner-border-sm me-2"></div>
        Loading materials...
      </div>

      <div v-else-if="errorMessage" class="state-block">
        <div class="alert alert-danger d-flex justify-content-between align-items-center mb-0">
          <span>{{ errorMessage }}</span>
          <button class="btn btn-sm btn-outline-danger" @click="load">Retry</button>
        </div>
      </div>

      <div v-else-if="filteredItems.length" class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th @click="sortBy('name')" class="sortable">
                Material Name <span class="sort-arrow">{{ sortArrow('name') }}</span>
              </th>
              <th @click="sortBy('category')" class="sortable">
                Category <span class="sort-arrow">{{ sortArrow('category') }}</span>
              </th>
              <th @click="sortBy('quantity')" class="sortable text-end">
                Quantity <span class="sort-arrow">{{ sortArrow('quantity') }}</span>
              </th>
              <th @click="sortBy('unitPrice')" class="sortable text-end">
                Unit Price <span class="sort-arrow">{{ sortArrow('unitPrice') }}</span>
              </th>
              <th class="text-end">Total</th>
              <th class="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredItems" :key="item.id">
              <td class="fw-medium">{{ item.name }}</td>
              <td>
                <span v-if="item.category" class="badge-category">{{ item.category }}</span>
                <span v-else class="text-muted">—</span>
              </td>
              <td class="text-end">
                <span :class="['qty-badge', isLowStock(item) ? 'qty-low' : 'qty-ok']">
                  {{ formatNumber(item.quantity) }}
                </span>
              </td>
              <td class="text-end">{{ formatCurrency(item.unitPrice) }}</td>
              <td class="text-end fw-semibold">{{ formatCurrency(lineTotal(item)) }}</td>
              <td class="text-end">
                <button @click="editItem(item)" class="btn btn-sm btn-icon btn-icon-edit" title="Edit">
                  ✏️
                </button>
                <button @click="deleteItem(item.id)" class="btn btn-sm btn-icon btn-icon-delete" title="Delete">
                  🗑️
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else-if="searchQuery" class="empty-state">
        <div class="empty-state-icon">🔎</div>
        <p class="empty-state-text">No materials match "{{ searchQuery }}".</p>
        <button class="btn btn-sm btn-outline-secondary" @click="searchQuery = ''">Clear search</button>
      </div>

      <div v-else class="empty-state">
        <div class="empty-state-icon">📋</div>
        <p class="empty-state-text">No records found. Create your first record!</p>
        <button class="btn btn-primary btn-sm" @click="openAddForm">+ Add New</button>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showAddForm" class="modal d-block modal-backdrop-custom staff-style-modal" @click.self="closeForm">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editingId ? 'Edit Material' : 'New Material' }}</h5>
            <button type="button" class="btn-close" @click="closeForm"></button>
          </div>
          <form @submit.prevent="saveItem" novalidate>
            <div class="modal-body">

              <div class="mb-3">
                <label class="form-label">Material Name <span class="text-danger">*</span></label>
                <input
                  v-model.trim="form.name"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': submitted && !form.name }"
                  placeholder="e.g. Portland Cement"
                  required
                />
                <div class="invalid-feedback">Material name is required.</div>
              </div>

              <div class="mb-3">
                  <label class="form-label">Category <span class="text-danger">*</span></label>
                <input
                  v-model.trim="form.category"
                  type="text"
                  class="form-control"
                  placeholder="e.g. Construction"
                  required
                />
              </div>

              <div class="row">
                <div class="col-6 mb-3">
                  <label class="form-label">Quantity</label>
                  <input
                    v-model.number="form.quantity"
                    type="number"
                    min="0"
                    step="1"
                    class="form-control"
                    placeholder="0"
                  />
                </div>
                <div class="col-6 mb-3">
                  <label class="form-label">Unit Price</label>
                  <div class="input-group">
                    <span class="input-group-text">$</span>
                    <input
                      v-model.number="form.unitPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      class="form-control"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-6 mb-3">
                  <label class="form-label">Unit <span class="text-danger">*</span></label>
                  <input v-model.trim="form.unit" type="text" class="form-control" placeholder="e.g. Bag" required />
                </div>
                <div class="col-6 mb-3">
                  <label class="form-label">Supplier <span class="text-danger">*</span></label>
                  <input v-model.trim="form.supplier" type="text" class="form-control" placeholder="e.g. BuildTech Supplies" required />
                </div>
              </div>

              <div v-if="saveError" class="alert alert-danger py-2 px-3 small mb-0">
                {{ saveError }}
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeForm">Cancel</button>
              <button type="submit" class="btn btn-primary" :disabled="saving">
                <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
                {{ editingId ? 'Save Changes' : 'Add Material' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { materialsApi } from '../services/api'

const items = ref([])
const loading = ref(false)
const saving = ref(false)
const errorMessage = ref('')
const saveError = ref('')
const showAddForm = ref(false)
const editingId = ref(null)
const submitted = ref(false)
const searchQuery = ref('')

const sortKey = ref('name')
const sortDir = ref('asc')

const LOW_STOCK_THRESHOLD = 5

const emptyForm = () => ({ name: '', category: '', unit: '', quantity: 0, unitPrice: 0, supplier: '' })
const form = reactive(emptyForm())

const load = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    const response = await materialsApi.getAll()
    items.value = response.data ?? []
  } catch (error) {
    console.error('Failed to load materials:', error)
    errorMessage.value = 'Could not load materials. Please try again.'
  } finally {
    loading.value = false
  }
}

const filteredItems = computed(() => {
  let result = items.value

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    result = result.filter(
      (i) =>
        (i.name || '').toLowerCase().includes(q) ||
        (i.category || '').toLowerCase().includes(q)
    )
  }

  const key = sortKey.value
  const dir = sortDir.value === 'asc' ? 1 : -1
  result = [...result].sort((a, b) => {
    const av = a[key]
    const bv = b[key]
    if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir
    return String(av ?? '').localeCompare(String(bv ?? '')) * dir
  })

  return result
})

const totalValue = computed(() =>
  items.value.reduce((sum, i) => sum + lineTotal(i), 0)
)

const lowStockCount = computed(
  () => items.value.filter((i) => isLowStock(i)).length
)

const lineTotal = (item) => (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0)
const isLowStock = (item) => (Number(item.quantity) || 0) < LOW_STOCK_THRESHOLD

const sortBy = (key) => {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDir.value = 'asc'
  }
}
const sortArrow = (key) => (sortKey.value !== key ? '' : sortDir.value === 'asc' ? '▲' : '▼')

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value) || 0)

const formatNumber = (value) => new Intl.NumberFormat('en-US').format(Number(value) || 0)

const openAddForm = () => {
  resetForm()
  showAddForm.value = true
}

const saveItem = async () => {
  submitted.value = true
  saveError.value = ''

  if (!form.name || !form.category || !form.unit || !form.supplier) {
    saveError.value = 'Name, category, unit, and supplier are required.'
    return
  }

  saving.value = true
  try {
    const payload = { ...form }
    if (editingId.value) {
      await materialsApi.update(editingId.value, payload)
    } else {
      await materialsApi.create(payload)
    }
    resetForm()
    showAddForm.value = false
    await load()
  } catch (error) {
    console.error('Failed to save material:', error)
    saveError.value = 'Could not save this material. Please try again.'
  } finally {
    saving.value = false
  }
}

const editItem = (item) => {
  editingId.value = item.id
  Object.assign(form, {
    name: item.name ?? '',
    category: item.category ?? '',
    unit: item.unit ?? '',
    quantity: item.quantity ?? 0,
    unitPrice: item.unitPrice ?? 0,
    supplier: item.supplier ?? '',
  })
  submitted.value = false
  saveError.value = ''
  showAddForm.value = true
}

const deleteItem = async (id) => {
  if (!confirm('Are you sure you want to delete this material?')) return
  try {
    await materialsApi.delete(id)
    await load()
  } catch (error) {
    console.error('Failed to delete material:', error)
    errorMessage.value = 'Could not delete this material. Please try again.'
  }
}

const closeForm = () => {
  resetForm()
  showAddForm.value = false
}

const resetForm = () => {
  editingId.value = null
  submitted.value = false
  saveError.value = ''
  Object.assign(form, emptyForm())
}

onMounted(load)
</script>

<style scoped>
.view-container {
  padding: 0;
}

.view-header {
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #e5e7eb;
}

.page-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.page-subtitle {
  font-size: 0.95rem;
  color: #6b7280;
  margin: 0;
}

.btn-add {
  border-radius: 8px;
  padding: 0.5rem 1.1rem;
  font-weight: 600;
  box-shadow: 0 2px 6px rgba(37, 99, 235, 0.25);
}

/* Stats */
.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.1rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.9rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.stat-icon {
  width: 44px;
  height: 44px;
  min-width: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.stat-icon-blue { background: #dbeafe; }
.stat-icon-green { background: #dcfce7; }
.stat-icon-amber { background: #fef3c7; }

.stat-value {
  font-size: 1.35rem;
  font-weight: 700;
  color: #111827;
  line-height: 1.2;
}

.stat-label {
  font-size: 0.8rem;
  color: #6b7280;
}

/* Card */
.card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
}

.card-header {
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem 1.25rem;
}

.card-header h5 {
  font-weight: 700;
  color: #111827;
}

.search-box {
  position: relative;
  min-width: 260px;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.85rem;
  opacity: 0.6;
}

.search-input {
  padding-left: 2.1rem;
  border-radius: 8px;
}

/* Table */
.table thead th {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #6b7280;
  font-weight: 700;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  padding: 0.85rem 1rem;
}

.table th.sortable {
  cursor: pointer;
  user-select: none;
}

.table th.sortable:hover {
  color: #111827;
}

.sort-arrow {
  font-size: 0.65rem;
  color: #2563eb;
}

.table td {
  padding: 0.85rem 1rem;
  border-bottom: 1px solid #f3f4f6;
  color: #374151;
}

.badge-category {
  display: inline-block;
  background: #eef2ff;
  color: #4338ca;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
}

.qty-badge {
  font-weight: 600;
  padding: 0.2rem 0.55rem;
  border-radius: 6px;
}

.qty-ok {
  color: #065f46;
  background: #d1fae5;
}

.qty-low {
  color: #92400e;
  background: #fef3c7;
}

.btn-icon {
  border: none;
  background: transparent;
  font-size: 0.95rem;
  padding: 0.25rem 0.4rem;
  border-radius: 6px;
}

.btn-icon:hover {
  background: #f3f4f6;
}

/* States */
.state-block {
  padding: 2rem 1.25rem;
}

.empty-state {
  padding: 3.5rem 1rem;
  text-align: center;
}

.empty-state-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-state-text {
  color: #6b7280;
  font-size: 1rem;
  margin-bottom: 1rem;
}

/* Modal */
.modal-backdrop-custom {
  background: rgba(17, 24, 39, 0.55);
}

.modal-content {
  border-radius: 14px;
  border: none;
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.2);
}

.modal-header {
  border-bottom: 1px solid #e5e7eb;
  padding: 1.1rem 1.4rem;
}

.modal-title {
  font-weight: 700;
}

.modal-body {
  padding: 1.4rem;
}

.modal-footer {
  border-top: 1px solid #e5e7eb;
  padding: 1rem 1.4rem;
}

.form-label {
  font-weight: 600;
  font-size: 0.85rem;
  color: #374151;
}

.form-control, .input-group-text {
  border-radius: 8px;
}
</style>