<script setup lang="ts">
import { useSettingsStore } from './stores/settingsStore'
import { useTabsStore } from './stores/tabs'
import MarkdownEditorPreview from './components/MarkdownEditorPreview.vue'
import { onMounted } from 'vue'

const settingsStore = useSettingsStore()
const tabsStore = useTabsStore()

onMounted(async () => {
  await settingsStore.load()
  tabsStore.initTabs()
})
</script>

<template>
  <MarkdownEditorPreview />
</template>
