<script setup lang="ts">
import { useId } from 'vue';

interface Props {
  modelValue?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  placeholder: '',
  label: '',
  error: '',
  disabled: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const id = `base-input-${useId()}`;

function onInput(event: Event): void {
  const target = event.target as HTMLInputElement;
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
    
    <input
      :id="id"
      :type="props.type"
      :value="props.modelValue"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      :class="[
        'w-full px-4 py-2.5 rounded-lg border text-base transition-all duration-200',
        'placeholder:text-neutral-400',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
        'disabled:bg-neutral-100 disabled:cursor-not-allowed',
        props.error
          ? 'border-error-500 focus:ring-error-500 focus:border-error-500'
          : 'border-neutral-300 hover:border-neutral-400',
      ]"
      @input="onInput"
    />
    
    <p v-if="props.error" class="text-sm text-error-500">
      {{ props.error }}
    </p>
  </div>
</template>
