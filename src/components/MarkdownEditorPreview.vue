<script setup lang="ts">
import { marked } from 'marked'
import { ref, watch } from 'vue'

const markdown = ref('')
const preview = ref(marked.parse(markdown.value))

watch(markdown, (newVal) => {
  preview.value = marked.parse(newVal)
})
</script>

<template>
  <main class="h-screen w-screen flex">
    <textarea v-model="markdown" placeholder="Enter Markdown here..."
      class="w-1/2 h-full p-4 border-r border-gray-300 resize-none focus:outline-none"></textarea>

    <div class="w-1/2 h-full p-4 overflow-auto flex justify-center bg-gray-100">
      <article class="prose w-full" v-html="preview"></article>
    </div>
  </main>
</template>
