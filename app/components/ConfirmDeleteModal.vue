<script setup lang="ts">
import BaseModal from './BaseModal.vue';
import BaseButton from './BaseButton.vue';
import { PhTrash, PhWarning } from '@phosphor-icons/vue';

defineProps<{
  show: boolean;
  title?: string;
  message?: string;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'confirm'): void;
}>();
</script>

<template>
  <BaseModal :show="show" @close="emit('close')" size="sm">
    <template #title>
      <div class="flex items-center gap-2 text-error-600">
        <PhWarning weight="fill" />
        {{ title || 'Confirmar Exclusão' }}
      </div>
    </template>

    <div class="flex flex-col items-center text-center py-2">
      <div class="p-4 bg-error-50 text-error-500 rounded-full mb-4">
        <PhTrash :size="32" weight="duotone" />
      </div>
      <p class="text-neutral-600 font-sans leading-relaxed">
        {{ message || 'Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.' }}
      </p>
    </div>

    <template #footer>
      <BaseButton variant="ghost" @click="emit('close')" :disabled="loading">
        Cancelar
      </BaseButton>
      <BaseButton variant="primary" class="!bg-error-500 hover:!bg-error-600 !border-error-500" @click="emit('confirm')" :loading="loading">
        Excluir Permanentemente
      </BaseButton>
    </template>
  </BaseModal>
</template>
