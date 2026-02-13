<script setup lang="ts">
import { PhEye, PhEyeSlash, PhEnvelope, PhLock, PhUser, PhPhone } from '@phosphor-icons/vue';
import { useId, ref, computed } from 'vue';

interface Props {
  modelValue?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'date' | 'time';
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
const showPassword = ref(false);

const currentType = computed(() => {
  if (props.type === 'password' && showPassword.value) {
    return 'text';
  }
  return props.type;
});

const leftIcon = computed(() => {
  switch (props.type) {
    case 'email':
      return PhEnvelope;
    case 'password':
      return PhLock;
    case 'tel':
      return PhPhone;
    default:
      return null;
  }
});

function onInput(event: Event): void {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
}

function togglePasswordVisibility(): void {
  showPassword.value = !showPassword.value;
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
      <component
        v-if="leftIcon"
        :is="leftIcon"
        :size="20"
        weight="regular"
        class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
      />
      
      <input
        :id="id"
        :type="currentType"
        :value="props.modelValue"
        :placeholder="props.placeholder"
        :disabled="props.disabled"
        :class="[
          'w-full py-2.5 rounded-lg border text-base transition-all duration-200',
          'placeholder:text-neutral-400',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
          'disabled:bg-neutral-100 disabled:cursor-not-allowed',
          leftIcon ? 'pl-11 pr-4' : 'px-4',
          props.type === 'password' ? 'pr-11' : '',
          props.error
            ? 'border-error-500 focus:ring-error-500 focus:border-error-500'
            : 'border-neutral-300 hover:border-neutral-400',
        ]"
        @input="onInput"
      />
      
      <button
        v-if="props.type === 'password'"
        type="button"
        @click="togglePasswordVisibility"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
        :aria-label="showPassword ? 'Ocultar senha' : 'Mostrar senha'"
      >
        <PhEye v-if="!showPassword" :size="20" weight="regular" />
        <PhEyeSlash v-else :size="20" weight="regular" />
      </button>
    </div>
    
    <p v-if="props.error" class="text-sm text-error-500">
      {{ props.error }}
    </p>
  </div>
</template>
