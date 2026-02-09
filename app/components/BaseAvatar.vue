<script setup lang="ts">
import { PhUser } from '@phosphor-icons/vue';

interface Props {
  src?: string;
  alt?: string;
  initials?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const props = withDefaults(defineProps<Props>(), {
  src: '',
  alt: 'Avatar',
  initials: '',
  size: 'md',
});

const id = 'base-avatar';

const sizeClasses: Record<string, string> = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

const iconSizes: Record<string, number> = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};
</script>

<template>
  <div
    :id="id"
    :class="[
      'relative inline-flex items-center justify-center rounded-full bg-primary-100 text-primary-700 font-semibold overflow-hidden',
      sizeClasses[props.size],
    ]"
  >
    <img
      v-if="props.src"
      :src="props.src"
      :alt="props.alt"
      class="w-full h-full object-cover"
    />
    <span v-else-if="props.initials">
      {{ props.initials }}
    </span>
    <PhUser
      v-else
      :size="iconSizes[props.size]"
      weight="fill"
      class="text-primary-400"
    />
  </div>
</template>
