<script setup lang="ts">
import { ref } from 'vue'
import { Marked } from 'marked'
import JSZip from 'jszip'
import { useFileDialog } from '@vueuse/core'
import { saveFile } from '@/utils/saveFile'
import { useTabsStore } from '@/stores/tabs'
import { useSettingsStore } from '@/stores/settingsStore'
import { HTML_BEGIN, HTML_END, THEMES } from '../constants'
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '@/components/ui/menubar'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import SettingItem from './SettingItem.vue'
import { Button } from '@/components/ui/button'

const tabsStore = useTabsStore()

const { open, onChange } = useFileDialog({ accept: '.json', multiple: false })

defineProps<{
  markdown: string
}>()

const downloadMarkdown = async () => {
  const filename = tabsStore.activeTab.title.replace(/\s+/g, '_')
  await saveFile(filename, tabsStore.activeTab.markdown, 'markdown')
}

const tocItems: { depth: number; escapedText: string; text: string }[] = []

const renderer = {
  //@ts-ignore
  heading({ tokens, depth }) {
    //@ts-ignore
    const text = this.parser.parseInline(tokens)
    //@ts-ignore
    const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-')
    tocItems.push({ depth, escapedText, text })
    return `
      <h${depth}>
        <a name="${escapedText}" href="#${escapedText}">
          <span class="header-link"></span>
        </a>
        ${text}
      </h${depth}>`
  },
}

const generateTOC = () => {
  const tocHtml = tocItems
    .map((item) => {
      const mlRem = (item.depth - 1) * 1.5
      return `<li style="margin-left: ${mlRem}rem;">
        <a href="#${item.escapedText}" class="text-gray-800 hover:text-gray-600">${item.text}</a>
      </li>`
    })
    .join('\n')

  return `
    <nav id="toc" class="fixed top-0 left-0 p-4 max-w-xs prose prose-slate overflow-y-auto max-h-full">
      <ul class="list-none p-0 text-sm">
        ${tocHtml}
      </ul>
    </nav>
  `
}

const downloadHTMLZip = async () => {
  const zip = new JSZip()
  const filenameBase = tabsStore.activeTab.title.replace(/\s+/g, '_')

  const marked = new Marked()
  marked.use({ renderer })

  const htmlContent = await marked.parse(tabsStore.activeTab.markdown)
  const tocHtml = generateTOC()

  const fullHTML = `${HTML_BEGIN}
${tocHtml}
<article class="prose prose-pre:bg-[#282c34]">
${htmlContent}
</article>
${HTML_END}`

  zip.file(`${filenameBase}.html`, fullHTML)

  const cssResponse = await fetch('/style.css')
  const cssText = await cssResponse.text()
  zip.file('style.css', cssText)

  await saveFile(filenameBase, zip, 'zip')
}

onChange(async (files) => {
  if (files && files.length > 0) {
    const file = files[0]
    try {
      const text = await file.text()
      tabsStore.importTabs(text)
      console.log('Import successful')
    } catch (e) {
      console.error('Failed to read file', e)
    }
  }
})

const settingsStore = useSettingsStore()
const settings = settingsStore.settings

const selectedCategory = ref('')


</script>

<template>
  <Dialog>
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem @click="tabsStore.exportTabs">Save Project</MenubarItem>
          <MenubarItem @click="() => open()">Load Project</MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Export to</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem @click="downloadMarkdown">Markdown</MenubarItem>
              <MenubarItem @click="downloadHTMLZip">HTML</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Settings</MenubarTrigger>
        <MenubarContent>
          <DialogTrigger asChild>
            <MenubarItem @click="selectedCategory = Object.keys(settings)[0]">Open Settings</MenubarItem>
          </DialogTrigger>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
    <DialogContent class="px-0">
      <DialogHeader class="px-4 py-2 border-b">
        <DialogTitle>Settings</DialogTitle>
      </DialogHeader>

      <div class="flex h-[500px]">
        <div class="w-1/3 border-r bg-background text-foreground overflow-auto">
          <ul>
            <li v-for="cat in Object.keys(settings)" @click="selectedCategory = cat" :class="{
              'bg-primary text-primary-foreground': selectedCategory === cat,
              'hover:bg-muted cursor-pointer': selectedCategory !== cat
            }" class="px-4 py-2 select-none capitalize"> {{ cat }} </li>
          </ul>
        </div>
        <div class="flex-1 p-4 overflow-auto bg-background text-foreground">
          <SettingItem v-for="key in Object.keys(settings[selectedCategory])" :key="key" :label="key"
            v-model="settings[selectedCategory][key]" :options="key === 'theme' ? THEMES : undefined" />
        </div>
      </div>

      <DialogFooter class="px-4 py-2 border-t flex justify-end">
        <Button>Close</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
