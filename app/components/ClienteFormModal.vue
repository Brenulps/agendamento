<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import BaseModal from './BaseModal.vue';
import BaseButton from './BaseButton.vue';
import BaseInput from './BaseInput.vue';
import { PhUserPlus, PhUserCircle, PhIdentificationCard } from '@phosphor-icons/vue';
import type { Cliente } from '~/../shared/types/Cliente';

const props = defineProps<{
  show: boolean;
  loading?: boolean;
  cliente?: Cliente | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'submit', data: Omit<Cliente, 'id' | 'created_at'>): void;
}>();

const form = ref({
  nome: '',
  email: '',
  telefone: ''
});

const isEditing = computed(() => !!props.cliente);

watch(() => props.show, (isVisible) => {
  if (isVisible) {
    if (props.cliente) {
      form.value = {
        nome: props.cliente.nome,
        email: props.cliente.email,
        telefone: props.cliente.telefone || ''
      };
    } else {
      form.value = {
        nome: '',
        email: '',
        telefone: ''
      };
    }
  }
});

const isFormValid = computed(() => 
  form.value.nome.trim() !== '' && 
  form.value.email.trim() !== '' && 
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)
);

const handleSubmit = () => {
  if (isFormValid.value) {
    emit('submit', { ...form.value });
  }
};
</script>

<template>
  <BaseModal :show="show" @close="emit('close')" size="md">
    <template #title>
      <div class="flex items-center gap-2">
        <PhUserPlus v-if="!isEditing" weight="fill" class="text-primary-500" />
        <PhUserCircle v-else weight="fill" class="text-primary-500" />
        {{ isEditing ? 'Editar Cliente' : 'Novo Cliente' }}
      </div>
    </template>

    <div class="space-y-6 py-2">
      <p class="text-sm text-neutral-500">
        {{ isEditing ? 'Atualize as informações do cliente selecionado.' : 'Preencha os dados abaixo para cadastrar um novo cliente.' }}
      </p>

      <div class="grid gap-5">
        <BaseInput
          v-model="form.nome"
          label="Nome Completo"
          placeholder="Ex: João Silva"
          :disabled="loading"
          required
        />

        <BaseInput
          v-model="form.email"
          label="E-mail"
          type="email"
          placeholder="Ex: joao@email.com"
          :disabled="loading"
          required
        />

        <BaseInput
          v-model="form.telefone"
          label="Telefone (Opcional)"
          placeholder="Ex: (11) 99999-9999"
          :disabled="loading"
        />
      </div>

      <!-- Preview -->
      <div v-if="form.nome" class="bg-neutral-50 rounded-xl p-4 border border-neutral-100 flex items-center gap-3">
        <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary-500 shadow-sm border border-neutral-100">
          <PhIdentificationCard :size="20" weight="duotone" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-bold text-neutral-400 uppercase tracking-wider">Visualização</p>
          <p class="text-sm font-semibold text-neutral-700 truncate">
            {{ form.nome }}
          </p>
        </div>
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
        :disabled="!isFormValid"
      >
        {{ isEditing ? 'Salvar Alterações' : 'Cadastrar Cliente' }}
      </BaseButton>
    </template>
  </BaseModal>
</template>
