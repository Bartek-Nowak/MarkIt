<script setup lang="ts">
import { Marked } from 'marked'
import JSZip, { file } from 'jszip'
import { saveAs } from 'file-saver'
import { useFileDialog } from '@vueuse/core'
import { HTML_BEGIN, HTML_END } from '../constants';
import { useTabsStore } from '@/stores/tabs'

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
    <nav id="toc" class="fixed top-0 left-0 p-4 max-w-xs prose prose-slate">
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
  <div class="w-full bg-gray-800 text-gray-100 p-2 flex items-center justify-between">
    <div class="flex items-center space-x-2">
      <button @click="tabsStore.exportTabs" class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-xs">
        Save Project
      </button>
      <button @click="() => open()" class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-xs">
        Load Project
      </button>
      <button @click="downloadMarkdown" class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-xs">
        Download Markdown
      </button>
      <button @click="downloadHTMLZip" class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-xs">
        Download HTML
      </button>
    </div>
  </div>
</template>
