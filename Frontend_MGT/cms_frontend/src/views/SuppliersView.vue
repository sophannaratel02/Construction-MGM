<template>
  <div class="module-root">
    <!-- Header -->
    <header class="module-header">
      <div class="header-left">
        <div class="breadcrumb-trail">
          <span class="trail-item">MGM Workspace</span>
          <span class="trail-sep">/</span>
          <span class="trail-active">Suppliers & Vendors</span>
        </div>
        <h1 class="module-title">Vendor & Supplier Network</h1>
        <p class="module-subtitle">Manage material supply partners, product categories, tax records, and procurement contacts.</p>
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

        <button type="button" @click="openCreateModal" class="btn-primary-custom">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>Add Supplier</span>
        </button>
      </div>
    </header>

    <!-- Top KPI Summary Cards -->
    <section class="kpi-summary-grid">
      <div class="kpi-card">
        <div class="kpi-icon bg-purple"><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4m-8-11h.01M12 10h.01M16 10h.01M9 14h.01M12 14h.01M16 14h.01"/></svg></div>
        <div>
          <div class="kpi-num">{{ items.length }}</div>
          <div class="kpi-label">Vendor Partners</div>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-icon bg-blue"><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg></div>
        <div>
          <div class="kpi-num">{{ categoriesCount }}</div>
          <div class="kpi-label">Product Categories</div>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-icon bg-emerald"><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg></div>
        <div>
          <div class="kpi-num">{{ contactsCount }}</div>
          <div class="kpi-label">Account Reps</div>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-icon bg-amber"><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg></div>
        <div>
          <div class="kpi-num">{{ citiesCount }}</div>
          <div class="kpi-label">Supply Hubs</div>
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
          v-for="cat in ['All', 'Building Materials', 'Steel & Rebar', 'Aggregates & Stone', 'Plumbing & Electrical', 'Heavy Machinery']"
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
        <p>Loading supplier directory...</p>
      </div>

      <!-- Data Table -->
      <div v-else-if="filteredItems.length > 0" class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Supplier Company</th>
              <th>Product Category</th>
              <th>Contact Representative</th>
              <th>Email Address</th>
              <th>Phone Number</th>
              <th>Location Hub</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredItems" :key="item.id" class="table-row">
              <td>
                <div class="name-cell">
                  <div class="supplier-avatar" :style="getAvatarStyle(item.companyName)">
                    {{ getInitials(item.companyName) }}
                  </div>
                  <div>
                    <div class="supplier-name">{{ item.companyName }}</div>
                    <div class="supplier-id">VENDOR #SUP-{{ String(item.id).padStart(4, '0') }}</div>
                  </div>
                </div>
              </td>
              <td>
                <span class="category-pill" :class="getCategoryClass(item.productCategory)">
                  {{ item.productCategory || 'General Supplies' }}
                </span>
              </td>
              <td>
                <span class="contact-person"><svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="me-1 align-text-bottom"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg> {{ item.contactPerson || 'N/A' }}</span>
              </td>
              <td>
                <a v-if="item.email" :href="`mailto:${item.email}`" class="email-link">
                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="me-1 align-text-bottom"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg> {{ item.email }}
                </a>
                <span v-else class="text-muted">—</span>
              </td>
              <td>
                <span class="phone-text"><svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="me-1 align-text-bottom"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg> {{ item.phone || 'N/A' }}</span>
              </td>
              <td>
                <span class="location-text"><svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="me-1 align-text-bottom"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg> {{ item.city || 'Phnom Penh' }}</span>
              </td>
              <td class="text-right">
                <div class="actions-group">
                  <button @click="editItem(item)" class="btn-action edit" title="Edit Supplier"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="me-1"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>Edit</button>
                  <button @click="deleteItem(item.id)" class="btn-action delete" title="Delete Supplier"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="me-1"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/></svg>Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-icon"><svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4m-8-11h.01M12 10h.01M16 10h.01M9 14h.01M12 14h.01M16 14h.01"/></svg></div>
        <h3>No Suppliers Found</h3>
        <p>No vendor partners match your current search or category filter.</p>
        <button @click="openCreateModal" class="btn-primary-custom">+ Add New Supplier</button>
      </div>
    </div>

    <!-- Modal Form -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showAddForm" class="modal-backdrop staff-style-modal" @click.self="resetForm">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">{{ editingId ? 'Edit Supplier Record' : 'Add New Vendor Partner' }}</h5>
                <button type="button" class="btn-close-white d-flex align-items-center justify-content-center" @click="resetForm"><svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>

              <form @submit.prevent="saveItem">
                <div class="modal-body">
                  <div class="form-group mb-3">
                    <label class="form-label">Supplier Company Name *</label>
                    <input v-model="form.companyName" type="text" class="form-control" placeholder="e.g. Kampot Cement Co., Ltd." required />
                  </div>

                  <div class="form-row mb-3">
                    <div class="col">
                      <label class="form-label">Product Category *</label>
                      <select v-model="form.productCategory" class="form-control">
                        <option value="Building Materials">Building Materials</option>
                        <option value="Steel & Rebar">Steel & Rebar</option>
                        <option value="Aggregates & Stone">Aggregates & Stone</option>
                        <option value="Plumbing & Electrical">Plumbing & Electrical</option>
                        <option value="Heavy Machinery">Heavy Machinery</option>
                      </select>
                    </div>

                    <div class="col">
                      <label class="form-label">Contact Person *</label>
                      <input v-model="form.contactPerson" type="text" class="form-control" placeholder="e.g. Oum Sotha" required />
                    </div>
                  </div>

                  <div class="form-row mb-3">
                    <div class="col">
                      <label class="form-label">Email Address *</label>
                      <input v-model="form.email" type="email" class="form-control" placeholder="sales@k-cement.com.kh" required />
                    </div>

                    <div class="col">
                      <label class="form-label">Phone Number *</label>
                      <input v-model="form.phone" type="text" class="form-control" placeholder="023 724 555" required />
                    </div>
                  </div>

                  <div class="form-row mb-3">
                    <div class="col">
                      <label class="form-label">City Hub *</label>
                      <input v-model="form.city" type="text" class="form-control" placeholder="Phnom Penh" required />
                    </div>

                    <div class="col">
                      <label class="form-label">Tax ID / VAT</label>
                      <input v-model="form.taxId" type="text" class="form-control" placeholder="SUP-KMT-001" />
                    </div>
                  </div>

                  <div class="form-group mb-3">
                    <label class="form-label">Headquarters Address</label>
                    <textarea v-model="form.address" class="form-control" rows="2" placeholder="e.g. Phnom Penh Tower, Floor 18, Monivong Blvd"></textarea>
                  </div>
                </div>

                <div class="modal-footer">
                  <button type="button" class="btn-cancel" @click="resetForm">Cancel</button>
                  <button type="submit" class="btn-save" :disabled="saving">
                    {{ saving ? 'Saving...' : 'Save Supplier' }}
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
import { suppliersApi } from '../services/api'

