<script setup lang="ts">
import { Marked } from 'marked'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
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
  URL.revokeObjectURL(a.href)
}

const downloadHTMLZip = async () => {
  const zip = new JSZip()
  const filenameBase = tabsStore.activeTab.title.replace(/\s+/g, '_')

  const marked = new Marked()
  const htmlContent = await marked.parse(tabsStore.activeTab.markdown)
  const fullHTML = HTML_BEGIN + htmlContent + HTML_END
  zip.file(`${filenameBase}.html`, fullHTML)

  const cssResponse = await fetch('/style.css')
  const cssText = await cssResponse.text()
  zip.file('style.css', cssText)

  const content = await zip.generateAsync({ type: 'blob' })
  saveAs(content, `${filenameBase}.zip`)
}
</script>

<template>
  <div class="w-full bg-gray-800 text-gray-100 p-2 flex items-center justify-between">
    <div class="flex items-center space-x-2">
      <button @click="downloadMarkdown" class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-xs">
        Download Markdown
      </button>
      <button @click="downloadHTMLZip" class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-xs">
        Download HTML
      </button>
    </div>
  </div>
</template>
