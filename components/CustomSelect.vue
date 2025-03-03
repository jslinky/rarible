<script setup lang="ts">

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'


type OptionItem = {
  value: string;
  label: string;
  disabled?: boolean | undefined;
};

type OptionModel = {
  grouplabel?: string,
  selected?: string,
  options: OptionItem[]
}

type Props = {
  placeholder?: string,
  selectClass?: string,
  selectTriggerClass?: string,
  selectContentClass?: string,
}

const model = defineModel<OptionModel>()
const { placeholder = 'Please select an option' , selectClass, selectTriggerClass, selectContentClass = 'custom-select-content' } = defineProps<Props>()

</script>

<template>
  <template v-if="model?.options">    
    <Select :class="selectClass" v-model="model.selected">
      <SelectTrigger :class="selectTriggerClass">
        <SelectValue :placeholder />
      </SelectTrigger>
      <SelectContent :class="selectContentClass">
  
        <SelectGroup>
          <SelectLabel></SelectLabel>
        <template v-for="item in model?.options" :key="item.value">
            <SelectItem :data-select-value="item.value" :value="item.value" :disabled="item?.disabled">
            {{ item.label }}
            </SelectItem>
          </template>
          </SelectGroup>
      </SelectContent>
    </Select> 
  </template>
  </template>