<script setup lang="ts">
import { Marked } from 'marked'
import { HTML_BEGIN, HTML_END } from './constants';
import { useTabsStore } from '@/stores/tabs'

const tabsStore = useTabsStore()

defineProps<{
  markdown: string
}>()

const downloadMarkdown = () => {
  const filename = tabsStore.activeTab.title.replace(/\s+/g, '_')
  const blob = new Blob([tabsStore.activeTab.markdown], { type: 'text/markdown' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `${filename}.md`
  a.click()
}

const downloadHTML = async () => {
  const marked = new Marked()
  const htmlContent = await marked.parse(tabsStore.activeTab.markdown)
  const fullHTML = HTML_BEGIN + htmlContent + HTML_END

  const htmlBlob = new Blob([fullHTML], { type: 'text/html' })
  const htmlUrl = URL.createObjectURL(htmlBlob)
  const a1 = document.createElement('a')
  a1.href = htmlUrl
  a1.download = `${tabsStore.activeTab.title.replace(/\s+/g, '_')}.html`
  a1.click()
  URL.revokeObjectURL(htmlUrl)

  const cssUrl = '/style.css'
  const a2 = document.createElement('a')
  a2.href = cssUrl
  a2.download = 'style.css'
  a2.click()
}
</script>

<template>
  <div class="w-full bg-gray-800 text-gray-100 p-2 flex items-center justify-between">
    <div class="flex items-center space-x-2">
      <button @click="downloadMarkdown" class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-xs">
        Download .md
      </button>
      <button @click="downloadHTML" class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-xs">
        Download .html
      </button>
    </div>
  </div>
</template>
