<script setup lang="ts">
import { ref, nextTick, watch, onMounted, onBeforeUnmount, computed } from 'vue'
import { items } from './slashMenu'

const model = defineModel<string>()
const textarea = ref<HTMLTextAreaElement | null>(null)
const menu = ref<HTMLUListElement | null>(null)
const menuWrapper = ref<HTMLDivElement | null>(null)
const lineNumbers = ref<HTMLDivElement | null>(null)

const showSlashMenu = ref(false)
const selectedIndex = ref(0)
const menuHeight = ref(0)

const handleClickOutside = (event: MouseEvent) => {
  if (menuWrapper.value && !menuWrapper.value.contains(event.target as Node)) {
    showSlashMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

// --- numeracja linii ---
const lines = computed(() => {
  return (model.value ?? '').split('\n').map((_, i) => i + 1)
})



const syncScroll = () => {
  if (!textarea.value || !lineNumbers.value) return
  lineNumbers.value.scrollTop = textarea.value.scrollTop
}

// --- slash menu ---
watch(showSlashMenu, (visible) => {
  if (visible) {
    query.value = ''
    nextTick(() => {
      if (!menu.value) return
      const li = menu.value.children[0] as HTMLElement
      if (!li) return
      menuHeight.value = li.offsetHeight * 3
      menu.value.scrollTop = 0
      menu.value.focus()
    })
  }
})

const currentLine = computed(() => {
  if (!textarea.value) return ''
  const { selectionStart } = textarea.value
  const before = (model.value ?? '').slice(0, selectionStart)
  return before.split('\n').pop() ?? ''
})

watch(currentLine, () => {
  selectedIndex.value = 0
})

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === '/') {
    const { selectionStart } = e.target as HTMLTextAreaElement
    const before = (model.value ?? '').slice(0, selectionStart)
    const lastLine = before.split('\n').pop() || ''
    if (lastLine.trim() === '') {
      showSlashMenu.value = true
      selectedIndex.value = 0
      e.preventDefault()
    }
  }
  if (e.key === 'Escape') showSlashMenu.value = false
}

const query = ref('')

const handleMenuKeydown = (e: KeyboardEvent) => {
  if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
    query.value += e.key
    selectedIndex.value = 0
    e.preventDefault()
  } else if (e.key === 'Backspace') {
    query.value = query.value.slice(0, -1)
    selectedIndex.value = 0
    e.preventDefault()
  } else if (e.key === 'ArrowDown') {
    selectedIndex.value = (selectedIndex.value + 1) % filteredItems.value.length
    e.preventDefault()
  } else if (e.key === 'ArrowUp') {
    selectedIndex.value = (selectedIndex.value - 1 + filteredItems.value.length) % filteredItems.value.length
    e.preventDefault()
  } else if (e.key === 'Enter') {
    insertSnippet(filteredItems.value[selectedIndex.value].snippet)
    e.preventDefault()
  } else if (e.key === 'Escape') {
    showSlashMenu.value = false
    query.value = ''
    nextTick(() => textarea.value?.focus())
  }
}

const filteredItems = computed(() => {
  if (!query.value) return items
  const q = query.value.toLowerCase()
  return items
    .filter(item => item.label.toLowerCase().startsWith(q))
    .sort((a, b) => a.label.toLowerCase().indexOf(q) - b.label.toLowerCase().indexOf(q))
})

watch(selectedIndex, () => {
  nextTick(() => {
    if (!menu.value) return
    const activeItem = menu.value.children[selectedIndex.value] as HTMLElement
    if (!activeItem) return
    const menuRect = menu.value.getBoundingClientRect()
    const itemRect = activeItem.getBoundingClientRect()
    if (itemRect.bottom > menuRect.bottom) {
      menu.value.scrollTop += itemRect.bottom - menuRect.bottom
    } else if (itemRect.top < menuRect.top) {
      menu.value.scrollTop -= menuRect.top - itemRect.top
    }
  })
})

const insertSnippet = (snippet: string) => {
  if (!textarea.value) return

  const start = textarea.value.selectionStart
  const end = textarea.value.selectionEnd

  const previousScrollTop = textarea.value.scrollTop

  model.value = (model.value ?? '').slice(0, start) + snippet + (model.value ?? '').slice(end)
  const cursorPos = start + snippet.length

  nextTick(() => {
    if (!textarea.value) return
    textarea.value.focus()
    textarea.value.selectionStart = cursorPos
    textarea.value.selectionEnd = cursorPos
    textarea.value.scrollTop = previousScrollTop
  })

  showSlashMenu.value = false
}
</script>

<template>
  <div class="relative w-full h-full flex">
    <div ref="lineNumbers"
      class="select-none text-right pr-2 text-muted-foreground flex flex-col overflow-hidden leading-6 p-2">
      <div v-for="line in lines" :key="line">{{ line }}</div>
    </div>
    <textarea ref="textarea" v-model="model" @scroll="syncScroll" @keydown="handleKeydown"
      class="flex-1 resize-none border-b border-border bg-background px-2 py-2 text-foreground focus:outline-none overflow-auto leading-6"></textarea>
    <div v-if="showSlashMenu" ref="menuWrapper"
      class="absolute right-0 bottom-0 z-10 w-60 rounded border bg-popover shadow-lg">
      <ul ref="menu" tabindex="0" @keydown="handleMenuKeydown" class="max-h-60 overflow-auto outline-none">
        <li v-for="(item, i) in filteredItems" :key="i" :class="[
          'cursor-pointer px-3 py-2 rounded text-sm transition-colors',
          i === selectedIndex ? 'bg-primary text-primary-foreground' : 'hover:bg-muted hover:text-foreground'
        ]" @click="insertSnippet(item.snippet)">
          {{ item.label }}
        </li>
      </ul>
    </div>
  </div>
</template>
