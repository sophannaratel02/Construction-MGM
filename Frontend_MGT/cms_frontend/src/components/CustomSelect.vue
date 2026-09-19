<template>
  <div class="custom-select-wrap" ref="containerRef">
    <!-- Trigger Button / Box -->
    <button
      type="button"
      class="custom-select-trigger"
      :class="{ 'is-open': isOpen, 'is-disabled': disabled, 'has-value': hasValue }"
      :disabled="disabled"
      @click="toggleDropdown"
      @keydown.down.prevent="openAndFocus"
      @keydown.enter.prevent="toggleDropdown"
      @keydown.space.prevent="toggleDropdown"
      @keydown.esc="closeDropdown"
    >
      <div class="trigger-content">
        <span v-if="selectedOption" class="selected-label">
          {{ selectedOption.label }}
        </span>
        <span v-else class="placeholder-text">{{ formattedPlaceholder }}</span>
      </div>

      <div class="chevron-icon" :class="{ 'rotate': isOpen }">
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </button>

    <!-- Dropdown Popup Menu (Teleported to body to avoid overflow clipping) -->
    <Teleport to="body">
      <Transition name="select-dropdown-anim">
        <div
          v-if="isOpen"
          class="custom-select-popup shadow-2xl"
          :style="popupStyle"
          ref="popupRef"
        >
          <!-- Optional Search Box -->
          <div v-if="showSearch" class="select-search-wrap">
            <svg class="search-icon" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref="searchInputRef"
              v-model="searchQuery"
              type="text"
              class="select-search-input"
              placeholder="Type to search..."
              @keydown.esc="closeDropdown"
            />
            <button v-if="searchQuery" type="button" class="clear-search-btn" @click="searchQuery = ''">
              &times;
            </button>
          </div>

          <!-- Options List -->
          <div class="select-options-list">
            <!-- Filtered Options -->
            <div
              v-for="opt in filteredOptions"
              :key="String(opt.value)"
              class="select-option-item"
              :class="{ 'is-selected': isOptionSelected(opt) }"
              @click="selectOption(opt)"
            >
              <div class="option-info">
                <span class="option-label-text">{{ opt.label }}</span>
              </div>
              <svg v-if="isOptionSelected(opt)" class="check-icon" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <!-- Empty / No Results -->
            <div v-if="filteredOptions.length === 0" class="no-options-state">
              <span>No matching options found</span>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number, Object, Boolean],
    default: null
  },
  options: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: 'Select Option'
  },
  searchable: {
    type: Boolean,
    default: false
  },
  allowClear: {
    type: Boolean,
    default: true
  },
  disabled: {
    type: Boolean,
    default: false
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
const searchInputRef = ref(null)
const searchQuery = ref('')
const popupStyle = ref({})

const formattedPlaceholder = computed(() => {
  if (!props.placeholder) return 'Select Option'
  return props.placeholder.replace(/^--\s*/, '').replace(/\s*--$/, '').trim()
})

// Normalize options array into { value, label, raw }
const normalizedOptions = computed(() => {
  if (!Array.isArray(props.options)) return []
  return props.options.map(opt => {
    if (typeof opt === 'object' && opt !== null) {
      const val = opt.value !== undefined ? opt.value : (opt.id !== undefined ? opt.id : opt)
      const lbl = opt.label || opt.companyName || opt.name || opt.title || String(val)
      return { value: val, label: lbl, raw: opt }
    }
    return { value: opt, label: String(opt), raw: opt }
  })
})

const selectedOption = computed(() => {
  if (props.modelValue === null || props.modelValue === undefined || props.modelValue === '') return null
  return normalizedOptions.value.find(o => String(o.value) === String(props.modelValue)) || null
})

const hasValue = computed(() => selectedOption.value !== null)

const showSearch = computed(() => {
  return props.searchable === true
})

const filteredOptions = computed(() => {
  if (!searchQuery.value.trim()) return normalizedOptions.value
  const q = searchQuery.value.toLowerCase().trim()
  return normalizedOptions.value.filter(o => o.label.toLowerCase().includes(q))
})

const isOptionSelected = (opt) => {
  if (props.modelValue === null || props.modelValue === undefined) return false
  return String(opt.value) === String(props.modelValue)
}

const calculatePosition = () => {
  if (!containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  const popupMaxHeight = 280
  const viewportHeight = window.innerHeight

  let top = rect.bottom + 6
  if (rect.bottom + popupMaxHeight > viewportHeight && rect.top > popupMaxHeight) {
    top = rect.top - popupMaxHeight - 6
  }

  popupStyle.value = {
    position: 'fixed',
    top: `${top}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    zIndex: 9999
  }
}

const toggleDropdown = () => {
  if (props.disabled) return
  if (isOpen.value) {
    closeDropdown()
  } else {
    openDropdown()
  }
}

const openDropdown = () => {
  isOpen.value = true
  searchQuery.value = ''
  nextTick(() => {
    calculatePosition()
    if (showSearch.value && searchInputRef.value) {
      searchInputRef.value.focus()
    }
  })
}

const openAndFocus = () => {
  if (!isOpen.value) openDropdown()
}

const closeDropdown = () => {
  isOpen.value = false
  searchQuery.value = ''
}

const selectOption = (opt) => {
  const val = opt ? opt.value : null
  emit('update:modelValue', val)
  emit('change', val, opt ? opt.raw : null)
  closeDropdown()
}

const handleClickOutside = (e) => {
  if (isOpen.value) {
    const isInsideContainer = containerRef.value && containerRef.value.contains(e.target)
    const isInsidePopup = popupRef.value && popupRef.value.contains(e.target)
    if (!isInsideContainer && !isInsidePopup) {
      closeDropdown()
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
.custom-select-wrap {
  position: relative;
  width: 100%;
}

.custom-select-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #0f172a;
  border: 1px solid #334155;
  color: #ffffff;
  border-radius: 9px;
  padding: 0.65rem 0.85rem;
  font-size: 0.88rem;
  outline: none;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.custom-select-trigger:hover,
.custom-select-trigger.is-open {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
}

.custom-select-trigger.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  border-color: #1e293b;
}

.trigger-content {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-right: 8px;
}

.selected-label {
  color: #ffffff;
  font-weight: 500;
}

.selected-subtext {
  color: #94a3b8;
  font-size: 0.8rem;
  margin-left: 4px;
}

.placeholder-text {
  color: #64748b;
}

.chevron-icon {
  color: #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.chevron-icon.rotate {
  transform: rotate(180deg);
  color: #3b82f6;
}

/* Teleported Popup */
.custom-select-popup {
  background-color: #0f172a;
  border: 1px solid #334155;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.05);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 280px;
  box-sizing: border-box;
}

.select-search-wrap {
  position: relative;
  padding: 8px 10px;
  border-bottom: 1px solid #1e293b;
  background-color: #0f172a;
}

.search-icon {
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
}

.select-search-input {
  width: 100%;
  background: #1e293b;
  border: 1px solid #334155;
  color: #ffffff;
  border-radius: 7px;
  padding: 6px 28px 6px 30px;
  font-size: 0.82rem;
  outline: none;
  box-sizing: border-box;
}

.select-search-input:focus {
  border-color: #3b82f6;
}

.clear-search-btn {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 14px;
  cursor: pointer;
}

.select-options-list {
  overflow-y: auto;
  padding: 5px;
  max-height: 230px;
}

.select-option-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-radius: 7px;
  color: #cbd5e1;
  font-size: 0.88rem;
  cursor: pointer;
  transition: all 0.15s ease;
  margin-bottom: 2px;
}

.select-option-item:hover {
  background-color: rgba(59, 130, 246, 0.15);
  color: #ffffff;
}

.select-option-item.is-selected {
  background-color: rgba(37, 99, 235, 0.25);
  color: #60a5fa;
  font-weight: 600;
}

.select-option-item.is-placeholder {
  color: #64748b;
  font-style: italic;
}

.option-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.option-label-text {
  font-weight: 500;
}

.option-subtext {
  font-size: 0.75rem;
  color: #64748b;
}

.check-icon {
  color: #3b82f6;
  flex-shrink: 0;
}

.no-options-state {
  padding: 16px;
  text-align: center;
  color: #64748b;
  font-size: 0.82rem;
}

/* Animation */
.select-dropdown-anim-enter-active,
.select-dropdown-anim-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.select-dropdown-anim-enter-from,
.select-dropdown-anim-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
