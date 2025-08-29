<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'
import { useTabsStore } from '@/stores/tabs'
import InfoBar from './InfoBar.vue'
import MarkdownToolbar from './MarkdownToolbar.vue'
import { TabManager } from './tab-manager'
import MarkdownEditor from './MarkdownEditor.vue'

const tabsStore = useTabsStore()

const marked = new Marked(
  markedHighlight({
    emptyLangClass: 'hljs',
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext'
      return hljs.highlight(code, { language }).value
    },
  }),
)

const markdown = computed({
  get: () => tabsStore.activeTab.markdown,
  set: (val: string) => {
    tabsStore.activeTab.markdown = val
  },
})

const preview = ref<string>('')

const parseMarkdown = async (md: string) => {
  const html = await marked.parse(md)
  preview.value = typeof html === 'string' ? html : await html
}

watch(markdown, (newVal) => parseMarkdown(newVal), { immediate: true })

const stats = computed(() => {
  const lines = markdown.value.split('\n')
  const words = markdown.value.split(/\s+/).filter((w) => w).length
  const characters = markdown.value.length
  const paragraphs = markdown.value.split(/\n\n+/).filter((p) => p).length
  const lineNumber = lines.length
  const colNumber = lines[lines.length - 1]?.length || 0

  return {
    lines: lineNumber,
    words,
    characters,
    paragraphs,
    ln: lineNumber,
    col: colNumber,
  }
})
</script>

<template>
  <main class="flex h-screen w-screen flex-col">
    <MarkdownToolbar :markdown="markdown" :html="preview" />
    <TabManager />
    <div class="flex flex-1 flex-col overflow-hidden md:flex-row border shadow">
      <MarkdownEditor v-model="markdown" />

      <div class="flex w-full flex-1 justify-center overflow-auto bg-primary-foreground p-4 md:w-1/2">
        <article class="prose prose-pre:bg-[#282c34]" v-html="preview"></article>
      </div>
    </div>

    <InfoBar :stats="stats" />
  </main>
</template>
