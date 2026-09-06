<template>
  <div class="view-container">
    <!-- Header -->
    <div class="view-header mb-4 d-flex justify-content-between align-items-center">
      <div>
        <h1 class="page-title mb-1">Equipment</h1>
        <p class="page-subtitle">Manage equipment</p>
      </div>
      <button @click="showAddForm = true" class="btn btn-primary">
        <span class="me-2">+</span> Add New
      </button>
    </div>

    <!-- Table Card -->
    <div class="card shadow-md">
      <div class="card-header">
        <h5 class="mb-0">Equipment List</h5>
      </div>

      <div v-if="loading" class="card-body text-center text-muted">
        <div class="spinner-border spinner-border-sm me-2"></div>
        Loading...
      </div>

      <div v-else-if="items.length" class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th>Equipment Name</th><th>Type</th><th>Serial Number</th><th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.id">
              <td>{{ item.name }}</td><td>{{ item.type }}</td><td>{{ item.serialNumber }}</td><td>{{ item.status }}</td>
              <td>
                <button @click="editItem(item)" class="btn btn-sm btn-link text-primary">Edit</button>
                <button @click="deleteItem(item.id)" class="btn btn-sm btn-link text-danger">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="empty-state">
        <div class="empty-state-icon">📋</div>
        <p class="empty-state-text">No records found. Create your first record!</p>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showAddForm" class="modal d-block staff-style-modal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editingId ? 'Edit' : 'New' }} Record</h5>
            <button type="button" class="btn-close" @click="showAddForm = false"></button>
          </div>
          <form @submit.prevent="saveItem">
            <div class="modal-body">

              <div class="mb-3">
                <label class="form-label">Equipment Name</label>
                <input v-model="form.name" type="text" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Type</label>
                <input v-model="form.type" type="text" class="form-control"  />
              </div>
              <div class="mb-3">
                <label class="form-label">Serial Number</label>
                <input v-model="form.serialNumber" type="text" class="form-control"  />
              </div>
              <div class="mb-3">
                <label class="form-label">Status</label>
                <input v-model="form.status" type="text" class="form-control"  />
              </div>
              <div class="mb-3">
                <label class="form-label">Purchase Date *</label>
                <input v-model="form.purchaseDate" type="date" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Cost *</label>
                <input v-model.number="form.cost" type="number" min="0" step="0.01" class="form-control" required />
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="showAddForm = false">Cancel</button>
              <button type="submit" class="btn btn-primary">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { equipmentApi } from '../services/api'

const items = ref([])
const loading = ref(false)
const showAddForm = ref(false)
const editingId = ref(null)
const form = ref({ name: '', type: '', serialNumber: '', status: 'Available', purchaseDate: '', cost: 0 })

const load = async () => {
  loading.value = true
  try {
    const response = await equipmentApi.getAll()
    items.value = response.data
  } catch (error) {
    console.error('Failed:', error)
  } finally {
    loading.value = false
  }
}

const saveItem = async () => {
  try {
    editingId.value ? await equipmentApi.update(editingId.value, form.value) : await equipmentApi.create(form.value)
    resetForm()
    load()
  } catch (error) {
    console.error('Failed:', error)
  }
}

const editItem = (item) => {
  editingId.value = item.id
  form.value = { ...item }
  showAddForm.value = true
}

const deleteItem = async (id) => {
  if (confirm('Are you sure?')) {
    try {
      await equipmentApi.delete(id)
      load()
    } catch (error) {
      console.error('Failed:', error)
    }
  }
}

const resetForm = () => {
  editingId.value = null
  showAddForm.value = false
  form.value = { name: '', type: '', serialNumber: '', status: 'Available', purchaseDate: '', cost: 0 }
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

.empty-state {
  padding: 3rem 1rem;
  text-align: center;
}

.empty-state-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-state-text {
  color: #6b7280;
  font-size: 1rem;
}
</style>