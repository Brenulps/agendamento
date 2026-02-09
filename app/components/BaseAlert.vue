<script setup lang="ts">
import { PhInfo, PhCheckCircle, PhWarning, PhXCircle, PhX } from '@phosphor-icons/vue';

interface Props {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  dismissible?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'info',
  dismissible: false,
});

const emit = defineEmits<{
  dismiss: [];
}>();

const id = 'base-alert';

const variantClasses: Record<string, string> = {
  info: 'bg-primary-50 border-primary-200 text-primary-900',
  success: 'bg-success-50 border-success-200 text-success-900',
  warning: 'bg-warning-50 border-warning-200 text-warning-900',
  error: 'bg-error-50 border-error-200 text-error-900',
};

const iconColorClasses: Record<string, string> = {
  info: 'text-primary-500',
  success: 'text-success-500',
  warning: 'text-warning-500',
  error: 'text-error-500',
};
</script>

<template>
  <div
    :id="id"
    :class="[
      'flex items-start gap-3 p-4 rounded-lg border',
      variantClasses[props.variant],
    ]"
  >
    <PhInfo
      v-if="props.variant === 'info'"
      :size="20"
      weight="fill"
      :class="iconColorClasses[props.variant]"
      class="flex-shrink-0 mt-0.5"
    />
    <PhCheckCircle
      v-else-if="props.variant === 'success'"
      :size="20"
      weight="fill"
      :class="iconColorClasses[props.variant]"
      class="flex-shrink-0 mt-0.5"
    />
    <PhWarning
      v-else-if="props.variant === 'warning'"
      :size="20"
      weight="fill"
      :class="iconColorClasses[props.variant]"
      class="flex-shrink-0 mt-0.5"
    />
    <PhXCircle
      v-else-if="props.variant === 'error'"
      :size="20"
      weight="fill"
      :class="iconColorClasses[props.variant]"
      class="flex-shrink-0 mt-0.5"
    />
    
    <div class="flex-1 min-w-0">
      <h4 v-if="props.title" class="font-semibold mb-1">
        {{ props.title }}
      </h4>
      <div class="text-sm">
        <slot />
      </div>
    </div>

    <button
      v-if="props.dismissible"
      @click="emit('dismiss')"
      :class="[
        'flex-shrink-0 p-1 rounded hover:bg-black/5 transition-colors',
        iconColorClasses[props.variant],
      ]"
      aria-label="Fechar alerta"
    >
      <PhX :size="16" weight="bold" />
    </button>
  </div>
</template>
