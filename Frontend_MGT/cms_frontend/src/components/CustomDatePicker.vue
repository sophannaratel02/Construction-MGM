<template>
  <div class="custom-datepicker-wrap" ref="containerRef">
    <div 
      class="datepicker-input-box" 
      :class="{ 'is-focused': isOpen }"
      @click="togglePicker"
    >
      <input 
        type="text" 
        class="form-control datepicker-field" 
        :value="displayValue" 
        :placeholder="placeholder"
        :required="required"
        readonly
      />
      <div class="calendar-icon-btn">
        <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    </div>

    <!-- Dropdown Popup Teleported to Body to Avoid Overflow/Clipping -->
    <Teleport to="body">
      <div 
        v-if="isOpen" 
        class="datepicker-popup shadow-lg"
        :style="popupStyle"
        ref="popupRef"
      >
        <!-- Popup Header -->
        <div class="popup-header">
          <button type="button" class="nav-btn" @click.stop="prevMonth" title="Previous Month">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div class="current-month-year">
            {{ monthNames[currentMonth] }} {{ currentYear }}
          </div>

          <button type="button" class="nav-btn" @click.stop="nextMonth" title="Next Month">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <!-- Days of Week Header -->
        <div class="weekdays-grid">
          <span v-for="day in weekDays" :key="day" class="weekday-item">{{ day }}</span>
        </div>

        <!-- Days Grid -->
        <div class="days-grid">
          <button
            v-for="(cell, idx) in calendarCells"
            :key="idx"
            type="button"
            class="day-cell"
            :class="{
              'other-month': cell.isOtherMonth,
              'is-today': cell.isToday,
              'is-selected': cell.isSelected
            }"
            @click.stop="selectDate(cell)"
          >
            {{ cell.dayNumber }}
          </button>
        </div>

        <!-- Popup Footer Quick Actions -->
        <div class="popup-footer">
          <button type="button" class="footer-action-btn" @click.stop="clearDate">Clear</button>
          <button type="button" class="footer-action-btn primary" @click.stop="selectToday">Today</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'YYYY-MM-DD'
  },
  required: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const isOpen = ref(false)
const containerRef = ref(null)
const popupRef = ref(null)
const popupStyle = ref({})

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

// Active view year & month
const currentYear = ref(new Date().getFullYear())
const currentMonth = ref(new Date().getMonth())

// Synchronize initial date
const parseInitialDate = (val) => {
  if (!val) {
    const today = new Date()
    currentYear.value = today.getFullYear()
    currentMonth.value = today.getMonth()
    return
  }
  const parts = val.split('-')
  if (parts.length === 3) {
    const y = parseInt(parts[0], 10)
    const m = parseInt(parts[1], 10) - 1
    if (!isNaN(y) && !isNaN(m)) {
      currentYear.value = y
      currentMonth.value = m
    }
  }
}

watch(() => props.modelValue, (newVal) => {
  if (newVal) parseInitialDate(newVal)
}, { immediate: true })

const displayValue = computed(() => {
  return props.modelValue || ''
})

// Generate 35 or 42 days for grid based on month
const calendarCells = computed(() => {
  const cells = []
  const year = currentYear.value
  const month = currentMonth.value

  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const todayStr = formatDateStr(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())

  // Previous month trailing days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i
    const prevM = month === 0 ? 11 : month - 1
    const prevY = month === 0 ? year - 1 : year
    const dateStr = formatDateStr(prevY, prevM, dayNum)
    cells.push({
      dayNumber: dayNum,
      dateString: dateStr,
      isOtherMonth: true,
      isToday: dateStr === todayStr,
      isSelected: dateStr === props.modelValue
    })
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = formatDateStr(year, month, d)
    cells.push({
      dayNumber: d,
      dateString: dateStr,
      isOtherMonth: false,
      isToday: dateStr === todayStr,
      isSelected: dateStr === props.modelValue
    })
  }

  // Dynamic total grid size (35 if fits in 5 rows, else 42)
  const totalGridSize = cells.length > 35 ? 42 : 35
  const remaining = totalGridSize - cells.length
  for (let n = 1; n <= remaining; n++) {
    const nextM = month === 11 ? 0 : month + 1
    const nextY = month === 11 ? year + 1 : year
    const dateStr = formatDateStr(nextY, nextM, n)
    cells.push({
      dayNumber: n,
      dateString: dateStr,
      isOtherMonth: true,
      isToday: dateStr === todayStr,
      isSelected: dateStr === props.modelValue
    })
  }

  return cells
})

