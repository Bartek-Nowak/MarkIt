<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { createSwapy, type SlotItemMapArray, type Swapy, utils } from 'swapy'
import { useTabsStore } from '@/stores/tabs'
import Tab from './Tab.vue'

const tabsStore = useTabsStore()
const items = computed(() => tabsStore.tabs)

const container = ref<HTMLElement | null>(null)
const swapy = ref<Swapy | null>(null)

const slotItemMap = ref<SlotItemMapArray>(
  [...utils.initSlotItemMap(items.value, 'id')]
)

watch(items, () => {
  if (swapy.value) {
    utils.dynamicSwapy(
      swapy.value,
      items.value,
      'id',
      slotItemMap.value,
      (value: SlotItemMapArray) => (slotItemMap.value = value)
    )
  }
}, { deep: true })

const slottedItems = computed(() =>
  utils.toSlottedItems(items.value, 'id', slotItemMap.value)
)

onMounted(() => {
  if (container.value) {
    swapy.value = createSwapy(container.value, {
      manualSwap: true,
      dragAxis: 'x',
      autoScrollOnDrag: true
    })
    swapy.value.onSwap(event => {
      requestAnimationFrame(() => {
        slotItemMap.value = event.newSlotItemMap.asArray
      })
    })
  }
})

onUnmounted(() => {
  swapy.value?.destroy()
})

const markdown = ref(tabsStore.activeTab.markdown)

watch(
  () => tabsStore.activeTab,
  (tab) => {
    markdown.value = tab.markdown
  },
  { immediate: true },
)
</script>

<template>
  <div class="flex items-end gap-2 overflow-x-auto pt-1" ref="container">
    <div class="flex gap-2 bg-background h-full">
      <div v-for="{ slotId, itemId, item: tab } in slottedItems" :key="slotId" :data-swapy-slot="slotId" class="flex">
        <div v-if="tab" class="flex" :data-swapy-item="itemId" :key="itemId">
          <Tab :id="tab.id" v-model:title="tab.title" :active="tab.active" :canRemove="tabsStore.tabs.length > 1"
            @click="tabsStore.setActive(tab.id)" @remove="tabsStore.removeTab" />
        </div>
      </div>
    </div>
    <button @click="tabsStore.addTab()"
      class="flex items-center justify-center rounded-t-lg border border-b-0 px-3 py-1 text-foreground transition-colors hover:bg-muted hover:text-foreground shadow">
      +
    </button>
  </div>
</template>
