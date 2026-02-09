<script setup lang="ts">
import { PhSpinner } from '@phosphor-icons/vue';

interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
});

const id = 'base-button';

const variantClasses: Record<string, string> = {
  primary: 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 shadow-button',
  secondary: 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 active:bg-neutral-300',
  outline: 'border border-neutral-300 text-neutral-700 hover:bg-neutral-50 active:bg-neutral-100',
  ghost: 'text-neutral-600 hover:bg-neutral-100 active:bg-neutral-200',
  danger: 'bg-error-500 text-white hover:bg-error-600 active:bg-error-700',
};

const sizeClasses: Record<string, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

const iconSizes: Record<string, number> = {
  sm: 14,
  md: 16,
  lg: 20,
};
</script>

<template>
  <button
    :id="id"
    :disabled="props.disabled || props.loading"
    :class="[
      'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 cursor-pointer',
      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      variantClasses[props.variant],
      sizeClasses[props.size],
    ]"
  >
    <PhSpinner
      v-if="props.loading"
      :size="iconSizes[props.size]"
      weight="bold"
      class="animate-spin"
    />
    <slot v-else name="icon" />
    <slot />
  </button>
</template>