const items = ref([])
const loading = ref(false)
const saving = ref(false)
const showAddForm = ref(false)
const editingId = ref(null)
const searchQuery = ref('')
const currentCategory = ref('All')

const initialFormState = () => ({
  companyName: '',
  contactPerson: '',
  email: '',
  phone: '',
  productCategory: 'Building Materials',
  address: '',
  city: 'Phnom Penh',
  state: 'Phnom Penh',
  zipCode: '12000',
  taxId: ''
})

const form = ref(initialFormState())

const categoriesCount = computed(() => new Set(items.value.map(i => i.productCategory).filter(Boolean)).size)
const contactsCount = computed(() => items.value.filter(i => i.contactPerson).length)
const citiesCount = computed(() => new Set(items.value.map(i => i.city).filter(Boolean)).size)

const filteredItems = computed(() => {
  return items.value.filter(item => {
    const matchesCat = currentCategory.value === 'All' || (item.productCategory || '').toLowerCase().includes(currentCategory.value.toLowerCase())
    const query = searchQuery.value.toLowerCase()
    const matchesSearch = !query ||
      (item.companyName || '').toLowerCase().includes(query) ||
      (item.contactPerson || '').toLowerCase().includes(query) ||
      (item.productCategory || '').toLowerCase().includes(query) ||
      (item.city || '').toLowerCase().includes(query)
    return matchesCat && matchesSearch
  })
})

