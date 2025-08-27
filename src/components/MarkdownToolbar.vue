<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
  markdown: string
}>()

const downloadFile = () => {
  const blob = new Blob([props.markdown], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `file.md`
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="w-full bg-gray-800 text-gray-100 p-2 flex items-center justify-between">
    <div class="flex items-center space-x-2">
      <button @click="downloadFile" class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-xs">Download
        .md</button>
    </div>
  </div>
</template>
