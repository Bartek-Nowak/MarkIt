<script setup lang="ts">
import { defineProps, ref } from 'vue'

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
  <footer v-if="isVisible" class="w-full bg-gray-800 text-gray-100 text-sm p-2 flex justify-between items-center">
    <div>
      {{ props.stats.words }} words • {{ props.stats.lines }} lines • Ln {{ props.stats.ln }}, Col {{ props.stats.col }}
    </div>
    <div class="flex items-center space-x-4">
      <div>
        HTML {{ props.stats.characters }} characters • {{ props.stats.words }} words • {{ props.stats.paragraphs }}
        paragraphs
      </div>
      <button @click="toggleVisibility" class="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs">
        ▲
      </button>
    </div>
  </footer>

  <button v-else @click="toggleVisibility"
    class="fixed bottom-2 right-2 bg-gray-800 hover:bg-gray-700 text-white px-2 py-1 rounded text-xs">
    ▼
  </button>
</template>
