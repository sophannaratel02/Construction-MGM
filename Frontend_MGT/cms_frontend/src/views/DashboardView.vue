```vue
<template>
  <div class="dashboard-container">

    <!-- ================= HEADER ================= -->
    <header class="dashboard-header">
      <div class="header-content">
        <div>
          <div class="breadcrumb">
            <span>Workspace</span>
            <span class="breadcrumb-separator">/</span>
            <span class="active">Dashboard</span>
          </div>

          <h1 class="page-title">Dashboard</h1>
          <p class="page-subtitle">
            Overview of your construction projects and operations
          </p>
        </div>

        <button
          class="refresh-btn"
          @click="loadData"
          :disabled="isLoading"
        >
          <svg
            v-if="!isLoading"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M23 4v6h-6"/>
            <path d="M1 20v-6h6"/>
            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10"/>
            <path d="M20.49 15a9 9 0 01-14.85 3.36L1 14"/>
          </svg>

          <span
            v-else
            class="spinner"
          ></span>

          {{ isLoading ? 'Refreshing...' : 'Refresh Data' }}
        </button>
      </div>
    </header>


    <!-- ================= ERROR ================= -->
    <div
      v-if="errorMessage"
      class="error-alert"
    >
      <div class="error-content">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>

        <span>{{ errorMessage }}</span>
      </div>

      <button @click="errorMessage = ''">
        ×
      </button>
    </div>


    <!-- ================= STATISTICS ================= -->
    <section class="stats-grid">

      <!-- Projects -->
      <div class="stat-card">
        <div class="stat-top">
          <div>
            <p class="stat-label">Total Projects</p>
            <h2 class="stat-value">
              {{ stats.totalProjects }}
            </h2>
          </div>

          <div class="stat-icon blue">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M3 21h18"/>
              <path d="M5 21V7l7-4 7 4v14"/>
              <path d="M9 21v-6h6v6"/>
              <path d="M9 10h.01"/>
              <path d="M15 10h.01"/>
            </svg>
          </div>
        </div>

        <div class="stat-footer">
          <span class="trend positive">
            ↑ 12.5%
          </span>
          <span>vs last month</span>
        </div>
      </div>


      <!-- Staff -->
      <div class="stat-card">
        <div class="stat-top">
          <div>
            <p class="stat-label">Active Staff</p>
            <h2 class="stat-value">
              {{ stats.totalStaff }}
            </h2>
          </div>

          <div class="stat-icon green">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87"/>
              <path d="M16 3.13a4 4 0 010 7.75"/>
            </svg>
          </div>
        </div>

        <div class="stat-footer">
          <span class="trend positive">
            ↑ 8.2%
          </span>
          <span>vs last month</span>
        </div>
      </div>


      <!-- Equipment -->
      <div class="stat-card">
        <div class="stat-top">
          <div>
            <p class="stat-label">Equipment Units</p>
            <h2 class="stat-value">
              {{ stats.totalEquipment }}
            </h2>
          </div>

          <div class="stat-icon orange">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.5-3.5"/>
              <path d="M5 21l6-6"/>
              <path d="M3 3l6 6"/>
              <path d="M9 3l12 12"/>
              <path d="M16 16l5 5"/>
            </svg>
          </div>
        </div>

        <div class="stat-footer">
          <span class="availability">
            ● Available
          </span>
          <span>100%</span>
        </div>
      </div>


      <!-- Tasks -->
      <div class="stat-card">
        <div class="stat-top">
          <div>
            <p class="stat-label">Total Tasks</p>
            <h2 class="stat-value">
              {{ stats.totalTasks }}
            </h2>
          </div>

          <div class="stat-icon purple">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="M8 12l2.5 2.5L16 9"/>
            </svg>
          </div>
        </div>

        <div class="stat-footer">
          <span class="pending">
            {{ Math.min(8, stats.totalTasks) }} pending
          </span>
          <span>requires attention</span>
        </div>
      </div>

    </section>


    <!-- ================= PROJECTS ================= -->
    <section class="projects-card">

      <div class="section-header">

        <div>
          <h2>Recent Projects</h2>
          <p>Latest construction projects and their progress</p>
        </div>

        <button class="view-all-btn">
          View all
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M5 12h14"/>
            <path d="M12 5l7 7-7 7"/>
          </svg>
        </button>

      </div>


      <!-- Loading -->
      <div
        v-if="isLoading && !recentProjects.length"
        class="loading-state"
      >
        <div class="loading-spinner"></div>
        <p>Loading projects...</p>
      </div>


      <!-- Table -->
      <div
        v-else-if="recentProjects.length"
        class="table-wrapper"
      >

        <table class="projects-table">

          <thead>
            <tr>
              <th>Project</th>
              <th>Status</th>
              <th>Progress</th>
              <th>Start Date</th>
              <th class="text-right">Budget</th>
            </tr>
          </thead>

          <tbody>

            <tr
              v-for="project in recentProjects"
              :key="project.id"
            >

              <!-- Project -->
              <td>
                <div class="project-info">

                  <div class="project-avatar">
                    {{ (project.name || 'P').charAt(0).toUpperCase() }}
                  </div>

                  <div>
                    <div class="project-name">
                      {{ project.name || 'Unnamed Project' }}
                    </div>

                    <div class="project-id">
                      Project #{{ project.id }}
                    </div>
                  </div>

                </div>
              </td>


              <!-- Status -->
              <td>
                <span
                  :class="[
                    'status-badge',
                    getStatusBadgeClass(project.status)
                  ]"
                >
                  <span class="status-dot"></span>
                  {{ project.status || 'Unknown' }}
                </span>
              </td>


              <!-- Progress -->
              <td>

                <div class="progress-container">

                  <div class="progress-info">
                    <span>Progress</span>
                    <strong>
                      {{ project.progress || 0 }}%
                    </strong>
                  </div>

                  <div class="progress-track">
                    <div
                      class="progress-bar"
                      :style="{
                        width:
                          Math.min(
                            Math.max(project.progress || 0, 0),
                            100
                          ) + '%'
                      }"
                    ></div>
                  </div>

                </div>

              </td>


              <!-- Date -->
              <td>
                <div class="date-cell">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="18"
                      rx="2"
                    />
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>

                  {{ formatDate(project.startDate) }}
                </div>
              </td>


              <!-- Budget -->
              <td class="text-right">
                <span class="budget">
                  {{ formatCurrency(project.budget) }}
                </span>
              </td>

            </tr>

          </tbody>

        </table>

      </div>


      <!-- Empty -->
      <div
        v-else
        class="empty-state"
      >

        <div class="empty-icon">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="8" y1="13" x2="16" y2="13"/>
            <line x1="8" y1="17" x2="13" y2="17"/>
          </svg>
        </div>

        <h3>No projects found</h3>
        <p>
          Create your first construction project to get started.
        </p>

      </div>

    </section>

  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { dashboardApi, projectsApi } from '../services/api'

const stats = ref({
  totalProjects: 0,
  totalStaff: 0,
  totalEquipment: 0,
  totalTasks: 0,
})

const recentProjects = ref([])
const isLoading = ref(false)
const errorMessage = ref('')


const loadData = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const [statsRes, projectsRes] = await Promise.all([
      dashboardApi.getStats(),
      projectsApi.getAll()
    ])

    if (statsRes?.data) {
      stats.value = statsRes.data
    }

    if (Array.isArray(projectsRes?.data)) {
      recentProjects.value = projectsRes.data.slice(0, 5)
    }

  } catch (error) {
    console.error('Failed to load dashboard data:', error)

    errorMessage.value =
      'Failed to sync dashboard data. Please check your network connection.'

  } finally {
    isLoading.value = false
  }
}


const getStatusBadgeClass = (status) => {

  const classes = {
    Active: 'status-active',
    Pending: 'status-pending',
    Completed: 'status-completed',
    'On Hold': 'status-hold'
  }

  return classes[status] || 'status-default'
}


const formatDate = (dateString) => {

  if (!dateString) return 'N/A'

  const date = new Date(dateString)

  if (isNaN(date.getTime())) {
    return 'Invalid Date'
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
}


const formatCurrency = (amount) => {

  if (typeof amount !== 'number' && !amount) {
    return '$0'
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount)
}


onMounted(loadData)
</script>


<style scoped>

/* =========================================================
   GLOBAL
========================================================= */

.dashboard-container {
  width: 100%;
  max-width: 1500px;
  margin: 0 auto;
  padding: 28px 32px 40px;
  color: #172033;
}


/* =========================================================
   HEADER
========================================================= */

.dashboard-header {
  margin-bottom: 28px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 24px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  font-size: 13px;
  color: #94a3b8;
}

.breadcrumb .active {
  color: #64748b;
}

.breadcrumb-separator {
  color: #cbd5e1;
}

.page-title {
  margin: 0;
  font-size: 30px;
  font-weight: 750;
  letter-spacing: -0.8px;
  color: #111827;
}

.page-subtitle {
  margin: 7px 0 0;
  font-size: 14px;
  color: #64748b;
}


/* =========================================================
   REFRESH BUTTON
========================================================= */

.refresh-btn {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  border: 1px solid #dbe3ed;
  background: #ffffff;
  color: #334155;
  padding: 10px 16px;
  border-radius: 9px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all .2s ease;
}

.refresh-btn:hover:not(:disabled) {
  border-color: #2563eb;
  color: #2563eb;
  background: #f8fbff;
}

.refresh-btn:disabled {
  opacity: .65;
  cursor: not-allowed;
}


/* =========================================================
   ERROR
========================================================= */

.error-alert {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 13px 16px;
  margin-bottom: 24px;
  border: 1px solid #fecaca;
  border-radius: 10px;
  background: #fff7f7;
  color: #b91c1c;
  font-size: 14px;
}

.error-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.error-alert button {
  border: 0;
  background: transparent;
  color: #b91c1c;
  font-size: 22px;
  cursor: pointer;
}


/* =========================================================
   STATISTICS
========================================================= */

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
  margin-bottom: 24px;
}

.stat-card {
  background: #ffffff;
  border: 1px solid #e8edf3;
  border-radius: 14px;
  padding: 21px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, .025);
  transition: transform .2s ease, box-shadow .2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(15, 23, 42, .07);
}

.stat-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.stat-label {
  margin: 0 0 9px;
  font-size: 12px;
  font-weight: 650;
  color: #64748b;
}

.stat-value {
  margin: 0;
  font-size: 30px;
  line-height: 1;
  font-weight: 750;
  letter-spacing: -1px;
  color: #111827;
}

.stat-icon {
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 11px;
}

.stat-icon.blue {
  color: #2563eb;
  background: #eff6ff;
}

.stat-icon.green {
  color: #059669;
  background: #ecfdf5;
}

.stat-icon.orange {
  color: #d97706;
  background: #fffbeb;
}

.stat-icon.purple {
  color: #7c3aed;
  background: #f5f3ff;
}

.stat-footer {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-top: 18px;
  font-size: 12px;
  color: #94a3b8;
}

.trend {
  font-weight: 650;
}

.trend.positive {
  color: #059669;
}

.availability {
  color: #059669;
  font-weight: 600;
}

.pending {
  color: #d97706;
  font-weight: 600;
}


/* =========================================================
   PROJECT CARD
========================================================= */

.projects-card {
  background: #ffffff;
  border: 1px solid #e8edf3;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(15, 23, 42, .025);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 24px;
  border-bottom: 1px solid #edf1f5;
}

.section-header h2 {
  margin: 0;
  font-size: 17px;
  font-weight: 700;
  color: #111827;
}

.section-header p {
  margin: 5px 0 0;
  font-size: 13px;
  color: #94a3b8;
}

.view-all-btn {
  display: flex;
  align-items: center;
  gap: 7px;
  border: 0;
  background: transparent;
  color: #2563eb;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.view-all-btn:hover {
  color: #1d4ed8;
}


/* =========================================================
   TABLE
========================================================= */

.table-wrapper {
  overflow-x: auto;
}

.projects-table {
  width: 100%;
  min-width: 850px;
  border-collapse: collapse;
}

.projects-table thead {
  background: #f8fafc;
}

.projects-table th {
  padding: 13px 24px;
  border-bottom: 1px solid #e8edf3;
  text-align: left;
  color: #64748b;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .06em;
}

.projects-table td {
  padding: 17px 24px;
  border-bottom: 1px solid #f1f4f7;
  font-size: 13px;
  color: #475569;
}

.projects-table tbody tr {
  transition: background .15s ease;
}

.projects-table tbody tr:hover {
  background: #fafcff;
}

.projects-table tbody tr:last-child td {
  border-bottom: 0;
}


/* =========================================================
   PROJECT INFO
========================================================= */

.project-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.project-avatar {
  width: 39px;
  height: 39px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 9px;
  background: #eff6ff;
  color: #2563eb;
  font-size: 14px;
  font-weight: 700;
}

.project-name {
  color: #1e293b;
  font-size: 13px;
  font-weight: 650;
}

.project-id {
  margin-top: 3px;
  color: #94a3b8;
  font-size: 11px;
}


/* =========================================================
   STATUS
========================================================= */

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 650;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.status-active {
  background: #ecfdf5;
  color: #047857;
}

.status-active .status-dot {
  background: #10b981;
}

.status-pending {
  background: #fffbeb;
  color: #b45309;
}

.status-pending .status-dot {
  background: #f59e0b;
}

.status-completed {
  background: #eff6ff;
  color: #1d4ed8;
}

.status-completed .status-dot {
  background: #3b82f6;
}

.status-hold {
  background: #fef2f2;
  color: #b91c1c;
}

.status-hold .status-dot {
  background: #ef4444;
}

.status-default {
  background: #f1f5f9;
  color: #475569;
}

.status-default .status-dot {
  background: #94a3b8;
}


/* =========================================================
   PROGRESS
========================================================= */

.progress-container {
  width: 190px;
}

.progress-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 7px;
  font-size: 11px;
  color: #94a3b8;
}

.progress-info strong {
  color: #475569;
  font-weight: 650;
}

.progress-track {
  width: 100%;
  height: 6px;
  overflow: hidden;
  border-radius: 999px;
  background: #e9eef5;
}

.progress-bar {
  height: 100%;
  border-radius: inherit;
  background: #2563eb;
  transition: width .4s ease;
}


/* =========================================================
   DATE
========================================================= */

.date-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  white-space: nowrap;
}


/* =========================================================
   BUDGET
========================================================= */

.budget {
  color: #1e293b;
  font-weight: 700;
}


/* =========================================================
   EMPTY / LOADING
========================================================= */

.loading-state,
.empty-state {
  padding: 65px 20px;
  text-align: center;
}

.loading-state p {
  margin: 12px 0 0;
  color: #94a3b8;
  font-size: 13px;
}

.loading-spinner,
.spinner {
  border: 2px solid #dbeafe;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin .7s linear infinite;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  margin: 0 auto;
}

.spinner {
  width: 15px;
  height: 15px;
}

.empty-icon {
  width: 58px;
  height: 58px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
  border-radius: 14px;
  background: #f8fafc;
  color: #94a3b8;
}

.empty-state h3 {
  margin: 0 0 6px;
  font-size: 15px;
  color: #334155;
}

.empty-state p {
  margin: 0;
  color: #94a3b8;
  font-size: 13px;
}


/* =========================================================
   UTILITIES
========================================================= */

.text-right {
  text-align: right !important;
}


/* =========================================================
   ANIMATION
========================================================= */

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}


/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 1200px) {

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

}


@media (max-width: 768px) {

  .dashboard-container {
    padding: 20px 16px 30px;
  }

  .header-content {
    align-items: flex-start;
    flex-direction: column;
  }

  .refresh-btn {
    width: 100%;
    justify-content: center;
  }

  .page-title {
    font-size: 26px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .section-header {
    align-items: flex-start;
    flex-direction: column;
    gap: 14px;
  }

  .view-all-btn {
    padding: 0;
  }

}


@media (max-width: 480px) {

  .dashboard-container {
    padding: 16px 12px 24px;
  }

  .stat-card {
    padding: 18px;
  }

  .stat-value {
    font-size: 26px;
  }

}

</style>
```
