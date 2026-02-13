<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import BaseModal from '../BaseModal.vue';
import BaseButton from '../BaseButton.vue';
import BaseInput from '../BaseInput.vue';
import BaseSelect from '../BaseSelect.vue';
import { PhCalendarPlus, PhUser, PhClock, PhUserGear } from '@phosphor-icons/vue';
import { useClientes } from '~/composables/useClientes';
import { useProfissionais } from '~/composables/useProfissionais';
import { useAgendamentoActions } from '~/composables/useAgendamentoActions';
import type { Agendamento } from '~/../shared/types/Agendamento';

const props = defineProps<{
  show: boolean;
  loading?: boolean;
  agendamento?: Partial<Agendamento> | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'success'): void;
}>();

const { clientes, fetchClientes } = useClientes();
const { profissionais, fetchProfissionais } = useProfissionais();
const { createAgendamento, updateAgendamento, isLoading } = useAgendamentoActions();

const form = ref({
  cliente_id: null as number | null,
  profissional_id: null as number | null,
  data: '',
  hora: '',
  status: 'pendente' as Agendamento['status'],
  observacoes: ''
});

const loadData = async () => {
  await Promise.all([
    fetchClientes(),
    fetchProfissionais()
  ]);
};

watch(() => props.show, (isVisible) => {
  if (isVisible) {
    loadData();
    if (props.agendamento) {
      const dataHora = props.agendamento.data_hora ? new Date(props.agendamento.data_hora) : new Date();
      form.value = {
        cliente_id: props.agendamento.cliente_id || null,
        profissional_id: props.agendamento.profissional_id || null,
        data: (dataHora.toISOString().split('T')[0]) || '',
        hora: (dataHora.toTimeString().slice(0, 5)) || '',
        status: props.agendamento.status || 'pendente',
        observacoes: props.agendamento.observacoes || ''
      };
    } else {
      form.value = {
        cliente_id: null,
        profissional_id: null,
        data: new Date().toISOString().split('T')[0],
        hora: '08:00',
        status: 'pendente',
        observacoes: ''
      };
    }
  }
});

const isFormValid = computed(() => {
  if (!form.value.cliente_id || !form.value.profissional_id || !form.value.data || !form.value.hora) {
    return false;
  }
  
  if (form.value.hora > '16:00') {
    return false;
  }

  const selectedDate = new Date(`${form.value.data}T${form.value.hora}:00`);
  return selectedDate >= new Date();
});

const handleSubmit = async () => {
  if (isFormValid.value) {
    const dataHora = new Date(`${form.value.data}T${form.value.hora}:00`);
    const payload = {
      cliente_id: form.value.cliente_id!,
      profissional_id: form.value.profissional_id!,
      data_hora: dataHora.toISOString(),
      status: form.value.status,
      observacoes: form.value.observacoes
    };

    try {
      if (props.agendamento?.id) {
        await updateAgendamento(props.agendamento.id, payload);
      } else {
        await createAgendamento(payload);
      }
      emit('success');
    } catch (e) {
      console.error(e);
      // Error handling is managed by the composable (error ref), but we could show a toast here
    }
  }
};
</script>

<template>
  <BaseModal :show="show" @close="emit('close')" size="md">
    <template #title>
      <div class="flex items-center gap-2">
        <PhCalendarPlus weight="fill" class="text-primary-500" />
        {{ agendamento?.id ? 'Editar Agendamento' : 'Novo Agendamento' }}
      </div>
    </template>

    <div class="space-y-6 py-2">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <BaseSelect
          v-model="form.cliente_id"
          label="Cliente"
          :options="clientes.map(c => ({ value: c.id, label: c.nome }))"
          placeholder="Selecione um cliente"
          :disabled="loading"
          required
        >
          <template #icon><PhUser :size="18" /></template>
        </BaseSelect>

        <BaseSelect
          v-model="form.profissional_id"
          label="Profissional"
          :options="profissionais.map(p => ({ value: p.profissional_id, label: p.user_name }))"
          placeholder="Selecione um profissional"
          :disabled="loading"
          required
        >
          <template #icon><PhUserGear :size="18" /></template>
        </BaseSelect>

        <BaseInput
          v-model="form.data"
          label="Data"
          type="date"
          :disabled="loading"
          required
        >
          <template #icon><PhCalendarPlus :size="18" /></template>
        </BaseInput>

        <BaseInput
          v-model="form.hora"
          label="Horário"
          type="time"
          :disabled="loading"
          required
        >
          <template #icon><PhClock :size="18" /></template>
        </BaseInput>
      </div>

      <div class="space-y-4">
        <BaseSelect
          v-model="form.status"
          label="Status"
          :options="[
            { value: 'pendente', label: 'Pendente' },
            { value: 'confirmado', label: 'Confirmado' },
            { value: 'cancelado', label: 'Cancelado' },
            { value: 'concluido', label: 'Concluído' }
          ]"
          :disabled="loading"
        />

        <BaseInput
          v-model="form.observacoes"
          label="Observações"
          placeholder="Alguma nota importante?"
          :disabled="loading"
          is-textarea
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
        :loading="isLoading || loading"
        :disabled="!isFormValid || isLoading || loading"
      >
        {{ agendamento?.id ? 'Salvar Alterações' : 'Criar Agendamento' }}
      </BaseButton>
    </template>
  </BaseModal>
</template>
