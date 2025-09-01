<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDown, ChevronUp } from "lucide-vue-next"
import { Button } from './ui/button'

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
    class="flex w-full items-center justify-between bg-background px-2 py-1 text-[12px] text-foreground border-t border-border">
    <div class="max-w-1/2 truncate">
      {{ props.stats.words }} words • {{ props.stats.lines }} lines • Ln {{ props.stats.ln }}, Col {{ props.stats.col }}
    </div>

    <div class="flex max-w-1/2 items-center space-x-4 px-2">
      <div class="truncate">
        HTML {{ props.stats.characters }} characters • {{ props.stats.words }} words • {{ props.stats.paragraphs }}
        paragraphs
      </div>
      <Button @click="toggleVisibility" variant="ghost" size="icon">
        <ChevronUp />
      </Button>
    </div>
  </footer>

  <Button v-else @click="toggleVisibility" class="fixed right-4 bottom-2" variant="ghost" size="icon">
    <ChevronDown />
  </Button>
</template>
