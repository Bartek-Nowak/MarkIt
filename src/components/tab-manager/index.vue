<script setup lang="ts">
import { ref, watch } from 'vue'
import { useTabsStore } from '@/stores/tabs'
import Tab from './Tab.vue'

const tabsStore = useTabsStore()

const markdown = ref(tabsStore.activeTab.markdown)

watch(
  () => tabsStore.activeTab,
  (tab) => {
    markdown.value = tab.markdown
  },
  { immediate: true },
)

watch(markdown, (val) => {
  if (tabsStore.activeTab) tabsStore.activeTab.markdown = val
})
</script>

<template>
  <div class="flex gap-2 overflow-x-auto bg-background pt-1">
    <Tab v-for="tab in tabsStore.tabs" :key="tab.id" :id="tab.id" v-model:title="tab.title" :active="tab.active"
      :canRemove="tabsStore.tabs.length > 1" @click="tabsStore.setActive(tab.id)" @remove="tabsStore.removeTab" />
    <button @click="tabsStore.addTab()"
      class="flex items-center justify-center rounded-t-lg border border-b-0 px-3 py-1 text-foreground transition-colors hover:bg-secondary-foreground hover:text-primary-foreground shadow">
      +
    </button>
  </div>
</template>
