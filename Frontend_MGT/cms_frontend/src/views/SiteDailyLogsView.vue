<template>
  <div class="module-root">
    <!-- Header -->
    <header class="module-header">
      <div class="header-left">
        <div class="breadcrumb-trail">
          <span class="trail-item">MGM Workspace</span>
          <span class="trail-sep">/</span>
          <span class="trail-active">Site Daily Logs</span>
        </div>
        <h1 class="module-title">Site Operations & Daily Field Logs</h1>
        <p class="module-subtitle">Record daily construction site progress, weather conditions, active site headcount, and safety incidents.</p>
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
          <span>New Daily Log</span>
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
          <div class="kpi-num">{{ logs.length }}</div>
          <div class="kpi-label">Logged Field Days</div>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-icon bg-emerald">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
          </svg>
        </div>
        <div>
          <div class="kpi-num">{{ avgHeadcount }}</div>
          <div class="kpi-label">Avg Daily Site Headcount</div>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-icon bg-amber">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        </div>
        <div>
          <div class="kpi-num">{{ incidentsCount }}</div>
          <div class="kpi-label">Weather / Site Incidents</div>
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
          placeholder="Search logs by project, work done, reporter..."
        />
      </div>

      <div class="filter-pills">
        <button
          v-for="w in ['All', 'Clear', 'Rainy', 'Stormy']"
          :key="w"
          class="filter-pill"
          :class="{ active: currentWeather === w }"
          @click="currentWeather = w"
        >
          {{ w }}
        </button>
      </div>
    </div>

    <!-- Main Cards / Table -->
    <div class="content-box">
      <div class="table-responsive">
        <table class="premium-table">
          <thead>
            <tr>
              <th>Log Date</th>
              <th>Project Site</th>
              <th>Weather</th>
              <th>Headcount</th>
              <th>Work Summary</th>
              <th>Delays / Incidents</th>
              <th>Reporter</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="log in filteredLogs" :key="log.id">
              <td>
                <div class="fw-bold text-primary">{{ formatDate(log.log_date) }}</div>
              </td>
              <td>
                <span class="fw-semibold text-dark">{{ log.projectName || 'Site Operations' }}</span>
              </td>
              <td>
                <span class="weather-badge" :class="getWeatherClass(log.weather)">
                  {{ getWeatherIcon(log.weather) }} {{ log.weather }}
                </span>
              </td>
              <td>
                <span class="badge-headcount">{{ log.headcount }} Workers</span>
              </td>
              <td>
                <span class="text-slate font-13">{{ truncateText(log.work_summary, 70) }}</span>
              </td>
              <td>
                <span :class="log.delays_or_incidents && log.delays_or_incidents !== 'None reported.' ? 'text-danger fw-semibold' : 'text-muted font-12'">
                  {{ log.delays_or_incidents || 'None' }}
                </span>
              </td>
              <td>
                <span class="text-dark font-13">{{ log.reporterName || 'Site Supervisor' }}</span>
              </td>
              <td class="text-right">
                <div class="actions-cell">
                  <button type="button" @click="openEditModal(log)" class="btn-action edit" title="Edit Log">
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button type="button" @click="confirmDelete(log)" class="btn-action delete" title="Delete Log">
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="filteredLogs.length === 0">
              <td colspan="8" class="text-center py-4 text-muted">
                No site daily logs found.
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
                <h5 class="modal-title">{{ editingId ? 'Edit Daily Site Log' : 'New Daily Construction Site Log' }}</h5>
                <button type="button" class="btn-close-white d-flex align-items-center justify-content-center" @click="closeModal" aria-label="Close">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form @submit.prevent="saveLog">
                <div class="modal-body">
                  <div class="form-row mb-3">
                    <div class="col">
                      <label class="form-label">Project Site *</label>
                      <CustomSelect v-model="form.project_id" :options="projects" placeholder="Select Project" required />
                    </div>
                    <div class="col">
                      <label class="form-label">Log Date *</label>
                      <input v-model="form.log_date" type="date" class="form-control" required />
                    </div>
                  </div>

                  <div class="form-row mb-3">
                    <div class="col">
                      <label class="form-label">Weather Condition</label>
                      <CustomSelect 
                        v-model="form.weather" 
                        :options="[
                          { value: 'Clear', label: '☀️ Clear / Sunny' },
                          { value: 'Rainy', label: '🌧️ Rainy' },
                          { value: 'Stormy', label: '🌩️ Stormy' },
                          { value: 'Extreme Heat', label: '🔥 Extreme Heat' }
                        ]" 
                        placeholder="Select Weather" 
                        :allowClear="false" 
                      />
                    </div>
                    <div class="col">
                      <label class="form-label">Active Site Headcount (Workers)</label>
                      <input v-model.number="form.headcount" type="number" min="0" class="form-control" />
                    </div>
                  </div>

                  <div class="form-group mb-3">
                    <label class="form-label">Reported By (Staff Supervisor)</label>
                    <CustomSelect v-model="form.reported_by_staff_id" :options="staffList" placeholder="Select Supervisor" />
                  </div>

                  <div class="form-group mb-3">
                    <label class="form-label">Work Summary & Progress Achieved *</label>
                    <textarea v-model="form.work_summary" class="form-control" rows="3" placeholder="Describe operations completed today (e.g., concrete pouring, structural steel binding)..." required></textarea>
                  </div>

                  <div class="form-group mb-3">
                    <label class="form-label">Delays, Safety Notes or Incidents</label>
                    <textarea v-model="form.delays_or_incidents" class="form-control" rows="2" placeholder="Note weather delays, material shortages, or safety inspection results..."></textarea>
                  </div>
                </div>

                <div class="modal-footer">
                  <button type="button" class="btn-cancel" @click="closeModal">Cancel</button>
                  <button type="submit" class="btn-save" :disabled="saving">
                    {{ saving ? 'Saving...' : 'Save Site Log' }}
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
import { siteDailyLogsApi, projectsApi, staffApi } from '../services/api'
import { useAlert } from '../composables/useAlert'
import CustomSelect from '../components/CustomSelect.vue'

