<script setup lang="ts">
interface Props {
  variant?: 'default' | 'bordered' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  padding: 'md',
});

const id = 'base-card';

const variantClasses: Record<string, string> = {
  default: 'bg-white border border-neutral-200',
  bordered: 'bg-white border-2 border-neutral-300',
  elevated: 'bg-white shadow-card',
};

const paddingClasses: Record<string, string> = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};
</script>

<template>
  <div
    :id="id"
    :class="[
      'rounded-xl',
      variantClasses[props.variant],
      paddingClasses[props.padding],
    ]"
  >
    <slot />
  </div>
</template>
