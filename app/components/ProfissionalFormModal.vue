<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import BaseModal from './BaseModal.vue';
import BaseButton from './BaseButton.vue';
import BaseSelect from './BaseSelect.vue';
import { PhUserPlus, PhIdentificationBadge } from '@phosphor-icons/vue';
import { useUsuarios } from '~/composables/useUsuarios';
import { useEspecialidades } from '~/composables/useEspecialidades';

const props = defineProps<{
  show: boolean;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'submit', data: { userId: string, especialidadeId: number }): void;
}>();

const { usuarios, fetchUsuarios, isLoading: loadingUsers } = useUsuarios();
const { especialidades, fetchEspecialidades, isLoading: loadingSpecialties } = useEspecialidades();

const selectedUserId = ref('');
const selectedEspecialidadeId = ref<string>('');

const userOptions = computed(() => 
  usuarios.value.map(u => ({
    value: u.id,
    label: (u.name || u.email || 'Usuário sem nome') as string
  }))
);

const especialidadeOptions = computed(() => 
  especialidades.value.map(e => ({
    value: e.id.toString(),
    label: e.nome
  }))
);

onMounted(async () => {
  await Promise.all([
    fetchUsuarios(),
    fetchEspecialidades()
  ]);
});

const isFormValid = computed(() => 
  selectedUserId.value && selectedEspecialidadeId.value
);

const handleSubmit = () => {
  if (isFormValid.value) {
    emit('submit', {
      userId: selectedUserId.value,
      especialidadeId: Number(selectedEspecialidadeId.value)
    });
  }
};

const resetForm = () => {
  selectedUserId.value = '';
  selectedEspecialidadeId.value = '';
};

// Reset form when modal opens
watch(() => props.show, (isVisible) => {
  if (isVisible) {
    resetForm();
  }
});
</script>

<template>
  <BaseModal :show="show" @close="emit('close')" size="md">
    <template #title>
      <div class="flex items-center gap-2">
        <PhUserPlus weight="fill" class="text-primary-500" />
        Novo Profissional
      </div>
    </template>

    <div class="space-y-6 py-2">
      <p class="text-sm text-neutral-500">
        Relacione um usuário existente a uma especialidade para torná-lo um profissional no sistema.
      </p>

      <div class="grid gap-5">
        <!-- Seleção de Usuário -->
        <BaseSelect
          v-model="selectedUserId"
          label="Usuário"
          :options="userOptions"
          placeholder="Selecione um usuário..."
          :disabled="loading || loadingUsers"
        />

        <!-- Seleção de Especialidade -->
        <BaseSelect
          v-model="selectedEspecialidadeId"
          label="Especialidade"
          :options="especialidadeOptions"
          placeholder="Selecione uma especialidade..."
          :disabled="loading || loadingSpecialties"
        />
      </div>

      <!-- User Info Preview (Optional/Polishing) -->
      <div v-if="selectedUserId" class="bg-neutral-50 rounded-xl p-4 border border-neutral-100 flex items-center gap-3">
        <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary-500 shadow-sm border border-neutral-100">
          <PhIdentificationBadge :size="20" weight="duotone" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-bold text-neutral-400 uppercase tracking-wider">Usuário Selecionado</p>
          <p class="text-sm font-semibold text-neutral-700 truncate">
            {{ usuarios.find(u => u.id === selectedUserId)?.name || usuarios.find(u => u.id === selectedUserId)?.email }}
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
        Vincular Profissional
      </BaseButton>
    </template>
  </BaseModal>
</template>
