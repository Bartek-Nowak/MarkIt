<script setup lang="ts">
import { ref, nextTick, watch, onMounted, onBeforeUnmount } from "vue"
import { items } from "./slashMenu"

const model = defineModel<string>()
const textarea = ref<HTMLTextAreaElement | null>(null)
const menu = ref<HTMLUListElement | null>(null)
const menuWrapper = ref<HTMLDivElement | null>(null)

const showSlashMenu = ref(false)
const selectedIndex = ref(0)
const menuHeight = ref(0)

const handleClickOutside = (event: MouseEvent) => {
  if (menuWrapper.value && !menuWrapper.value.contains(event.target as Node)) {
    showSlashMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside)
})

watch(showSlashMenu, (visible) => {
  if (visible) {
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

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === "/") {
    const { selectionStart } = e.target as HTMLTextAreaElement
    const before = (model.value ?? "").slice(0, selectionStart)
    const lastLine = before.split("\n").pop() || ""
    if (lastLine.trim() === "") {
      showSlashMenu.value = true
      selectedIndex.value = 0
      e.preventDefault()
    }
  }
  if (e.key === "Escape") showSlashMenu.value = false
}

const handleMenuKeydown = (e: KeyboardEvent) => {
  if (e.key === "ArrowDown") {
    selectedIndex.value = (selectedIndex.value + 1) % items.length
    e.preventDefault()
  } else if (e.key === "ArrowUp") {
    selectedIndex.value = (selectedIndex.value - 1 + items.length) % items.length
    e.preventDefault()
  } else if (e.key === "Enter") {
    insertSnippet(items[selectedIndex.value].snippet)
    e.preventDefault()
  } else if (e.key === "Escape") {
    showSlashMenu.value = false
    nextTick(() => textarea.value?.focus())
  }
}

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
  model.value = (model.value ?? "").slice(0, start) + snippet + (model.value ?? "").slice(end)

  const cursorPos = start + snippet.length
  nextTick(() => {
    if (!textarea.value) return
    textarea.value.focus()
    textarea.value.selectionStart = cursorPos
    textarea.value.selectionEnd = cursorPos

    const lineHeight = parseInt(getComputedStyle(textarea.value).lineHeight) || 20
    const beforeCursor = textarea.value.value.slice(0, cursorPos).split("\n").length
    textarea.value.scrollTop = Math.max(0, (beforeCursor - 3) * lineHeight)
  })

  showSlashMenu.value = false
}
</script>

<template>
  <div class="w-full md:w-1/2 flex-1 relative">
    <textarea ref="textarea" v-model="model" @keydown="handleKeydown"
      class="w-full h-full p-4 bg-gray-100 border-b md:border-b-0 border-gray-300 md:border-r resize-none focus:outline-none" />

    <div v-if="showSlashMenu" ref="menuWrapper"
      class="absolute bottom-0 right-0 bg-white border rounded shadow-lg w-60 z-10">
      <ul ref="menu" tabindex="0" @keydown="handleMenuKeydown" class="outline-none overflow-auto"
        :style="{ maxHeight: menuHeight + 'px' }">
        <li v-for="(item, i) in items" :key="i"
          :class="['p-2 cursor-pointer', i === selectedIndex ? 'bg-gray-200' : 'hover:bg-gray-100']"
          @click="insertSnippet(item.snippet)">
          {{ item.label }}
        </li>
      </ul>
    </div>
  </div>
</template>
