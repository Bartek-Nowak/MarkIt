<script setup lang="ts">
import { camelCaseToLabel } from '@/utils/format'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/components/ui/number-field"

defineProps<{
  label: string
  options?: string[]
}>()

const model = defineModel<string | number | boolean>()
</script>

<template>
  <label class="flex items-center justify-between mb-2">
    <span class="capitalize">{{ camelCaseToLabel(label) }}</span>

    <Switch v-if="typeof model === 'boolean'" v-model="model" />

    <Select v-else-if="typeof model === 'string' && options" v-model="model">
      <SelectTrigger class="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem v-for="opt in options" :key="opt" :value="opt">{{ opt }}</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>

    <Input v-else-if="typeof model === 'string'" type='text' v-model="model" class="w-[180px]" />
    <NumberField v-else-if="typeof model === 'number'" v-model="model">
      <NumberFieldContent>
        <NumberFieldDecrement />
        <NumberFieldInput />
        <NumberFieldIncrement />
      </NumberFieldContent>
    </NumberField>
  </label>
</template>
