<script setup lang="ts">
import { ref } from 'vue'

interface Stats {
  lines: number
  words: number
  characters: number
  paragraphs: number
  ln: number
  col: number
}

const props = defineProps<{ stats: Stats }>()
const isVisible = ref(true)

const toggleVisibility = () => {
  isVisible.value = !isVisible.value
}
</script>

<template>
  <footer v-if="isVisible"
    class="flex w-full items-center justify-between bg-background px-2 py-1 text-[12px] text-foreground">
    <div class="max-w-1/2">
      {{ props.stats.words }} words • {{ props.stats.lines }} lines • Ln {{ props.stats.ln }}, Col
      {{ props.stats.col }}
    </div>
    <div class="flex max-w-1/2 items-center space-x-4 px-2">
      <div>
        HTML {{ props.stats.characters }} characters • {{ props.stats.words }} words •
        {{ props.stats.paragraphs }}
        paragraphs
      </div>
      <button @click="toggleVisibility" class="rounded bg-gray-700 px-2 py-1 text-xs text-white hover:bg-gray-600">
        ▲
      </button>
    </div>
  </footer>

  <button v-else @click="toggleVisibility"
    class="fixed right-2 bottom-2 rounded bg-gray-800 px-2 py-1 text-xs text-white hover:bg-gray-700">
    ▼
  </button>
</template>
