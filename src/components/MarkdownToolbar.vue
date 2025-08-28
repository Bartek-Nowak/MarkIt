<script setup lang="ts">
import { Marked } from 'marked'
import JSZip, { file } from 'jszip'
import { saveAs } from 'file-saver'
import { useFileDialog } from '@vueuse/core'
import { HTML_BEGIN, HTML_END } from '../constants';
import { useTabsStore } from '@/stores/tabs'
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar"

const tabsStore = useTabsStore()

const { open, onChange } = useFileDialog({ accept: '.json', multiple: false })


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

const tocItems: { depth: number; escapedText: string; text: string }[] = [];

const renderer = {
  //@ts-ignore
  heading({ tokens, depth }) {
    //@ts-ignore
    const text = this.parser.parseInline(tokens);
    //@ts-ignore
    const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
    tocItems.push({ depth, escapedText, text });
    return `
      <h${depth}>
        <a name="${escapedText}" href="#${escapedText}">
          <span class="header-link"></span>
        </a>
        ${text}
      </h${depth}>`;
  }
};

const generateTOC = () => {
  const tocHtml = tocItems
    .map(item => {
      const mlRem = (item.depth - 1) * 1.5;
      return `<li style="margin-left: ${mlRem}rem;">
        <a href="#${item.escapedText}" class="text-gray-800 hover:text-gray-600">${item.text}</a>
      </li>`;
    })
    .join('\n');

  return `
    <nav id="toc" class="fixed top-0 left-0 p-4 max-w-xs prose prose-slate overflow-y-auto max-h-full">
      <ul class="list-none p-0 text-sm">
        ${tocHtml}
      </ul>
    </nav>
  `;
};

const downloadHTMLZip = async () => {
  const zip = new JSZip();
  const filenameBase = tabsStore.activeTab.title.replace(/\s+/g, '_');

  const marked = new Marked();
  marked.use({ renderer });

  const htmlContent = await marked.parse(tabsStore.activeTab.markdown);
  const tocHtml = generateTOC();

  const fullHTML = `${HTML_BEGIN}
${tocHtml}
<article class="prose prose-pre:bg-[#282c34]">
${htmlContent}
</article>
${HTML_END}`;

  zip.file(`${filenameBase}.html`, fullHTML);

  const cssResponse = await fetch('/style.css');
  const cssText = await cssResponse.text();
  zip.file('style.css', cssText);

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, `${filenameBase}.zip`);
};

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

</script>

<template>
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
  </Menubar>
</template>
