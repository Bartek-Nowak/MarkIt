<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from 'highlight.js';
import InfoBar from './InfoBar.vue'

const marked = new Marked(
  markedHighlight({
    emptyLangClass: 'hljs',
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    }
  })
);

const markdown = ref('## Start writing your Markdown here...\n')
const preview = ref(marked.parse(markdown.value))

watch(markdown, (newVal) => {
  preview.value = marked.parse(newVal)
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
    <div class="flex flex-1 overflow-auto">
      <textarea v-model="markdown" placeholder="Enter Markdown here..."
        class="w-1/2 p-4 border-r border-gray-300 resize-none focus:outline-none flex-1"></textarea>

      <div class="w-1/2 p-4 bg-gray-100 flex justify-center flex-1 overflow-auto">
        <article class="prose w-full max-w-full" v-html="preview"></article>
      </div>
    </div>

    <InfoBar :stats="stats" />
  </main>
</template>
