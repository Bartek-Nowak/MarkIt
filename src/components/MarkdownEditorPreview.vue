<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from 'highlight.js';
import InfoBar from './InfoBar.vue'
import MarkdownToolbar from './MarkdownToolbar.vue'
import { TabManager } from './tab-manager';

const marked = new Marked(
  markedHighlight({
    emptyLangClass: 'hljs',
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    }
  })
)

const markdown = ref('')
const preview = ref<string>('')

const parseMarkdown = async (md: string) => {
  const html = await marked.parse(md)
  preview.value = typeof html === 'string' ? html : await html
}

parseMarkdown(markdown.value)

watch(markdown, (newVal) => {
  parseMarkdown(newVal)
})

const stats = computed(() => {
  const lines = markdown.value.split('\n')
  const words = markdown.value.split(/\s+/).filter(w => w).length
  const characters = markdown.value.length
  const paragraphs = markdown.value.split(/\n\n+/).filter(p => p).length
  const lineNumber = lines.length
  const colNumber = lines[lines.length - 1]?.length || 0

  return {
    lines: lineNumber,
    words,
    characters,
    paragraphs,
    ln: lineNumber,
    col: colNumber
  }
})
</script>

<template>
  <main class="h-screen w-screen flex flex-col">
    <MarkdownToolbar :markdown="markdown" />
    <TabManager v-model:markdown="markdown" />
    <div class="flex flex-1 flex-col md:flex-row overflow-auto">
      <textarea id="markdown-editor" name="markdown" v-model="markdown" placeholder="Enter Markdown here..."
        class="w-full md:w-1/2 p-4 border-b md:border-b-0 md:border-r bg-gray-100 border-gray-300 resize-none focus:outline-none flex-1"></textarea>

      <div class="w-full md:w-1/2 p-4 bg-gray-100 flex justify-center flex-1 overflow-auto">
        <article class="prose prose-pre:bg-[#282c34]" v-html="preview"></article>
      </div>
    </div>

    <InfoBar :stats="stats" />
  </main>
</template>
