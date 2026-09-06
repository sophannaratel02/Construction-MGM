<template>
  <div class="view-container">
    <!-- Notifications -->
    <div 
      v-if="errorMessage" 
      class="alert alert-danger alert-dismissible fade show mb-4" 
      role="alert"
    >
      <i class="bi bi-exclamation-triangle-fill me-2"></i>{{ errorMessage }}
      <button type="button" class="btn-close" @click="errorMessage = ''" aria-label="Close"></button>
    </div>

    <div 
      v-if="successMessage" 
      class="alert alert-success alert-dismissible fade show mb-4" 
      role="alert"
    >
      <i class="bi bi-check-circle-fill me-2"></i>{{ successMessage }}
      <button type="button" class="btn-close" @click="successMessage = ''" aria-label="Close"></button>
    </div>

    <!-- Header -->
    <div class="view-header mb-4 d-flex justify-content-between align-items-center">
      <div>
        <h1 class="page-title mb-1">Clients</h1>
        <p class="page-subtitle">Manage client profiles and contact information</p>
      </div>
      <button @click="openAddModal" class="btn btn-primary d-inline-flex align-items-center">
        <span class="me-2 fw-bold">+</span> Add New Client
      </button>
    </div>

    <!-- Table Card -->
    <div class="card shadow-sm border-0">
      <div class="card-header bg-white py-3">
        <h5 class="mb-0 fw-semibold text-dark">Clients List</h5>
      </div>

      <div v-if="loading" class="card-body text-center text-muted py-5">
        <div class="spinner-border spinner-border-sm me-2" role="status"></div>
        <span>Loading clients...</span>
      </div>

      <div v-else-if="items.length" class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th>Company Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th class="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.id">
              <td><strong>{{ item.companyName }}</strong></td>
              <td>
                <a v-if="item.email" :href="`mailto:${item.email}`" class="text-decoration-none text-body">
                  {{ item.email }}
                </a>
                <span v-else class="text-muted">-</span>
              </td>
              <td>{{ item.phone || '-' }}</td>
              <td class="text-truncate" style="max-width: 250px;" :title="item.address">
                {{ item.address || '-' }}
              </td>
              <td class="text-end">
                <button 
                  @click="editItem(item)" 
                  class="btn btn-sm btn-link text-primary text-decoration-none me-2"
                  :disabled="deletingId === item.id"
                >
                  Edit
                </button>
                <button 
                  @click="deleteItem(item.id)" 
                  class="btn btn-sm btn-link text-danger text-decoration-none"
                  :disabled="deletingId === item.id"
                >
                  <span v-if="deletingId === item.id" class="spinner-border spinner-border-sm me-1"></span>
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="empty-state">
        <div class="empty-state-icon">📋</div>
        <p class="empty-state-text mb-0">No records found. Create your first record!</p>
      </div>
    </div>

    <!-- Modal Backdrop & Window -->
    <div 
      v-if="showAddForm" 
      ref="modalRef"
      class="modal fade show d-block staff-style-modal"
      tabindex="-1" 
      @click.self="!saving && resetForm()"
      @keydown.esc="!saving && resetForm()"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
          <div class="modal-header">
            <h5 class="modal-title fw-semibold">{{ editingId ? 'Edit' : 'New' }} Client</h5>
            <button type="button" class="btn-close" @click="resetForm" aria-label="Close" :disabled="saving"></button>
          </div>
          <form @submit.prevent="saveItem" novalidate>
            <div class="modal-body">
              <div class="mb-3">
                <label for="companyName" class="form-label">Company Name <span class="text-danger">*</span></label>
                <input 
                  id="companyName"
                  v-model.trim="form.companyName" 
                  type="text" 
                  class="form-control" 
                  :class="{ 'is-invalid': formErrors.companyName }"
                  placeholder="e.g. Acme Corporation"
                  :disabled="saving"
                />
                <div v-if="formErrors.companyName" class="invalid-feedback">
                  {{ formErrors.companyName }}
                </div>
              </div>

              <div class="mb-3">
                <label for="email" class="form-label">Email <span class="text-danger">*</span></label>
                <input 
                  id="email"
                  v-model.trim="form.email" 
                  type="email" 
                  class="form-control" 
                  :class="{ 'is-invalid': formErrors.email }"
                  placeholder="name@company.com"
                  required
                  :disabled="saving"
                />
                <div v-if="formErrors.email" class="invalid-feedback">
                  {{ formErrors.email }}
                </div>
              </div>

              <div class="mb-3">
                <label for="contactPerson" class="form-label">Contact Person <span class="text-danger">*</span></label>
                <input
                  id="contactPerson"
                  v-model.trim="form.contactPerson"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': formErrors.contactPerson }"
                  placeholder="e.g. Jane Smith"
                  :disabled="saving"
                />
                <div v-if="formErrors.contactPerson" class="invalid-feedback">
                  {{ formErrors.contactPerson }}
                </div>
              </div>

              <div class="mb-3">
                <label for="phone" class="form-label">Phone <span class="text-danger">*</span></label>
                <input 
                  id="phone"
                  v-model.trim="form.phone" 
                  type="tel" 
                  class="form-control" 
                  placeholder="+1 (555) 000-0000"
                  required
                  :disabled="saving"
                />
              </div>

              <div class="mb-3">
                <label for="address" class="form-label">Address <span class="text-danger">*</span></label>
                <textarea 
                  id="address"
                  v-model.trim="form.address" 
                  class="form-control" 
                  rows="3"
                  placeholder="Street address, city, state, zip code"
                  required
                  :disabled="saving"
                ></textarea>
              </div>
            </div>

            <div class="modal-footer bg-light">
              <button 
                type="button" 
                class="btn btn-outline-secondary" 
                @click="resetForm" 
                :disabled="saving"
              >
                Cancel
              </button>
              <button type="submit" class="btn btn-primary" :disabled="saving">
                <span v-if="saving" class="spinner-border spinner-border-sm me-1" role="status"></span>
                {{ saving ? 'Saving...' : (editingId ? 'Update Client' : 'Save Client') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { clientsApi } from '../services/api'

// State management
const items = ref([])
const loading = ref(false)
const saving = ref(false)
const deletingId = ref(null)
const showAddForm = ref(false)
const editingId = ref(null)
const modalRef = ref(null)

// Feedback messages
const errorMessage = ref('')
const successMessage = ref('')

// Form state & validations
const initialForm = {
  companyName: '',
  contactPerson: '',
  email: '',
  phone: '',
  address: ''
}

const form = ref({ ...initialForm })
const formErrors = reactive({
  companyName: '',
  contactPerson: '',
  email: '',
  phone: '',
  address: ''
})

// Enhanced helper to extract detailed API error messages
const handleApiError = (error, defaultMsg) => {
  console.error('Backend Error Response:', error.response?.data)
  const data = error.response?.data
  if (!data) return defaultMsg

  // Handles express-validator style error arrays: [{ msg: "..." }, ...]
  if (Array.isArray(data.errors)) {
    return data.errors.map(e => e.msg || e.message).join(' | ')
  }

  return data.message || data.error || defaultMsg
}

// Format payload: convert empty strings to null & include snake_case keys for compatibility
const preparePayload = (formData) => {
  const companyName = formData.companyName?.trim() || ''
  const contactPerson = formData.contactPerson?.trim() || ''
  const email = formData.email?.trim() || null
  const phone = formData.phone?.trim() || null
  const address = formData.address?.trim() || null

  return {
    companyName,
    contactPerson,
    email,
    phone,
    address
  }
}

// Clear active messages
const clearMessages = () => {
  errorMessage.value = ''
  successMessage.value = ''
}

// Load Clients List
const load = async () => {
  loading.value = true
  try {
    const response = await clientsApi.getAll()
    items.value = response.data?.data || response.data || []
  } catch (error) {
    errorMessage.value = handleApiError(error, 'Failed to fetch clients from server.')
  } finally {
    loading.value = false
  }
}

// Client-side Validation
const validateForm = () => {
  let isValid = true
  formErrors.companyName = ''
  formErrors.contactPerson = ''
  formErrors.email = ''
  formErrors.phone = ''
  formErrors.address = ''

  if (!form.value.companyName) {
    formErrors.companyName = 'Company Name is required.'
    isValid = false
  }

  if (!form.value.contactPerson) {
    formErrors.contactPerson = 'Contact Person is required.'
    isValid = false
  }

  if (!form.value.email) {
    formErrors.email = 'Email is required.'
    isValid = false
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.value.email)) {
      formErrors.email = 'Please enter a valid email address.'
      isValid = false
    }
  }

  if (!form.value.phone) {
    formErrors.phone = 'Phone is required.'
    isValid = false
  }

  if (!form.value.address) {
    formErrors.address = 'Address is required.'
    isValid = false
  }

  return isValid
}

