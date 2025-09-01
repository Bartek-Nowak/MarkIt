<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  id: number
  active?: boolean
  canRemove?: boolean
}>()

const emit = defineEmits<{
  (e: 'remove', id: number): void
}>()

const title = defineModel<string>('title', { default: 'Untitled' })

const editing = ref(false)
const inputValue = ref(title.value)

watch(editing, (val) => {
  if (val) {
    requestAnimationFrame(() => {
      const el = document.querySelector<HTMLInputElement>('#tab-edit-input')
      el?.focus()
      el?.select()
    })
  }
})

const startEditing = () => {
  editing.value = true
}

const stopEditing = () => {
  editing.value = false
  title.value = inputValue.value
}

const remove = () => {
  emit('remove', props.id)
}
</script>

<template>
  <div class="group relative flex cursor-pointer items-center rounded-t-lg border border-b-0 px-4 py-1 text-sm transition-colors duration-200 select-none shadow
           bg-background text-foreground
           data-[active=true]:bg-primary data-[active=true]:text-primary-foreground" :data-active="active"
    @dblclick="startEditing">
    <svg v-if="!editing" class="mr-2 h-3 w-3 opacity-70 group-data-[active=true]:opacity-100" fill="currentColor"
      viewBox="0 0 20 20">
      <path d="M10 2a8 8 0 100 16 8 8 0 000-16z" />
    </svg>

    <span v-if="!editing" class="flex-1 truncate text-center">
      {{ title }}
    </span>

    <input v-else id="tab-edit-input" v-model="inputValue" @blur="stopEditing" @keyup.enter="stopEditing"
      class="flex-1 border-none bg-transparent text-center text-sm text-foreground outline-none" />

    <button @click.stop="remove" class="ml-2 text-foreground/70 transition-colors hover:text-foreground" :class="{
      'opacity-100 group-hover:opacity-100': canRemove,
      'invisible opacity-0': !canRemove,
    }">
      ✕
    </button>
  </div>
</template>
