<script setup lang="ts">
import { ref, watch } from 'vue';
import BaseModal from './BaseModal.vue';
import BaseButton from './BaseButton.vue';
import { PhMagicWand, PhPencil } from '@phosphor-icons/vue';

interface EspecialidadeData {
  id?: number;
  nome: string;
}

const props = defineProps<{
  show: boolean;
  edit?: boolean;
  data?: EspecialidadeData | null;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'submit', nome: string): void;
}>();

const nome = ref('');

// Sincronizar campo quando o modal abre
watch(() => props.show, (isVisible) => {
  if (isVisible) {
    nome.value = props.data?.nome || '';
  }
});

const handleSubmit = () => {
  if (nome.value.trim()) {
    emit('submit', nome.value.trim());
  }
};
</script>

<template>
  <BaseModal :show="show" @close="emit('close')" size="sm">
    <template #title>
      <div class="flex items-center gap-2">
        <component :is="edit ? PhPencil : PhMagicWand" weight="fill" class="text-primary-500" />
        {{ edit ? 'Editar Especialidade' : 'Nova Especialidade' }}
      </div>
    </template>

    <div class="space-y-4 py-2">
      <div class="space-y-1.5">
        <label for="modal-nome" class="text-sm font-semibold text-neutral-700 ml-1">Nome da Especialidade</label>
        <input 
          id="modal-nome"
          v-model="nome"
          type="text"
          placeholder="Ex: Cardiologista, Pediatra..."
          class="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-sans text-neutral-900"
          @keyup.enter="handleSubmit"
        />
      </div>
    </div>

    <template #footer>
      <BaseButton variant="ghost" @click="emit('close')" :disabled="loading">
        Cancelar
      </BaseButton>
      <BaseButton 
        variant="primary" 
        @click="handleSubmit" 
        :loading="loading"
        :disabled="!nome.trim()"
      >
        {{ edit ? 'Salvar Alterações' : 'Criar Especialidade' }}
      </BaseButton>
    </template>
  </BaseModal>
</template>
