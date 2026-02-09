<script setup lang="ts">
import { PhInfo, PhCheckCircle, PhWarning, PhXCircle, PhX } from '@phosphor-icons/vue';
import { onMounted, ref } from 'vue';
import type { Toast } from '../../shared/types/Toast';

interface Props {
  toast: Toast;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  remove: [id: string];
}>();

const id = 'base-toast';
const isVisible = ref(false);

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

onMounted(() => {
  // Animação de entrada
  setTimeout(() => {
    isVisible.value = true;
  }, 10);

  // Auto-remover após duração
  const duration = props.toast.duration || 5000;
  setTimeout(() => {
    handleRemove();
  }, duration);
});

function handleRemove(): void {
  isVisible.value = false;
  // Aguardar animação de saída antes de remover
  setTimeout(() => {
    emit('remove', props.toast.id);
  }, 300);
}
</script>

<template>
  <div
    :id="id"
    :class="[
      'flex items-start gap-3 p-4 rounded-lg border shadow-lg min-w-[320px] max-w-md',
      'transition-all duration-300 transform',
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0',
      variantClasses[toast.variant],
    ]"
  >
    <PhInfo
      v-if="toast.variant === 'info'"
      :size="20"
      weight="fill"
      :class="iconColorClasses[toast.variant]"
      class="flex-shrink-0 mt-0.5"
    />
    <PhCheckCircle
      v-else-if="toast.variant === 'success'"
      :size="20"
      weight="fill"
      :class="iconColorClasses[toast.variant]"
      class="flex-shrink-0 mt-0.5"
    />
    <PhWarning
      v-else-if="toast.variant === 'warning'"
      :size="20"
      weight="fill"
      :class="iconColorClasses[toast.variant]"
      class="flex-shrink-0 mt-0.5"
    />
    <PhXCircle
      v-else-if="toast.variant === 'error'"
      :size="20"
      weight="fill"
      :class="iconColorClasses[toast.variant]"
      class="flex-shrink-0 mt-0.5"
    />
    
    <div class="flex-1 min-w-0">
      <h4 v-if="toast.title" class="font-semibold mb-1">
        {{ toast.title }}
      </h4>
      <p class="text-sm">
        {{ toast.message }}
      </p>
    </div>

    <button
      @click="handleRemove"
      :class="[
        'flex-shrink-0 p-1 rounded hover:bg-black/5 transition-colors',
        iconColorClasses[toast.variant],
      ]"
      aria-label="Fechar notificação"
    >
      <PhX :size="16" weight="bold" />
    </button>
  </div>
</template>
