<script setup lang="ts">
import { PhCaretDown } from '@phosphor-icons/vue';
import { useId } from 'vue';

interface Option {
  value: string;
  label: string;
}

interface Props {
  modelValue?: string;
  options: Option[];
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'Selecione...',
  label: '',
  error: '',
  disabled: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const id = `base-select-${useId()}`;

function onChange(event: Event): void {
  const target = event.target as HTMLSelectElement;
  emit('update:modelValue', target.value);
}
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label
      v-if="props.label"
      :for="id"
      class="text-sm font-medium text-neutral-700"
    >
      {{ props.label }}
    </label>
    
    <div class="relative">
      <select
        :id="id"
        :value="props.modelValue"
        :disabled="props.disabled"
        :class="[
          'w-full px-4 py-2.5 pr-10 rounded-lg border text-base transition-all duration-200 appearance-none bg-white cursor-pointer',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
          'disabled:bg-neutral-100 disabled:cursor-not-allowed',
          props.error
            ? 'border-error-500 focus:ring-error-500 focus:border-error-500'
            : 'border-neutral-300 hover:border-neutral-400',
        ]"
        @change="onChange"
      >
        <option value="" disabled>{{ props.placeholder }}</option>
        <option
          v-for="option in props.options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
      
      <PhCaretDown
        :size="20"
        weight="bold"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
      />
    </div>
    
    <p v-if="props.error" class="text-sm text-error-500">
      {{ props.error }}
    </p>
  </div>
</template>