const { showSuccess, showError, showConfirm } = useAlert()

const logs = ref([])
const projects = ref([])
const staffList = ref([])
const loading = ref(false)
const saving = ref(false)
const showModal = ref(false)
const editingId = ref(null)

const searchQuery = ref('')
const currentWeather = ref('All')

const form = ref({
  project_id: null,
  log_date: new Date().toISOString().split('T')[0],
  weather: 'Clear',
  headcount: 30,
  work_summary: '',
  delays_or_incidents: '',
  reported_by_staff_id: null
})

const avgHeadcount = computed(() => {
  if (logs.value.length === 0) return 0
  const total = logs.value.reduce((acc, l) => acc + (Number(l.headcount) || 0), 0)
  return Math.round(total / logs.value.length)
})

const incidentsCount = computed(() => {
  return logs.value.filter(l => l.delays_or_incidents && l.delays_or_incidents !== 'None reported.' && l.delays_or_incidents.trim() !== '').length
})

const filteredLogs = computed(() => {
  return logs.value.filter(l => {
    const matchesSearch = 
      (l.projectName || '').toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (l.work_summary || '').toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (l.reporterName || '').toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesWeather = currentWeather.value === 'All' || l.weather === currentWeather.value
    return matchesSearch && matchesWeather
  })
})

const load = async () => {
  loading.value = true
  try {
    const [logsRes, projRes, staffRes] = await Promise.all([
      siteDailyLogsApi.getAll(),
      projectsApi.getAll(),
      staffApi.getAll()
    ])
    logs.value = logsRes.data || []
    projects.value = projRes.data || []
    staffList.value = staffRes.data || []
  } catch (err) {
    showError('Failed to load daily site logs.')
  } finally {
    loading.value = false
  }
}

const openAddModal = () => {
  editingId.value = null
  form.value = {
    project_id: projects.value[0]?.id || null,
    log_date: new Date().toISOString().split('T')[0],
    weather: 'Clear',
    headcount: 30,
    work_summary: '',
    delays_or_incidents: '',
    reported_by_staff_id: staffList.value[0]?.id || null
  }
  showModal.value = true
}

