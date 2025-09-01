<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'
import { open } from '@tauri-apps/plugin-shell';
import { useTabsStore } from '@/stores/tabs'
import InfoBar from './InfoBar.vue'
import MarkdownToolbar from './MarkdownToolbar.vue'
import { TabManager } from './tab-manager'
import MarkdownEditor from './MarkdownEditor.vue'
import { isTauri } from '@/utils/saveFile';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'

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

const previewRef = ref<HTMLDivElement | null>(null);

const handleExternalLinks = async (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (target.tagName !== 'A') return;

  const anchor = target as HTMLAnchorElement;
  if (!anchor.href) return;

  event.preventDefault();

  if (isTauri()) {
    await open(anchor.href);
  } else {
    window.open(anchor.href, '_blank', 'noopener,noreferrer');
  }
};

onMounted(() => {
  nextTick(() => {
    previewRef.value?.addEventListener('click', handleExternalLinks);
  });
});

onBeforeUnmount(() => {
  previewRef.value?.removeEventListener('click', handleExternalLinks);
});
</script>

<template>
  <main class="flex h-screen w-screen flex-col">
    <MarkdownToolbar :markdown="markdown" :html="preview" />
    <TabManager />
    <div class="flex flex-1 flex-col overflow-hidden md:flex-row border shadow">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel :min-size="20">
          <MarkdownEditor v-model="markdown" />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel :min-size="20">
          <div class="flex w-full h-full justify-center bg-white p-4 overflow-auto">
            <article ref="previewRef" class="prose prose-pre:bg-[#282c34] w-full" v-html="preview"></article>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>

    <InfoBar :stats="stats" />
  </main>
</template>