function formatDateStr(y, m, d) {
  const mm = String(m + 1).padStart(2, '0')
  const dd = String(d).padStart(2, '0')
  return `${y}-${mm}-${dd}`
}

const calculatePosition = () => {
  if (!containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  const popupHeight = 315
  const viewportHeight = window.innerHeight

  let top = rect.bottom + 6
  // Open upwards if not enough room at bottom
  if (rect.bottom + popupHeight > viewportHeight && rect.top > popupHeight) {
    top = rect.top - popupHeight - 6
  }

  popupStyle.value = {
    position: 'fixed',
    top: `${top}px`,
    left: `${rect.left}px`,
    width: `${Math.max(rect.width, 280)}px`,
    zIndex: 9999
  }
}

const togglePicker = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    nextTick(() => {
      calculatePosition()
    })
  }
}

const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

const selectDate = (cell) => {
  emit('update:modelValue', cell.dateString)
  emit('change', cell.dateString)
  isOpen.value = false
}

const selectToday = () => {
  const today = new Date()
  const dateStr = formatDateStr(today.getFullYear(), today.getMonth(), today.getDate())
  currentYear.value = today.getFullYear()
  currentMonth.value = today.getMonth()
  emit('update:modelValue', dateStr)
  emit('change', dateStr)
  isOpen.value = false
}

const clearDate = () => {
  emit('update:modelValue', '')
  emit('change', '')
  isOpen.value = false
}

const handleClickOutside = (e) => {
  if (isOpen.value) {
    const isInsideContainer = containerRef.value && containerRef.value.contains(e.target)
    const isInsidePopup = popupRef.value && popupRef.value.contains(e.target)
    if (!isInsideContainer && !isInsidePopup) {
      isOpen.value = false
    }
  }
}

const handleScrollOrResize = () => {
  if (isOpen.value) {
    calculatePosition()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('scroll', handleScrollOrResize, true)
  window.addEventListener('resize', handleScrollOrResize)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('scroll', handleScrollOrResize, true)
  window.removeEventListener('resize', handleScrollOrResize)
})
</script>

<style scoped>
.custom-datepicker-wrap {
  position: relative;
  width: 100%;
}

.datepicker-input-box {
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.datepicker-field {
  cursor: pointer !important;
  user-select: none;
}

.calendar-icon-btn {
  position: absolute;
  right: 10px;
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  transition: color 0.2s ease;
}

.datepicker-input-box:hover .calendar-icon-btn,
.datepicker-input-box.is-focused .calendar-icon-btn {
  color: #3b82f6;
}

/* Dropdown Popup Overlay Teleported to Body */
.datepicker-popup {
  background: #1e293b;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 14px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.65);
  padding: 14px;
  animation: fadeIn 0.15s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Header */
.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.current-month-year {
  font-size: 0.88rem;
  font-weight: 700;
  color: #f8fafc;
}

.nav-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #cbd5e1;
  width: 26px;
  height: 26px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-btn:hover {
  background: rgba(59, 130, 246, 0.2);
  border-color: #3b82f6;
  color: #ffffff;
}

/* Weekdays */
.weekdays-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  margin-bottom: 6px;
}

.weekday-item {
  font-size: 0.7rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
}

/* Days Grid */
.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 3px;
  margin-bottom: 10px;
}

.day-cell {
  background: transparent;
  border: 1px solid transparent;
  color: #f8fafc;
  height: 30px;
  border-radius: 7px;
  font-size: 0.8rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
}

.day-cell:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
}

.day-cell.other-month {
  color: #475569;
}

.day-cell.is-today {
  border-color: #3b82f6;
  color: #60a5fa;
  font-weight: 700;
}

.day-cell.is-selected {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8) !important;
  color: #ffffff !important;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
}

/* Footer Quick Actions */
.popup-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.footer-action-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  padding: 3px 7px;
  border-radius: 5px;
  transition: all 0.2s ease;
}

.footer-action-btn:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.06);
}

.footer-action-btn.primary {
  color: #60a5fa;
}

.footer-action-btn.primary:hover {
  color: #93c5fd;
  background: rgba(59, 130, 246, 0.15);
}
</style>
