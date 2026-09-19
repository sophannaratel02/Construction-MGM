<template>
  <div class="admin-users-page">
    <header class="page-header">
      <div>
        <p class="eyebrow">Administration</p>
        <h1>User Management</h1>
        <p class="subtitle">Manage account access, roles, and active status.</p>
      </div>
      <button class="btn btn-primary" type="button" @click="openCreate">Add User</button>
    </header>

    <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
    <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>

    <section class="table-panel">
      <div v-if="loading" class="state">Loading users...</div>
      <div v-else-if="users.length === 0" class="state">No users found.</div>
      <div v-else class="table-responsive">
        <table class="table align-middle mb-0">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th class="text-end">Actions</th></tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td><span class="role-badge" :class="user.role">{{ user.role }}</span></td>
              <td>{{ Number(user.is_active) === 1 ? 'Active' : 'Inactive' }}</td>
              <td class="text-end">
                <button class="btn btn-sm btn-outline-primary me-2" type="button" @click="openEdit(user)">Edit</button>
                <button class="btn btn-sm btn-outline-danger" type="button" :disabled="user.id === currentUserId" @click="removeUser(user)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showForm" class="modal-backdrop staff-style-modal" @click.self="closeForm">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">{{ editingId ? 'Edit User Profile' : 'Create User Account' }}</h5>
                <button type="button" class="btn-close-white d-flex align-items-center justify-content-center" @click="closeForm" aria-label="Close">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form @submit.prevent="saveUser">
                <div class="modal-body">
                  <div class="form-row mb-3">
                    <div class="col">
                      <label class="form-label">Full Name <span class="text-danger">*</span></label>
                      <input v-model.trim="form.name" class="form-control" placeholder="e.g. Sokha Chan" required />
                    </div>
                    <div class="col">
                      <label class="form-label">Email Address <span class="text-danger">*</span></label>
                      <input v-model.trim="form.email" type="email" class="form-control" placeholder="user@cms.kh" required />
                    </div>
                  </div>

                  <div class="form-row mb-3">
                    <div class="col">
                      <label class="form-label">{{ editingId ? 'New Password' : 'Password *' }}</label>
                      <input
                        v-model="form.password"
                        type="password"
                        class="form-control"
                        :placeholder="editingId ? 'Leave blank to keep current' : '••••••••'"
                        :required="!editingId"
                      />
                    </div>
                    <div class="col">
                      <label class="form-label">System Role</label>
                      <CustomSelect
                        v-model="form.role"
                        :options="[
                          { value: 'user', label: 'User' },
                          { value: 'admin', label: 'Admin' }
                        ]"
                        placeholder="Select Role"
                        :allowClear="false"
                      />
                    </div>
                  </div>

                  <div class="form-group mb-3">
                    <label class="toggle-checkbox-label">
                      <input v-model="form.is_active" type="checkbox" class="custom-checkbox" />
                      <span>Active Account Status</span>
                    </label>
                  </div>

                  <p v-if="formError" class="form-error mb-3">{{ formError }}</p>
                </div>

                <div class="modal-footer">
                  <button class="btn-cancel" type="button" @click="closeForm">Cancel</button>
                  <button class="btn-save" type="submit" :disabled="saving">{{ saving ? 'Saving...' : 'Save User' }}</button>
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
import { onMounted, reactive, ref } from 'vue'
import { adminUsersApi } from '../services/api.js'
import CustomSelect from '../components/CustomSelect.vue'

const users = ref([])
const loading = ref(false)
const saving = ref(false)
const showForm = ref(false)
const editingId = ref(null)
const errorMessage = ref('')
const successMessage = ref('')
const formError = ref('')
const currentUserId = Number(JSON.parse(localStorage.getItem('cms_user') || '{}').id)
const emptyForm = () => ({ name: '', email: '', password: '', role: 'user', is_active: true })
const form = reactive(emptyForm())

const loadUsers = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    const response = await adminUsersApi.getAll()
    users.value = response.data
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Unable to load users.'
  } finally {
    loading.value = false
  }
}

const resetForm = () => Object.assign(form, emptyForm())
const openCreate = () => { resetForm(); editingId.value = null; formError.value = ''; showForm.value = true }
const openEdit = (user) => { Object.assign(form, { name: user.name, email: user.email, password: '', role: user.role, is_active: Number(user.is_active) === 1 }); editingId.value = user.id; formError.value = ''; showForm.value = true }
const closeForm = () => { if (!saving.value) showForm.value = false }

const saveUser = async () => {
  saving.value = true
  formError.value = ''
  try {
    const payload = { ...form, is_active: form.is_active ? 1 : 0 }
    if (!payload.password) delete payload.password
    if (editingId.value) await adminUsersApi.update(editingId.value, payload)
    else await adminUsersApi.create(payload)
    showForm.value = false
    successMessage.value = editingId.value ? 'User updated successfully.' : 'User created successfully.'
    await loadUsers()
  } catch (error) {
    formError.value = error.response?.data?.message || 'Unable to save user.'
  } finally {
    saving.value = false
  }
}

const removeUser = async (user) => {
  if (!confirm(`Delete ${user.name}?`)) return
  try {
    await adminUsersApi.delete(user.id)
    successMessage.value = 'User deleted successfully.'
    await loadUsers()
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Unable to delete user.'
  }
}

onMounted(loadUsers)
</script>

<style scoped>
.admin-users-page { max-width: 1200px; margin: 0 auto; padding: 16px 20px 48px; color: #0f172a; }
.page-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 24px; }
.eyebrow { margin: 0 0 6px; color: #2563eb; font-size: 0.75rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
h1 { margin: 0; font-size: 2rem; font-weight: 800; }
.subtitle { margin: 6px 0 0; color: #64748b; }
.table-panel { overflow: hidden; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; }
.state { padding: 48px; text-align: center; color: #64748b; }
.role-badge { display: inline-block; padding: 4px 9px; border-radius: 999px; font-size: .75rem; font-weight: 700; text-transform: uppercase; }
.role-badge.admin { color: #1d4ed8; background: #dbeafe; }
.role-badge.user { color: #047857; background: #d1fae5; }
.check-row { display: flex !important; align-items: center; cursor: pointer; }
.toggle-checkbox-label { display: inline-flex; align-items: center; gap: 10px; color: #cbd5e1; font-size: 0.88rem; font-weight: 500; cursor: pointer; user-select: none; margin-top: 4px; }
.custom-checkbox { width: 18px !important; height: 18px !important; accent-color: #2563eb; cursor: pointer; }
.form-error { margin: 0; color: #f87171; font-size: 0.85rem; font-weight: 500; }
</style>