const openEditModal = (log) => {
  editingId.value = log.id
  form.value = {
    project_id: log.project_id,
    log_date: log.log_date ? log.log_date.split('T')[0] : '',
    weather: log.weather || 'Clear',
    headcount: log.headcount || 0,
    work_summary: log.work_summary || '',
    delays_or_incidents: log.delays_or_incidents || '',
    reported_by_staff_id: log.reported_by_staff_id || null
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const saveLog = async () => {
  saving.value = true
  try {
    if (editingId.value) {
      await siteDailyLogsApi.update(editingId.value, form.value)
      showSuccess('Site daily log updated successfully.')
    } else {
      await siteDailyLogsApi.create(form.value)
      showSuccess('Site daily log created successfully.')
    }
    closeModal()
    load()
  } catch (err) {
    showError(err.response?.data?.message || 'Failed to save site daily log.')
  } finally {
    saving.value = false
  }
}

const confirmDelete = async (log) => {
  const confirmed = await showConfirm({
    title: 'Delete Site Daily Log',
    message: `Are you sure you want to delete the daily log for date ${formatDate(log.log_date)}? This action cannot be undone.`,
    confirmText: 'Delete Log',
    type: 'danger'
  })
  if (!confirmed) return
  try {
    await siteDailyLogsApi.delete(log.id)
    showSuccess('Daily log deleted successfully.', 'Log Deleted')
    load()
  } catch (err) {
    showError(err.response?.data?.message || 'Failed to delete daily log.')
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const truncateText = (str, len) => {
  if (!str) return ''
  return str.length > len ? str.substring(0, len) + '...' : str
}

const getWeatherIcon = (w) => {
  const weather = (w || '').toLowerCase()
  if (weather.includes('rain')) return '🌧️'
  if (weather.includes('storm')) return '🌩️'
  if (weather.includes('heat')) return '🔥'
  return '☀️'
}

const getWeatherClass = (w) => {
  const weather = (w || '').toLowerCase()
  if (weather.includes('rain') || weather.includes('storm')) return 'weather-rain'
  return 'weather-clear'
}

onMounted(() => {
  load()
})
</script>

<style scoped>
.module-root { display: flex; flex-direction: column; gap: 24px; }
.module-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; }
.breadcrumb-trail { display: flex; align-items: center; gap: 8px; font-size: 0.8rem; color: #64748b; margin-bottom: 4px; }
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

.kpi-summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
.kpi-card { background: white; border-radius: 16px; padding: 20px; border: 1px solid #e2e8f0; display: flex; align-items: center; gap: 16px; }
.kpi-icon { width: 46px; height: 46px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
.bg-blue { background: rgba(59, 130, 246, 0.12); color: #2563eb; }
.bg-emerald { background: rgba(16, 185, 129, 0.12); color: #059669; }
.bg-amber { background: rgba(245, 158, 11, 0.12); color: #d97706; }
.kpi-num { font-size: 1.4rem; font-weight: 800; color: #0f172a; }
.kpi-label { font-size: 0.82rem; color: #64748b; font-weight: 500; }

.toolbar-box { background: white; border-radius: 14px; padding: 14px 18px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px; }
.search-input-wrap { position: relative; width: 320px; }
.search-icon { position: absolute; left: 12px; top: 12px; color: #94a3b8; }
.search-field { width: 100%; padding: 8px 12px 8px 36px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.88rem; outline: none; }
.filter-pills { display: flex; gap: 8px; flex-wrap: wrap; }
.filter-pill { background: #f1f5f9; border: none; color: #64748b; padding: 6px 14px; border-radius: 999px; font-size: 0.82rem; font-weight: 600; cursor: pointer; }
.filter-pill.active { background: #2563eb; color: white; }

.content-box { background: white; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; }
.premium-table { width: 100%; border-collapse: collapse; }
.premium-table th { background: #f8fafc; padding: 14px 16px; font-size: 0.8rem; font-weight: 700; color: #475569; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; text-align: left; }
.premium-table td { padding: 14px 16px; border-bottom: 1px solid #f1f5f9; font-size: 0.88rem; }

.weather-badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 999px; font-size: 0.78rem; font-weight: 600; }
.weather-clear { background: #fef3c7; color: #b45309; }
.weather-rain { background: #e0f2fe; color: #0369a1; }
.badge-headcount { background: #f1f5f9; color: #334155; padding: 4px 8px; border-radius: 6px; font-size: 0.8rem; font-weight: 600; }

.actions-cell { display: flex; gap: 6px; justify-content: flex-end; }
.btn-action { background: #f1f5f9; border: none; padding: 6px; border-radius: 6px; color: #64748b; cursor: pointer; }
.btn-action:hover { background: #e2e8f0; color: #0f172a; }
.btn-action.delete:hover { background: #fee2e2; color: #dc2626; }
</style>
