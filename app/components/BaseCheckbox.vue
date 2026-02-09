<script setup lang="ts">
import { PhCheck } from '@phosphor-icons/vue';
import { useId } from 'vue';

interface Props {
  modelValue?: boolean;
  label?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  label: '',
  disabled: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const id = `base-checkbox-${useId()}`;

function onChange(event: Event): void {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.checked);
}
</script>

<template>
  <label
    :for="id"
    :class="[
      'inline-flex items-center gap-3 cursor-pointer select-none',
      props.disabled && 'opacity-50 cursor-not-allowed',
    ]"
  >
    <div class="relative">
      <input
        :id="id"
        type="checkbox"
        :checked="props.modelValue"
        :disabled="props.disabled"
        class="peer sr-only"
        @change="onChange"
      />
      <div
        :class="[
          'w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center',
          'peer-focus:ring-2 peer-focus:ring-primary-500 peer-focus:ring-offset-2',
          props.modelValue
            ? 'bg-primary-500 border-primary-500'
            : 'bg-white border-neutral-300 hover:border-neutral-400',
        ]"
      >
        <PhCheck
          v-if="props.modelValue"
          :size="14"
          weight="bold"
          class="text-white"
        />
      </div>
    </div>
    
    <span v-if="props.label" class="text-neutral-700">
      {{ props.label }}
    </span>
  </label>
</template>
