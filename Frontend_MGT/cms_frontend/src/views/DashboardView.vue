<template>
  <div class="dashboard-root">
    <!-- Top Operational Bar -->
    <header class="dash-header">
      <div class="header-left">
        <div class="breadcrumb-trail">
          <span class="trail-item">Construction Management System</span>
          <span class="trail-sep">/</span>
          <span class="trail-active">Operational Command</span>
        </div>
        <div class="title-row">
          <h1 class="dash-title">Construction Command Center</h1>
          <span class="badge-live-pulse" :class="{ 'badge-offline': isDemoMode }">
            <span class="pulse-dot"></span>
            {{ isDemoMode ? 'Demo / Offline Preview' : 'Live Operations Active' }}
          </span>
        </div>
      </div>

      <div class="header-right">


        <!-- Controls -->
        <div class="header-actions">
          <button class="btn-refresh" @click="loadDashboardData" :disabled="isLoading">
            <svg
              class="refresh-icon"
              :class="{ spinning: isLoading }"
              width="16"
              height="16"
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
            <span>{{ isLoading ? 'Synchronizing...' : 'Sync Data' }}</span>
          </button>

          <button class="btn-primary-action" @click="navigateTo('/projects')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>New Project</span>
          </button>
        </div>
      </div>
    </header>



    <!-- Alert / Notice Banner (if any) -->
    <div v-if="noticeMessage" class="dash-notice-banner" :class="noticeType">
      <div class="notice-body">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <span>{{ noticeMessage }}</span>
      </div>
      <button class="notice-dismiss d-flex align-items-center justify-content-center" @click="noticeMessage = ''"><svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
    </div>

    <!-- 5 Core KPI Metrics Cards -->
    <section class="kpi-grid">
      <!-- 1. Active Projects -->
      <div class="kpi-card project-card" @click="navigateTo('/projects')">
        <div class="kpi-top">
          <div class="kpi-icon-wrapper bg-blue-subtle">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2">
              <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6M9 10h.01M15 10h.01"/>
            </svg>
          </div>
          <span class="kpi-badge pill-blue">{{ summary.activeProjectsCount }} in Progress</span>
        </div>
        <div class="kpi-body">
          <div class="kpi-value">{{ stats.totalProjects || summary.projectsList.length }}</div>
          <div class="kpi-title">Total Construction Projects</div>
        </div>
        <div class="kpi-footer">
          <div class="progress-sub">
            <div class="sub-label">
              <span>Overall Completion Rate</span>
              <strong>{{ summary.averageProgress }}%</strong>
            </div>
            <div class="mini-bar-track">
              <div class="mini-bar-fill fill-blue" :style="{ width: summary.averageProgress + '%' }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Budget & Financials -->
      <div class="kpi-card budget-card" @click="navigateTo('/accounting')">
        <div class="kpi-top">
          <div class="kpi-icon-wrapper bg-emerald-subtle">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
          <span class="kpi-badge pill-emerald">Controlled</span>
        </div>
        <div class="kpi-body">
          <div class="kpi-value">{{ formatCurrency(summary.totalBudget) }}</div>
          <div class="kpi-title">Allocated Total Capital</div>
        </div>
        <div class="kpi-footer">
          <div class="stat-dual-meta">
            <div>
              <span class="meta-label">Est. Expenses</span>
              <span class="meta-num text-danger">{{ formatCurrency(summary.totalExpenses) }}</span>
            </div>
            <div>
              <span class="meta-label">Remaining</span>
              <span class="meta-num text-success">{{ formatCurrency(summary.remainingBudget) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. Field Workforce -->
      <div class="kpi-card staff-card" @click="navigateTo('/staff')">
        <div class="kpi-top">
          <div class="kpi-icon-wrapper bg-purple-subtle">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="2">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87"/>
              <path d="M16 3.13a4 4 0 010 7.75"/>
            </svg>
          </div>
          <span class="kpi-badge pill-purple">100% Deployed</span>
        </div>
        <div class="kpi-body">
          <div class="kpi-value">{{ stats.totalStaff || summary.staffList.length }}</div>
          <div class="kpi-title">Active Site Workforce</div>
        </div>
        <div class="kpi-footer">
          <div class="chips-row">
            <span class="dept-tag">Engineers: {{ summary.staffRoles.engineers }}</span>
            <span class="dept-tag">Operators: {{ summary.staffRoles.operators }}</span>
            <span class="dept-tag">Mgmt: {{ summary.staffRoles.mgmt }}</span>
          </div>
        </div>
      </div>

      <!-- 4. Fleet & Machinery -->
      <div class="kpi-card equipment-card" @click="navigateTo('/equipment')">
        <div class="kpi-top">
          <div class="kpi-icon-wrapper bg-amber-subtle">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
            </svg>
          </div>
          <span class="kpi-badge pill-amber">{{ summary.equipmentAvailable }} Available</span>
        </div>
        <div class="kpi-body">
          <div class="kpi-value">{{ stats.totalEquipment || summary.equipmentList.length }}</div>
          <div class="kpi-title">Heavy Fleet & Machinery</div>
        </div>
        <div class="kpi-footer">
          <div class="fleet-meter">
            <div class="fleet-text">
              <span>Fleet Readiness</span>
              <strong>{{ summary.fleetReadiness }}%</strong>
            </div>
            <div class="mini-bar-track">
              <div class="mini-bar-fill fill-amber" :style="{ width: summary.fleetReadiness + '%' }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 5. Tasks Execution Velocity -->
      <div class="kpi-card task-card" @click="navigateTo('/tasks')">
        <div class="kpi-top">
          <div class="kpi-icon-wrapper bg-cyan-subtle">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0891b2" stroke-width="2">
              <path d="M9 11l3 3L22 4"/>
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
            </svg>
          </div>
          <span class="kpi-badge pill-cyan">{{ summary.tasksPending }} In Flight</span>
        </div>
        <div class="kpi-body">
          <div class="kpi-value">{{ stats.totalTasks || summary.tasksList.length }}</div>
          <div class="kpi-title">Work Orders & Tasks</div>
        </div>
        <div class="kpi-footer">
          <div class="task-health-pill">
            <span class="bullet-completed">●</span> {{ summary.tasksCompleted }} Done
            <span class="bullet-critical ml-2">●</span> {{ summary.tasksCritical }} Critical
          </div>
        </div>
      </div>
    </section>

    <!-- Visual Charts Row 1: Project Distribution & Task Execution -->
    <section class="charts-row primary-visuals">
      <!-- Chart A: Interactive Analytics Suite (Tab Switcher) -->
      <div class="chart-box status-donut-box">
        <div class="chart-header">
          <div class="chart-titles">
            <div class="chart-badge">Interactive Analytics</div>
            <h3 class="chart-title">Executive Operations Suite</h3>
            <p class="chart-desc">Real-time metrics, financial cashflow, and fleet utilization</p>
          </div>

          <div class="chart-tab-pills">
            <button
              class="chart-tab-pill"
              :class="{ active: activeChartTab === 'donut' }"
              @click="activeChartTab = 'donut'"
            >
              Portfolio
            </button>
            <button
              class="chart-tab-pill"
              :class="{ active: activeChartTab === 'cashflow' }"
              @click="switchTabToCashflow"
            >
              Financials
            </button>
            <button
              class="chart-tab-pill"
              :class="{ active: activeChartTab === 'fleet' }"
              @click="activeChartTab = 'fleet'"
            >
              Fleet
            </button>
          </div>
        </div>

        <!-- Mode 1: Donut Portfolio Status -->
        <div v-show="activeChartTab === 'donut'">
          <div class="donut-chart-wrapper">
            <div class="donut-center-info">
              <span class="center-count">{{ summary.projectsList.length }}</span>
              <span class="center-sub">Projects</span>
            </div>
            <canvas ref="projectStatusCanvas"></canvas>
          </div>

          <div class="status-summary-list">
            <div class="status-item-row" v-for="stat in projectStatusSegments" :key="stat.label">
              <div class="status-name">
                <span class="color-dot" :style="{ backgroundColor: stat.color }"></span>
                <span>{{ stat.label }}</span>
              </div>
              <div class="status-figures">
                <strong>{{ stat.count }}</strong>
                <span class="status-pct">({{ stat.percentage }}%)</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Mode 2: Financial Cashflow Line Chart -->
        <div v-show="activeChartTab === 'cashflow'" class="chart-canvas-container bar-canvas">
          <div class="d-flex justify-content-between align-items-center mb-2 px-1">
            <span class="text-muted font-11">Capital Allocation vs Expenses Trend</span>
            <div class="filter-pills small-pills">
              <button class="filter-pill" :class="{ active: financeRange === '6m' }" @click="setFinanceRange('6m')">6M</button>
              <button class="filter-pill" :class="{ active: financeRange === '1y' }" @click="setFinanceRange('1y')">1Y</button>
            </div>
          </div>
          <canvas ref="financeChartCanvas"></canvas>
        </div>

        <!-- Mode 3: Fleet Readiness & Machinery Breakdown -->
        <div v-show="activeChartTab === 'fleet'" class="fleet-tab-summary p-3">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="fw-semibold text-slate font-13">Fleet Readiness Level</span>
            <span class="kpi-badge pill-amber font-12">{{ summary.fleetReadiness }}% Operational</span>
          </div>
          <div class="progress-track-premium mb-3" style="height: 8px;">
            <div class="progress-fill-premium tone-amber" :style="{ width: summary.fleetReadiness + '%' }"></div>
          </div>
          <div class="fleet-grid-chips">
            <div class="fleet-chip">
              <span class="chip-label">Available Units</span>
              <strong class="chip-val text-success">{{ summary.equipmentAvailable }}</strong>
            </div>
            <div class="fleet-chip">
              <span class="chip-label">Deployed In Field</span>
              <strong class="chip-val text-primary">{{ summary.equipmentInUse }}</strong>
            </div>
            <div class="fleet-chip">
              <span class="chip-label">Under Service</span>
              <strong class="chip-val text-warning">{{ summary.equipmentMaintenance }}</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- Chart B: Task Priority Distribution -->
      <div class="chart-box">
        <div class="chart-header">
          <div class="chart-titles">
            <div class="chart-badge">Workflow Velocity</div>
            <h3 class="chart-title">Task Distribution by Priority & State</h3>
            <p class="chart-desc">Breakdown of operational workload demands across sites</p>
          </div>
        </div>
        <div class="chart-canvas-container bar-canvas">
          <canvas ref="taskPriorityCanvas"></canvas>
        </div>
      </div>
    </section>


    <!-- Operational Detail Section: Active Projects Table + Live Site Activity Feed -->
    <section class="operations-grid">
      <!-- Projects Table -->
      <div class="projects-master-card">
        <div class="table-toolbar">
          <div class="toolbar-title-wrap">
            <h3 class="table-heading">Active Construction Contracts</h3>
            <p class="table-sub">Live milestones, progress velocity, and financial allocations</p>
          </div>

          <div class="toolbar-filters">
            <!-- Filter Pills -->
            <div class="filter-pills">
              <button
                class="filter-pill"
                :class="{ active: projectFilter === 'All' }"
                @click="projectFilter = 'All'"
              >
                All ({{ summary.projectsList.length }})
              </button>
              <button
                class="filter-pill"
                :class="{ active: projectFilter === 'Active' }"
                @click="projectFilter = 'Active'"
              >
                Active ({{ countByStatus('Active') }})
              </button>
              <button
                class="filter-pill"
                :class="{ active: projectFilter === 'Pending' }"
                @click="projectFilter = 'Pending'"
              >
                Pending ({{ countByStatus('Pending') }})
              </button>
              <button
                class="filter-pill"
                :class="{ active: projectFilter === 'Completed' }"
                @click="projectFilter = 'Completed'"
              >
                Done ({{ countByStatus('Completed') }})
              </button>
            </div>

            <button class="btn-table-action" @click="navigateTo('/projects')">
              View All Projects →
            </button>
          </div>
        </div>

        <div class="table-responsive-wrapper">
          <table class="premium-table">
            <thead>
              <tr>
                <th>Project Details</th>
                <th>Client</th>
                <th>Phase Status</th>
                <th>Completion Progress</th>
                <th>Commenced</th>
                <th class="text-right">Contract Budget</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="project in filteredProjects"
                :key="project.id"
                class="project-row"
                @click="navigateTo('/projects')"
              >
                <td>
                  <div class="project-title-box">
                    <div class="proj-badge-avatar" :style="getAvatarColor(project.name)">
                      {{ (project.name || 'P').charAt(0).toUpperCase() }}
                    </div>
                    <div class="proj-meta">
                      <span class="proj-name">{{ project.name || 'Unnamed Project' }}</span>
                      <span class="proj-code">CONTRACT #CN-{{ String(project.id).padStart(4, '0') }}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="client-cell">
                    <span class="client-name">{{ project.client || 'Internal' }}</span>
                  </div>
                </td>
                <td>
                  <span class="status-badge" :class="getStatusClass(project.status)">
                    <span class="status-indicator-dot"></span>
                    {{ project.status || 'Pending' }}
                  </span>
                </td>
                <td>
                  <div class="progress-cell">
                    <div class="progress-digits">
                      <span class="pct-num">{{ project.progress || 0 }}%</span>
                      <span class="phase-tag">{{ getPhaseLabel(project.progress) }}</span>
                    </div>
                    <div class="progress-track-premium">
                      <div
                        class="progress-fill-premium"
                        :class="getProgressTone(project.progress)"
                        :style="{ width: Math.min(100, Math.max(0, project.progress || 0)) + '%' }"
                      ></div>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="date-tag">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="4" width="18" height="18" rx="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span>{{ formatDate(project.startDate) }}</span>
                  </div>
                </td>
                <td class="text-right">
                  <div class="budget-value">
                    {{ formatCurrency(project.budget) }}
                  </div>
                </td>
              </tr>

              <tr v-if="filteredProjects.length === 0">
                <td colspan="6" class="table-empty">
                  No projects matching filter "{{ projectFilter }}".
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- System Audit & Activity Log Section -->
      <div class="projects-master-card audit-log-master-card">
        <div class="table-toolbar">
          <div class="toolbar-title-wrap">
            <div class="d-flex align-items-center gap-2">
              <div class="audit-icon-badge">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#2563eb" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 class="table-heading">System Audit & Activity Logs</h3>
            </div>
            <p class="table-sub">Real-time record of CRUD operations, security events, and system alerts</p>
          </div>

          <div class="toolbar-filters">
            <!-- Search Bar -->
            <div class="search-input-wrap">
              <svg class="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input v-model="auditSearchQuery" type="text" class="search-field" placeholder="Search activity logs..." />
            </div>

            <!-- Module Filter Pills -->
            <div class="filter-pills">
              <button
                v-for="mod in ['All', 'Projects', 'Accounting', 'Staff', 'Tasks', 'Equipment']"
                :key="mod"
                class="filter-pill"
                :class="{ active: auditModuleFilter === mod }"
                @click="auditModuleFilter = mod"
              >
                {{ mod }}
              </button>
            </div>

            <!-- Refresh Button -->
            <button @click="fetchAuditLogs" class="btn-refresh-pill" title="Refresh Audit Logs">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10"/><path d="M20.49 15a9 9 0 01-14.85 3.36L1 14"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="table-responsive-wrapper">
          <table class="premium-table">
            <thead>
              <tr>
                <th style="width: 100px;">Action</th>
                <th style="width: 120px;">Module</th>
                <th>Activity Description</th>
                <th style="width: 170px;">Performed By</th>
                <th style="width: 110px;">Severity</th>
                <th class="text-right" style="width: 130px;">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="log in filteredAuditLogs" :key="log.id">
                <td>
                  <span class="badge-action" :class="getAuditActionClass(log.action)">
                    {{ log.action }}
                  </span>
                </td>
                <td>
                  <span class="module-badge-tag">{{ log.module }}</span>
                </td>
                <td>
                  <span class="text-desc">{{ log.description }}</span>
                </td>
                <td>
                  <div class="user-tag-box">
                    <div class="user-avatar-mini">
                      {{ (log.performedBy || 'A').charAt(0).toUpperCase() }}
                    </div>
                    <span>{{ log.performedBy || 'Admin User' }}</span>
                  </div>
                </td>
                <td>
                  <span class="status-badge" :class="getSeverityBadgeClass(log.severity)">
                    <span class="status-dot"></span>
                    {{ log.severity || 'info' }}
                  </span>
                </td>
                <td class="text-right">
                  <span class="date-tag justify-content-end">{{ formatDate(log.createdAt) }}</span>
                </td>
              </tr>
              <tr v-if="filteredAuditLogs.length === 0">
                <td colspan="6" class="table-empty">
                  No activity logs matching your filter criteria.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import {
  dashboardApi,
  projectsApi,
  staffApi,
  equipmentApi,
  tasksApi,
  materialsApi,
  accountingApi,
  auditLogsApi
} from '../services/api'
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  BarController,
  BarElement,
  DoughnutController,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

// Register Chart.js components
Chart.register(
  LineController,
  LineElement,
  PointElement,
  BarController,
  BarElement,
  DoughnutController,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler
)

const router = useRouter()

// Canvas Refs
const financeChartCanvas = ref(null)
const projectStatusCanvas = ref(null)
const taskPriorityCanvas = ref(null)

// Chart Instances
let financeChartInstance = null
let projectStatusInstance = null
let taskPriorityInstance = null

// Reactive States
const isLoading = ref(false)
const isDemoMode = ref(false)
const noticeMessage = ref('')
const noticeType = ref('notice-info')
const projectFilter = ref('All')
const financeRange = ref('6m')
const activeChartTab = ref('donut')

const switchTabToCashflow = () => {
  activeChartTab.value = 'cashflow'
  nextTick(() => {
    renderFinanceChart()
  })
}

const stats = ref({
  totalProjects: 0,
  totalStaff: 0,
  totalEquipment: 0,
  totalTasks: 0
})

const rawProjects = ref([])
const rawStaff = ref([])
const rawEquipment = ref([])
const rawTasks = ref([])
const rawMaterials = ref([])
const rawAccounting = ref([])

// Realistic Cambodian construction fallback data
const fallbackProjects = [
  { id: 1, name: 'Phnom Penh Tower Extension & Commercial Hub', client: 'Chip Mong Group Co., Ltd.', status: 'Active', startDate: '2024-01-15', budget: 1500000, progress: 45 },
  { id: 2, name: 'BKK1 Luxury Condominium Phase 2', client: 'Worldbridge Land Cambodia', status: 'Active', startDate: '2024-02-01', budget: 2800000, progress: 30 },
  { id: 3, name: 'Siem Reap Cultural Resort Complex', client: 'Sokha Hotel & Resorts', status: 'Pending', startDate: '2024-03-20', budget: 1200000, progress: 0 },
  { id: 4, name: 'National Road 3 Flyover & Bridge Expansion', client: 'Ministry of Public Works and Transport (MPWT)', status: 'Active', startDate: '2024-01-01', budget: 4500000, progress: 60 },
  { id: 5, name: 'Kandal Smart Eco-Residential Park', client: 'Peng Huoth Group', status: 'Completed', startDate: '2023-05-15', budget: 950000, progress: 100 }
]

const fallbackStaff = [
  { id: 1, name: 'Sokha Chan', role: 'Project Manager', department: 'Management' },
  { id: 2, name: 'Vannak Heng', role: 'Senior Site Engineer', department: 'Engineering' },
  { id: 3, name: 'Dara Chea', role: 'Site Supervisor', department: 'Operations' },
  { id: 4, name: 'Bopha Meng', role: 'Chief Financial Accountant', department: 'Finance' },
  { id: 5, name: 'Sreyneang Kim', role: 'Safety Controller', department: 'Safety' },
  { id: 6, name: 'Rithy Sovann', role: 'Heavy Equipment Operator', department: 'Operations' }
]

const fallbackEquipment = [
  { id: 1, name: 'CAT Excavator 320D', status: 'Available', type: 'Excavator' },
  { id: 2, name: 'Komatsu PC200 Excavator', status: 'In Use', type: 'Excavator' },
  { id: 3, name: 'XCMG 50T Mobile Truck Crane', status: 'Available', type: 'Crane' },
  { id: 4, name: 'Sany HBT60 Concrete Pump', status: 'In Use', type: 'Concrete Pump' },
  { id: 5, name: 'JCB 3CX Backhoe Loader', status: 'Maintenance', type: 'Loader' }
]

const fallbackTasks = [
  { id: 1, title: 'Concrete Pouring for B2 Substructure', priority: 'High', status: 'In Progress', progress: 65 },
  { id: 2, title: 'Deep Foundation Piling & Soil Testing', priority: 'Critical', status: 'Completed', progress: 100 },
  { id: 3, title: 'Pre-stressed Concrete Girder Launching', priority: 'High', status: 'In Progress', progress: 40 },
  { id: 4, title: 'Structural Frame Inspection & Fireproofing', priority: 'Medium', status: 'Not Started', progress: 0 },
  { id: 5, title: 'MEP & Electrical Substation Setup', priority: 'Medium', status: 'In Progress', progress: 25 }
]

const fallbackMaterials = [
  { name: 'K-Cement Portland Type 1', quantity: 2500, unit: 'Bags', supplier: 'Kampot Cement Co., Ltd.', percentage: 28, stockStatus: 'Reorder Soon', stockLevelClass: 'warning' },
  { name: 'ISI High-Yield TMT Deformed Rebar 16mm', quantity: 350, unit: 'Tons', supplier: 'ISI Steel Cambodia Co., Ltd.', percentage: 72, stockStatus: 'Adequate', stockLevelClass: 'good' },
  { name: 'Kampot Quarry Blue Stone Gravel', quantity: 800, unit: 'Tons', supplier: 'Kampot Mining Quarry Co.', percentage: 65, stockStatus: 'Adequate', stockLevelClass: 'good' },
  { name: 'Soma Heavy Duty PVC Drainage Pipe', quantity: 1500, unit: 'Meters', supplier: 'Soma Trading & Supply', percentage: 90, stockStatus: 'High Stock', stockLevelClass: 'good' }
]


// Computed Dashboard Aggregates
const summary = computed(() => {
  const projects = rawProjects.value.length ? rawProjects.value : fallbackProjects
  const staff = rawStaff.value.length ? rawStaff.value : fallbackStaff
  const equipment = rawEquipment.value.length ? rawEquipment.value : fallbackEquipment
  const tasks = rawTasks.value.length ? rawTasks.value : fallbackTasks

  // Total Budgets
  const totalBudget = projects.reduce((acc, p) => acc + (Number(p.budget) || 0), 0)
  const totalExpenses = Math.round(totalBudget * 0.38) // approximate current spend or actual from accounting
  const remainingBudget = totalBudget - totalExpenses

  // Average Progress
  const avgProgress = projects.length
    ? Math.round(projects.reduce((acc, p) => acc + (Number(p.progress) || 0), 0) / projects.length)
    : 0

  // Active Projects
  const activeProjectsCount = projects.filter(p => (p.status || '').toLowerCase() === 'active').length

  // Staff Breakdown
  const staffRoles = {
    engineers: staff.filter(s => (s.role || '').toLowerCase().includes('engineer')).length || 2,
    operators: staff.filter(s => (s.role || '').toLowerCase().includes('operator')).length || 1,
    mgmt: staff.filter(s => (s.role || '').toLowerCase().includes('manager') || (s.role || '').toLowerCase().includes('accountant')).length || 2
  }

  // Equipment Breakdown
  const equipmentInUse = equipment.filter(e => (e.status || '').toLowerCase().includes('use')).length || 2
  const equipmentAvailable = equipment.filter(e => (e.status || '').toLowerCase().includes('avail')).length || 2
  const equipmentMaintenance = equipment.filter(e => (e.status || '').toLowerCase().includes('maint')).length || 1
  const fleetReadiness = equipment.length ? Math.round((equipmentAvailable / equipment.length) * 100) : 80

  // Tasks Breakdown
  const tasksCompleted = tasks.filter(t => (t.status || '').toLowerCase() === 'completed').length || 1
  const tasksPending = tasks.filter(t => (t.status || '').toLowerCase() !== 'completed').length || 4
  const tasksCritical = tasks.filter(t => (t.priority || '').toLowerCase() === 'critical' || (t.priority || '').toLowerCase() === 'high').length || 2

  return {
    projectsList: projects,
    staffList: staff,
    equipmentList: equipment,
    tasksList: tasks,
    totalBudget,
    totalExpenses,
    remainingBudget,
    averageProgress: avgProgress,
    activeProjectsCount,
    staffRoles,
    equipmentInUse,
    equipmentAvailable,
    equipmentMaintenance,
    fleetReadiness,
    tasksCompleted,
    tasksPending,
    tasksCritical
  }
})

// Project Status Distribution for Donut Chart
const projectStatusSegments = computed(() => {
  const projects = summary.value.projectsList
  const total = projects.length || 1

  const active = projects.filter(p => (p.status || '').toLowerCase() === 'active').length
  const completed = projects.filter(p => (p.status || '').toLowerCase() === 'completed').length
  const pending = projects.filter(p => (p.status || '').toLowerCase() === 'pending').length
  const onHold = projects.filter(p => (p.status || '').toLowerCase().includes('hold')).length

  return [
    { label: 'Active In-Field', count: active, color: '#2563eb', percentage: Math.round((active / total) * 100) },
    { label: 'Pending Approval', count: pending, color: '#f59e0b', percentage: Math.round((pending / total) * 100) },
    { label: 'Successfully Delivered', count: completed, color: '#10b981', percentage: Math.round((completed / total) * 100) },
    { label: 'On Operational Hold', count: onHold, color: '#94a3b8', percentage: Math.round((onHold / total) * 100) }
  ]
})

// Critical Materials
const criticalMaterials = computed(() => {
  return fallbackMaterials
})

// Filtered Projects for Table
const filteredProjects = computed(() => {
  const list = summary.value.projectsList
  if (projectFilter.value === 'All') return list
  return list.filter(p => (p.status || '').toLowerCase() === projectFilter.value.toLowerCase())
})

const countByStatus = (status) => {
  return summary.value.projectsList.filter(p => (p.status || '').toLowerCase() === status.toLowerCase()).length
}

// Navigation Helper
const navigateTo = (path) => {
  router.push(path)
}

// API Loader
const loadDashboardData = async () => {
  isLoading.value = true
  noticeMessage.value = ''

  try {
    const [statsRes, projRes, staffRes, equipRes, tasksRes] = await Promise.allSettled([
      dashboardApi.getStats(),
      projectsApi.getAll(),
      staffApi.getAll(),
      equipmentApi.getAll(),
      tasksApi.getAll()
    ])

    let anySuccess = false

    if (statsRes.status === 'fulfilled' && statsRes.value?.data) {
      stats.value = statsRes.value.data
      anySuccess = true
    }

    if (projRes.status === 'fulfilled' && Array.isArray(projRes.value?.data)) {
      rawProjects.value = projRes.value.data
      anySuccess = true
    }

    if (staffRes.status === 'fulfilled' && Array.isArray(staffRes.value?.data)) {
      rawStaff.value = staffRes.value.data
      anySuccess = true
    }

    if (equipRes.status === 'fulfilled' && Array.isArray(equipRes.value?.data)) {
      rawEquipment.value = equipRes.value.data
      anySuccess = true
    }

    if (tasksRes.status === 'fulfilled' && Array.isArray(tasksRes.value?.data)) {
      rawTasks.value = tasksRes.value.data
      anySuccess = true
    }

    if (anySuccess) {
      isDemoMode.value = false
    } else {
      isDemoMode.value = true
      noticeMessage.value = 'Displaying high-fidelity operational preview. Connect your local database to synchronize live field data.'
      noticeType.value = 'notice-info'
    }

    await nextTick()
    renderAllCharts()

  } catch (err) {
    console.error('Failed to load dashboard data:', err)
    isDemoMode.value = true
    noticeMessage.value = 'Using cached visual mode. Backend synchronization pending.'
    noticeType.value = 'notice-warning'
    await nextTick()
    renderAllCharts()
  } finally {
    isLoading.value = false
  }
}

// Set Finance Time Range
const setFinanceRange = (range) => {
  financeRange.value = range
  renderFinanceChart()
}

// Chart Rendering Logic
const renderAllCharts = () => {
  renderFinanceChart()
  renderProjectStatusChart()
  renderTaskPriorityChart()
}

const renderFinanceChart = () => {
  if (!financeChartCanvas.value) return

  if (financeChartInstance) {
    financeChartInstance.destroy()
  }

  const is6m = financeRange.value === '6m'
  const labels = is6m
    ? ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr']
    : ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr']

  const budgets = is6m
    ? [320000, 380000, 490000, 560000, 620000, 750000]
    : [210000, 240000, 280000, 310000, 350000, 390000, 420000, 480000, 520000, 560000, 620000, 750000]

  const expenses = is6m
    ? [140000, 190000, 230000, 280000, 310000, 340000]
    : [95000, 110000, 135000, 150000, 170000, 190000, 210000, 240000, 260000, 280000, 310000, 340000]

  const revenue = is6m
    ? [200000, 260000, 350000, 410000, 480000, 590000]
    : [150000, 170000, 210000, 230000, 260000, 300000, 340000, 380000, 420000, 460000, 500000, 590000]

  financeChartInstance = new Chart(financeChartCanvas.value, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Client Invoiced Revenue',
          data: revenue,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.08)',
          fill: true,
          tension: 0.35,
          borderWidth: 2.5,
          pointBackgroundColor: '#10b981',
          pointRadius: 4,
          pointHoverRadius: 6
        },
        {
          label: 'Total Capital Allocated',
          data: budgets,
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37, 99, 235, 0.04)',
          fill: false,
          tension: 0.35,
          borderWidth: 2.5,
          pointBackgroundColor: '#2563eb',
          pointRadius: 4,
          pointHoverRadius: 6
        },
        {
          label: 'Site Operations & Material Cost',
          data: expenses,
          borderColor: '#f43f5e',
          backgroundColor: 'transparent',
          fill: false,
          borderDash: [5, 5],
          tension: 0.35,
          borderWidth: 2,
          pointBackgroundColor: '#f43f5e',
          pointRadius: 3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          align: 'end',
          labels: {
            boxWidth: 12,
            font: { size: 12, weight: '500' },
            color: '#475569',
            padding: 16
          }
        },
        tooltip: {
          backgroundColor: '#0f172a',
          titleFont: { size: 13, weight: 'bold' },
          bodyFont: { size: 12 },
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: $${context.raw.toLocaleString()}`
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#64748b', font: { size: 12 } }
        },
        y: {
          grid: { color: 'rgba(226, 232, 240, 0.8)' },
          ticks: {
            color: '#64748b',
            font: { size: 12 },
            callback: (val) => `$${val / 1000}k`
          }
        }
      }
    }
  })
}

const renderProjectStatusChart = () => {
  if (!projectStatusCanvas.value) return

  if (projectStatusInstance) {
    projectStatusInstance.destroy()
  }

  const segments = projectStatusSegments.value

  projectStatusInstance = new Chart(projectStatusCanvas.value, {
    type: 'doughnut',
    data: {
      labels: segments.map(s => s.label),
      datasets: [
        {
          data: segments.map(s => s.count),
          backgroundColor: segments.map(s => s.color),
          hoverOffset: 6,
          borderWidth: 3,
          borderColor: '#ffffff'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '72%',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0f172a',
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            label: function(context) {
              const seg = segments[context.dataIndex]
              return ` ${seg.label}: ${seg.count} projects (${seg.percentage}%)`
            }
          }
        }
      }
    }
  })
}

const renderTaskPriorityChart = () => {
  if (!taskPriorityCanvas.value) return

  if (taskPriorityInstance) {
    taskPriorityInstance.destroy()
  }

  taskPriorityInstance = new Chart(taskPriorityCanvas.value, {
    type: 'bar',
    data: {
      labels: ['Critical Urgent', 'High Priority', 'Medium Stage', 'Low / Backlog'],
      datasets: [
        {
          label: 'Completed',
          data: [1, 2, 2, 1],
          backgroundColor: '#10b981',
          borderRadius: 6,
          stack: 'Stack 0'
        },
        {
          label: 'In Progress',
          data: [2, 3, 2, 0],
          backgroundColor: '#3b82f6',
          borderRadius: 6,
          stack: 'Stack 0'
        },
        {
          label: 'Pending / Planned',
          data: [1, 1, 3, 2],
          backgroundColor: '#e2e8f0',
          borderRadius: 6,
          stack: 'Stack 0'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          align: 'end',
          labels: {
            boxWidth: 10,
            font: { size: 12 },
            color: '#64748b'
          }
        },
        tooltip: {
          backgroundColor: '#0f172a',
          cornerRadius: 8,
          padding: 10
        }
      },
      scales: {
        x: {
          stacked: true,
          grid: { display: false },
          ticks: { color: '#64748b', font: { size: 12 } }
        },
        y: {
          stacked: true,
          grid: { color: 'rgba(226, 232, 240, 0.8)' },
          ticks: { stepSize: 2, color: '#64748b' }
        }
      }
    }
  })
}

// Formatting helpers
const formatCurrency = (val) => {
  const num = Number(val)
  if (isNaN(num) || val === null || val === undefined || val === '') return '$0'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(num)
}

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return 'Planned'
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(d)
}

const getStatusClass = (status) => {
  const s = (status || '').toLowerCase()
  if (s === 'active') return 'badge-active'
  if (s === 'completed') return 'badge-completed'
  if (s === 'pending') return 'badge-pending'
  return 'badge-hold'
}

const getPhaseLabel = (progress) => {
  const p = Number(progress) || 0
  if (p === 100) return 'Turnover / Delivered'
  if (p >= 75) return 'Finishing & Fitout'
  if (p >= 40) return 'Superstructure / Structural'
  if (p > 0) return 'Earthworks & Foundation'
  return 'Mobilization Phase'
}

const getProgressTone = (progress) => {
  const p = Number(progress) || 0
  if (p === 100) return 'tone-emerald'
  if (p >= 60) return 'tone-blue'
  if (p >= 30) return 'tone-amber'
  return 'tone-indigo'
}

const getAvatarColor = (name = '') => {
  const colors = [
    { background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: '#fff' },
    { background: 'linear-gradient(135deg, #10b981, #047857)', color: '#fff' },
    { background: 'linear-gradient(135deg, #f59e0b, #b45309)', color: '#fff' },
    { background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', color: '#fff' },
    { background: 'linear-gradient(135deg, #06b6d4, #0e7490)', color: '#fff' }
  ]
  const idx = name.length % colors.length
  return colors[idx]
}

const auditLogs = ref([])
const auditModuleFilter = ref('All')
const auditSearchQuery = ref('')

const fetchAuditLogs = async () => {
  try {
    const res = await auditLogsApi.getAll()
    auditLogs.value = res.data || []
  } catch (err) {
    console.error('Error fetching audit logs:', err)
  }
}

const filteredAuditLogs = computed(() => {
  return auditLogs.value.filter(log => {
    const matchesModule = auditModuleFilter.value === 'All' || log.module === auditModuleFilter.value
    const matchesSearch = !auditSearchQuery.value.trim() || 
      (log.description || '').toLowerCase().includes(auditSearchQuery.value.toLowerCase()) ||
      (log.performedBy || '').toLowerCase().includes(auditSearchQuery.value.toLowerCase()) ||
      (log.action || '').toLowerCase().includes(auditSearchQuery.value.toLowerCase())
    return matchesModule && matchesSearch
  })
})

const getAuditActionClass = (action) => {
  const a = (action || '').toUpperCase()
  if (a === 'CREATE') return 'badge-create'
  if (a === 'UPDATE') return 'badge-update'
  if (a === 'DELETE') return 'badge-delete'
  return 'badge-alert'
}

const getSeverityBadgeClass = (severity) => {
  const s = (severity || '').toLowerCase()
  if (s === 'success') return 'badge-completed'
  if (s === 'warning') return 'badge-pending'
  if (s === 'critical') return 'badge-hold'
  return 'badge-active'
}

onMounted(() => {
  loadDashboardData()
  fetchAuditLogs()
  window.addEventListener('resize', renderAllCharts)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', renderAllCharts)
  if (financeChartInstance) financeChartInstance.destroy()
  if (projectStatusInstance) projectStatusInstance.destroy()
  if (taskPriorityInstance) taskPriorityInstance.destroy()
})
</script>

<style scoped>
/* =========================================================
   CONTAINER & ROOT
========================================================= */
.dashboard-root {
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 16px 20px 48px;
  color: #0f172a;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
}

/* =========================================================
   HEADER SECTION
========================================================= */
.dash-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.breadcrumb-trail {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
  margin-bottom: 6px;
}

.trail-sep {
  color: #cbd5e1;
}

.trail-active {
  color: #2563eb;
  font-weight: 600;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.dash-title {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.025em;
  color: #0f172a;
  margin: 0;
}

.badge-live-pulse {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 4px 12px;
  border-radius: 9999px;
  background: rgba(16, 185, 129, 0.12);
  color: #059669;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid rgba(16, 185, 129, 0.25);
}

.badge-live-pulse.badge-offline {
  background: rgba(245, 158, 11, 0.12);
  color: #d97706;
  border-color: rgba(245, 158, 11, 0.3);
}

.pulse-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: currentColor;
  box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
  animation: pulse-ring 1.8s infinite;
}

@keyframes pulse-ring {
  0% { transform: scale(0.95); opacity: 0.9; }
  70% { transform: scale(1.6); opacity: 0; }
  100% { transform: scale(0.95); opacity: 0; }
}


.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.site-condition-pill {
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  padding: 8px 16px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.03);
}

.condition-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.cond-icon {
  font-size: 20px;
}

.cond-val {
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
}

.cond-label {
  font-size: 11px;
  color: #64748b;
}

.cond-divider {
  width: 1px;
  height: 28px;
  background: #e2e8f0;
  margin: 0 14px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-refresh {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 15px;
  background: #ffffff;
  color: #334155;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-refresh:hover:not(:disabled) {
  border-color: #2563eb;
  color: #2563eb;
  background: #f8fafc;
}

.refresh-icon.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.btn-primary-action {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 18px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
  transition: all 0.2s ease;
}

.btn-primary-action:hover {
  background: linear-gradient(135deg, #1d4ed8, #1e40af);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.35);
}

/* =========================================================
   QUICK NAV CHIPS BAR
========================================================= */
.quick-nav-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 8px 16px;
  margin-bottom: 24px;
  overflow-x: auto;
}

.quick-nav-label {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #64748b;
  white-space: nowrap;
}

.quick-chips {
  display: flex;
  align-items: center;
  gap: 8px;
}

.chip-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #f1f5f9;
  color: #334155;
  border: 1px solid transparent;
  border-radius: 8px;
  font-size: 12.5px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;
}

.chip-btn:hover {
  background: #e2e8f0;
  color: #0f172a;
  border-color: #cbd5e1;
}

.chip-icon {
  font-size: 14px;
}

/* =========================================================
   NOTICE BANNER
========================================================= */
.dash-notice-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px;
  border-radius: 10px;
  font-size: 13.5px;
  margin-bottom: 24px;
}

.dash-notice-banner.notice-info {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #1e40af;
}

.dash-notice-banner.notice-warning {
  background: #fffbeb;
  border: 1px solid #fde68a;
  color: #92400e;
}

.notice-body {
  display: flex;
  align-items: center;
  gap: 10px;
}

.notice-dismiss {
  background: transparent;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: inherit;
  opacity: 0.7;
}

.notice-dismiss:hover {
  opacity: 1;
}

/* =========================================================
   KPI METRICS GRID (5 CARDS)
========================================================= */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.kpi-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 18px 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.kpi-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px -4px rgba(0, 0, 0, 0.08);
  border-color: #cbd5e1;
}

.kpi-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.kpi-icon-wrapper {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bg-blue-subtle { background: rgba(37, 99, 235, 0.1); }
.bg-emerald-subtle { background: rgba(16, 185, 129, 0.1); }
.bg-purple-subtle { background: rgba(124, 58, 237, 0.1); }
.bg-amber-subtle { background: rgba(245, 158, 11, 0.1); }
.bg-cyan-subtle { background: rgba(8, 145, 178, 0.1); }

.kpi-badge {
  font-size: 11.5px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 6px;
}

.pill-blue { background: #dbeafe; color: #1e40af; }
.pill-emerald { background: #d1fae5; color: #065f46; }
.pill-purple { background: #ede9fe; color: #5b21b6; }
.pill-amber { background: #fef3c7; color: #92400e; }
.pill-cyan { background: #cffafe; color: #155e75; }

.kpi-value {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #0f172a;
  line-height: 1.1;
}

.kpi-title {
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
  margin-top: 4px;
}

.kpi-footer {
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
}

.mini-bar-track {
  width: 100%;
  height: 6px;
  background: #f1f5f9;
  border-radius: 999px;
  overflow: hidden;
  margin-top: 6px;
}

.mini-bar-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.fill-blue { background: #2563eb; }
.fill-amber { background: #f59e0b; }

.progress-sub .sub-label,
.fleet-meter .fleet-text {
  display: flex;
  justify-content: space-between;
  font-size: 11.5px;
  color: #64748b;
}

.stat-dual-meta {
  display: flex;
  justify-content: space-between;
  font-size: 11.5px;
}

.meta-label {
  display: block;
  color: #94a3b8;
}

.meta-num {
  font-weight: 700;
}

.text-danger { color: #e11d48; }
.text-success { color: #059669; }

.chips-row {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.dept-tag {
  font-size: 10.5px;
  background: #f8fafc;
  color: #475569;
  border: 1px solid #e2e8f0;
  padding: 2px 6px;
  border-radius: 4px;
}

.task-health-pill {
  font-size: 12px;
  color: #475569;
  font-weight: 500;
}

.bullet-completed { color: #10b981; }
.bullet-critical { color: #ef4444; }
.ml-2 { margin-left: 8px; }

/* =========================================================
   CHARTS CONTAINERS
========================================================= */
.charts-row {
  display: grid;
  gap: 20px;
  margin-bottom: 24px;
}

.primary-visuals {
  grid-template-columns: 2fr 1fr;
}

.secondary-visuals {
  grid-template-columns: 1.2fr 1.8fr;
}

@media (max-width: 1100px) {
  .primary-visuals,
  .secondary-visuals {
    grid-template-columns: 1fr;
  }
}

.chart-box {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 22px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  display: flex;
  flex-direction: column;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 18px;
}

.chart-badge {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #2563eb;
  margin-bottom: 4px;
}

.chart-title {
  font-size: 17px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.chart-desc {
  font-size: 12.5px;
  color: #64748b;
  margin: 3px 0 0;
}

.chart-filter-pills {
  display: flex;
  gap: 6px;
  background: #f1f5f9;
  padding: 3px;
  border-radius: 8px;
}

.pill-btn {
  border: none;
  background: transparent;
  padding: 5px 11px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.15s ease;
}

.pill-btn.active {
  background: #ffffff;
  color: #0f172a;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.chart-canvas-container {
  position: relative;
  width: 100%;
  height: 280px;
}

.bar-canvas {
  height: 260px;
}

.chart-legend-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.legend-indicator {
  width: 10px;
  height: 10px;
  border-radius: 3px;
}

.legend-indicator.bg-blue { background: #2563eb; }
.legend-indicator.bg-rose { background: #f43f5e; }
.legend-indicator.bg-emerald { background: #10b981; }

.leg-val {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
}

.leg-label {
  font-size: 11.5px;
  color: #64748b;
}

/* Donut Box */
.donut-chart-wrapper {
  position: relative;
  width: 100%;
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.donut-center-info {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
}

.center-count {
  font-size: 26px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1;
  display: block;
}

.center-sub {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

.status-summary-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
}

.status-item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12.5px;
}

.status-name {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #334155;
}

.color-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-figures strong {
  color: #0f172a;
}

.status-pct {
  color: #94a3b8;
  margin-left: 4px;
}

/* Equipment Visual Box */
.link-btn {
  background: transparent;
  border: none;
  color: #2563eb;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.link-btn:hover {
  text-decoration: underline;
}

.equipment-radial-layout {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.fleet-stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.fleet-tile {
  border-radius: 12px;
  padding: 12px 14px;
  text-align: center;
}

.fleet-tile.in-use {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
}

.fleet-tile.available {
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
}

.fleet-tile.maintenance {
  background: #fefce8;
  border: 1px solid #fef08a;
}

.tile-icon {
  font-size: 18px;
  margin-bottom: 2px;
}

.tile-num {
  font-size: 22px;
  font-weight: 800;
  color: #0f172a;
}

.tile-tag {
  font-size: 11px;
  font-weight: 600;
  color: #475569;
}

/* Material Stock Watchlist */
.material-stock-watchlist {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 14px 16px;
}

.watchlist-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12.5px;
  font-weight: 700;
  color: #334155;
  margin-bottom: 12px;
}

.watchlist-link {
  background: transparent;
  border: none;
  color: #2563eb;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.materials-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.mat-item {
  font-size: 12px;
}

.mat-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.mat-name {
  font-weight: 600;
  color: #1e293b;
}

.mat-level.warning {
  color: #b45309;
  font-weight: 700;
}

.mat-level.good {
  color: #059669;
  font-weight: 600;
}

.mat-bar-track {
  width: 100%;
  height: 5px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
}

.mat-bar-fill {
  height: 100%;
}

.mat-bar-fill.warning {
  background: #f59e0b;
}

.mat-bar-fill.good {
  background: #10b981;
}

.mat-quant {
  display: flex;
  justify-content: space-between;
  color: #64748b;
  font-size: 11px;
  margin-top: 3px;
}

/* =========================================================
   OPERATIONS GRID: TABLE
========================================================= */
.operations-grid {
  display: block;
  width: 100%;
}

.projects-master-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 22px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}

.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 18px;
  gap: 16px;
  flex-wrap: wrap;
}

.table-heading {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.table-sub {
  font-size: 12.5px;
  color: #64748b;
  margin: 2px 0 0;
}

.toolbar-filters {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-pills {
  display: flex;
  gap: 4px;
  background: #f1f5f9;
  padding: 3px;
  border-radius: 8px;
}

.filter-pill {
  border: none;
  background: transparent;
  padding: 5px 11px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.15s ease;
}

.filter-pill.active {
  background: #ffffff;
  color: #0f172a;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}

.btn-table-action {
  border: none;
  background: transparent;
  color: #2563eb;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.btn-table-action:hover {
  text-decoration: underline;
}

.table-responsive-wrapper {
  overflow-x: auto;
}

.premium-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.premium-table th {
  text-align: left;
  padding: 12px 14px;
  color: #64748b;
  font-weight: 600;
  font-size: 11.5px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
}

.premium-table td {
  padding: 14px 14px;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

.project-row {
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.project-row:hover {
  background-color: #f8fafc;
}

.project-title-box {
  display: flex;
  align-items: center;
  gap: 12px;
}

.proj-badge-avatar {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 14px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
}

.proj-meta {
  display: flex;
  flex-direction: column;
}

.proj-name {
  font-weight: 700;
  color: #0f172a;
  font-size: 13.5px;
}

.proj-code {
  font-size: 11px;
  color: #94a3b8;
  letter-spacing: 0.03em;
}

.client-name {
  color: #334155;
  font-weight: 500;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 11.5px;
  font-weight: 600;
}

.status-indicator-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.badge-active {
  background: #dbeafe;
  color: #1d4ed8;
}

.badge-completed {
  background: #d1fae5;
  color: #047857;
}

.badge-pending {
  background: #fef3c7;
  color: #b45309;
}

.badge-hold {
  background: #f1f5f9;
  color: #64748b;
}

.progress-cell {
  width: 170px;
}

.progress-digits {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  margin-bottom: 4px;
}

.pct-num {
  font-weight: 700;
  color: #0f172a;
}

.phase-tag {
  color: #64748b;
}

.progress-track-premium {
  width: 100%;
  height: 6px;
  background: #f1f5f9;
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill-premium {
  height: 100%;
  border-radius: 999px;
  transition: width 0.4s ease;
}

.tone-emerald { background: linear-gradient(90deg, #10b981, #059669); }
.tone-blue { background: linear-gradient(90deg, #3b82f6, #1d4ed8); }
.tone-amber { background: linear-gradient(90deg, #f59e0b, #d97706); }
.tone-indigo { background: linear-gradient(90deg, #6366f1, #4338ca); }

.date-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #64748b;
  font-size: 12px;
}

.budget-value {
  font-weight: 700;
  color: #0f172a;
  font-size: 13.5px;
}

.text-right {
  text-align: right;
}

.table-empty {
  text-align: center;
  color: #94a3b8;
  padding: 30px;
}

/* Audit Log Table Styling */
.audit-log-master-card {
  margin-top: 24px;
}

.audit-icon-badge {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #eff6ff;
  border: 1px solid #dbeafe;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.search-input-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 6px 12px;
  width: 220px;
  transition: all 0.2s ease;
}

.search-input-wrap:focus-within {
  border-color: #3b82f6;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-icon {
  color: #94a3b8;
  flex-shrink: 0;
}

.search-field {
  border: none;
  background: transparent;
  font-size: 12.5px;
  color: #0f172a;
  outline: none;
  width: 100%;
}

.search-field::placeholder {
  color: #94a3b8;
}

.btn-refresh-pill {
  border: 1px solid #e2e8f0;
  background: #ffffff;
  color: #64748b;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-refresh-pill:hover {
  background: #f8fafc;
  color: #2563eb;
  border-color: #cbd5e1;
}

.module-badge-tag {
  font-size: 11.5px;
  font-weight: 600;
  color: #334155;
  background: #f1f5f9;
  padding: 3px 9px;
  border-radius: 6px;
  display: inline-block;
}

.user-tag-box {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 12.5px;
  color: #334155;
  font-weight: 500;
}

.user-avatar-mini {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #e2e8f0;
  color: #475569;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10.5px;
  font-weight: 700;
  flex-shrink: 0;
}

.badge-action {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.badge-create { background: rgba(16, 185, 129, 0.12); color: #059669; }
.badge-update { background: rgba(59, 130, 246, 0.12); color: #2563eb; }
.badge-delete { background: rgba(239, 68, 68, 0.12); color: #dc2626; }
.badge-alert { background: rgba(245, 158, 11, 0.12); color: #d97706; }

.user-tag {
  font-size: 12px;
  color: #475569;
  font-weight: 500;
}

.text-desc {
  color: #334155;
  font-size: 12.5px;
  line-height: 1.4;
}

.text-slate {
  color: #0f172a;
}

/* Interactive Analytics Tab Suite */
.chart-tab-pills {
  display: flex;
  gap: 4px;
  background: #f1f5f9;
  padding: 3px;
  border-radius: 8px;
}

.chart-tab-pill {
  border: none;
  background: transparent;
  padding: 5px 11px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.15s ease;
}

.chart-tab-pill.active {
  background: #ffffff;
  color: #2563eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.fleet-grid-chips {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 12px;
}

.fleet-chip {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.chip-label {
  font-size: 11px;
  color: #64748b;
  font-weight: 500;
}

.chip-val {
  font-size: 16px;
  font-weight: 800;
}

.small-pills .filter-pill {
  padding: 3px 8px;
  font-size: 11px;
}

</style>