const load = async () => {
  loading.value = true
  try {
    const res = await suppliersApi.getAll()
    if (Array.isArray(res?.data)) {
      items.value = res.data
    }
  } catch (err) {
    console.error('Failed to load suppliers:', err)
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
    companyName: item.companyName || '',
    contactPerson: item.contactPerson || '',
    email: item.email || '',
    phone: item.phone || '',
    productCategory: item.productCategory || 'Building Materials',
    address: item.address || '',
    city: item.city || 'Phnom Penh',
    state: item.state || 'Phnom Penh',
    zipCode: item.zipCode || '12000',
    taxId: item.taxId || ''
  }
  showAddForm.value = true
}

const saveItem = async () => {
  saving.value = true
  try {
    const payload = { ...form.value }
    if (editingId.value) {
      await suppliersApi.update(editingId.value, payload)
    } else {
      await suppliersApi.create(payload)
    }
    resetForm()
    await load()
  } catch (err) {
    console.error('Failed to save supplier:', err)
    alert('Failed to save supplier record.')
  } finally {
    saving.value = false
  }
}

const deleteItem = async (id) => {
  if (!confirm('Are you sure you want to delete this supplier?')) return
  try {
    await suppliersApi.delete(id)
    await load()
  } catch (err) {
    console.error('Failed to delete supplier:', err)
    alert('Failed to delete supplier.')
  }
}

const resetForm = () => {
  showAddForm.value = false
  editingId.value = null
  form.value = initialFormState()
}

const getInitials = (name = '') => {
  return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().substring(0, 2) || 'SUP'
}

const getCategoryClass = (cat = '') => {
  const c = cat.toLowerCase()
  if (c.includes('steel')) return 'cat-steel'
  if (c.includes('cement') || c.includes('building')) return 'cat-cement'
  if (c.includes('aggregate') || c.includes('stone')) return 'cat-stone'
  if (c.includes('plumb') || c.includes('electric')) return 'cat-plumb'
  return 'cat-default'
}

const getAvatarStyle = (name = '') => {
  const colors = [
    { background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', color: '#fff' },
    { background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#fff' },
    { background: 'linear-gradient(135deg, #10b981, #047857)', color: '#fff' },
    { background: 'linear-gradient(135deg, #f59e0b, #b45309)', color: '#fff' }
  ]
  return colors[name.length % colors.length]
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
.bg-purple { background: #ede9fe; } .bg-blue { background: #dbeafe; } .bg-emerald { background: #d1fae5; } .bg-amber { background: #fef3c7; }
.kpi-num { font-size: 22px; font-weight: 800; color: #0f172a; line-height: 1.1; }
.kpi-label { font-size: 12px; color: #64748b; margin-top: 2px; }

.toolbar-box { display: flex; justify-content: space-between; align-items: center; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 10px 16px; margin-bottom: 20px; gap: 16px; flex-wrap: wrap; }
.search-input-wrap { display: flex; align-items: center; gap: 8px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 7px 12px; flex-grow: 1; max-width: 400px; }
.search-icon { color: #94a3b8; }
.search-field { border: none; background: transparent; font-size: 13px; outline: none; width: 100%; }

.filter-pills { display: flex; gap: 4px; background: #f1f5f9; padding: 3px; border-radius: 8px; flex-wrap: wrap; }
.filter-pill { border: none; background: transparent; padding: 5px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; color: #64748b; cursor: pointer; }
.filter-pill.active { background: #fff; color: #0f172a; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }

.content-box { background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
.table-responsive { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.data-table th { text-align: left; padding: 12px 14px; color: #64748b; font-size: 11.5px; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; background: #f8fafc; }
.data-table td { padding: 14px 14px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }

.name-cell { display: flex; align-items: center; gap: 12px; }
.supplier-avatar { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 13px; flex-shrink: 0; }
.supplier-name { font-weight: 700; color: #0f172a; }
.supplier-id { font-size: 11px; color: #94a3b8; }

.category-pill { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 11.5px; font-weight: 600; }
.cat-steel { background: #e0f2fe; color: #0369a1; }
.cat-cement { background: #d1fae5; color: #047857; }
.cat-stone { background: #fef3c7; color: #b45309; }
.cat-plumb { background: #ede9fe; color: #6d28d9; }
.cat-default { background: #f1f5f9; color: #475569; }

.contact-person { font-weight: 600; color: #334155; }
.email-link { color: #2563eb; text-decoration: none; font-weight: 500; }
.email-link:hover { text-decoration: underline; }
.phone-text { color: #475569; font-weight: 500; }
.location-text { font-size: 12px; color: #64748b; }

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