const openAddModal = async () => {
  clearMessages()
  resetForm()
  showAddForm.value = true
  await nextTick()
  modalRef.value?.focus() // enables the Esc key handler
}

const saveItem = async () => {
  clearMessages()
  if (!validateForm()) return

  saving.value = true
  const payload = preparePayload(form.value)

  try {
    if (editingId.value) {
      await clientsApi.update(editingId.value, payload)
      successMessage.value = 'Client updated successfully.'
    } else {
      await clientsApi.create(payload)
      successMessage.value = 'Client created successfully.'
    }
    // Close the modal only after the save actually succeeded
    resetForm()
    await load()
  } catch (error) {
    errorMessage.value = handleApiError(error, 'Failed to save client details.')
    // Modal stays open so the user sees the error and can retry
  } finally {
    saving.value = false
  }
}

const editItem = async (item) => {
  clearMessages()
  editingId.value = item.id
  form.value = { 
    companyName: item.companyName || item.company_name || '',
    contactPerson: item.contactPerson || item.contact_person || '',
    email: item.email || '',
    phone: item.phone || '',
    address: item.address || ''
  }
  showAddForm.value = true
  await nextTick()
  modalRef.value?.focus()
}

const deleteItem = async (id) => {
  clearMessages()
  if (confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
    deletingId.value = id
    try {
      await clientsApi.delete(id)
      successMessage.value = 'Client deleted successfully.'
      await load()
    } catch (error) {
      errorMessage.value = handleApiError(error, 'Failed to delete client.')
    } finally {
      deletingId.value = null
    }
  }
}

const resetForm = () => {
  editingId.value = null
  showAddForm.value = false
  form.value = { ...initialForm }
  formErrors.companyName = ''
  formErrors.contactPerson = ''
  formErrors.email = ''
  formErrors.phone = ''
  formErrors.address = ''
}

onMounted(load)
</script>

<style scoped>
.view-container {
  padding: 0;
}

.view-header {
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.page-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.empty-state {
  padding: 3rem 1rem;
  text-align: center;
}

.empty-state-icon {
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
}

.empty-state-text {
  color: #6b7280;
  font-size: 0.95rem;
}
</style>