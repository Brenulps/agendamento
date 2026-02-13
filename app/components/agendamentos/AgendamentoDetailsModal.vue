<script setup lang="ts">
import BaseModal from '../BaseModal.vue';
import BaseButton from '../BaseButton.vue';
import { 
  PhCalendarBlank, 
  PhClock, 
  PhUser, 
  PhUserGear, 
  PhNote, 
  PhPencilSimple, 
  PhTrash, 
  PhX 
} from '@phosphor-icons/vue';
import type { Agendamento } from '~/../shared/types/Agendamento';
import { computed } from 'vue';

const props = defineProps<{
  show: boolean;
  agendamento: Agendamento | null;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'edit', agendamento: Agendamento): void;
  (e: 'cancel', agendamento: Agendamento): void;
  (e: 'delete', agendamento: Agendamento): void;
}>();

const formattedDate = computed(() => {
  if (!props.agendamento?.data_hora) return '';
  return new Date(props.agendamento.data_hora).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
});

const formattedTime = computed(() => {
  if (!props.agendamento?.data_hora) return '';
  return new Date(props.agendamento.data_hora).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });
});

const statusColor = computed(() => {
  switch (props.agendamento?.status) {
    case 'confirmado': return 'text-green-600 bg-green-50 border-green-100';
    case 'cancelado': return 'text-red-600 bg-red-50 border-red-100';
    case 'concluido': return 'text-blue-600 bg-blue-50 border-blue-100';
    default: return 'text-orange-600 bg-orange-50 border-orange-100';
  }
});

const statusLabel = computed(() => {
  switch (props.agendamento?.status) {
    case 'confirmado': return 'Confirmado';
    case 'cancelado': return 'Cancelado';
    case 'concluido': return 'Concluído';
    default: return 'Pendente';
  }
});
</script>

<template>
  <BaseModal :show="show" @close="emit('close')" size="md">
    <template #title>
      <div class="flex items-center gap-2">
        <PhCalendarBlank weight="fill" class="text-primary-500" />
        Detalhes do Agendamento
      </div>
    </template>

    <div v-if="agendamento" class="space-y-6 py-2">
      <!-- Header com Status -->
      <div class="flex items-center justify-between bg-neutral-50 p-4 rounded-xl border border-neutral-100">
        <div class="flex flex-col">
          <span class="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Data e Hora</span>
          <div class="flex items-center gap-3">
             <div class="flex items-center gap-1.5 text-neutral-700 font-medium">
                <PhCalendarBlank :size="16" class="text-primary-500" />
                {{ formattedDate }}
             </div>
             <div class="w-px h-4 bg-neutral-200"></div>
             <div class="flex items-center gap-1.5 text-neutral-700 font-medium">
                <PhClock :size="16" class="text-primary-500" />
                {{ formattedTime }}
             </div>
          </div>
        </div>
        
        <div :class="['px-3 py-1 rounded-full text-xs font-bold border', statusColor]">
          {{ statusLabel }}
        </div>
      </div>

      <!-- Informações Principais -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-1">
          <div class="flex items-center gap-2 text-neutral-500 text-xs font-bold uppercase tracking-wider">
            <PhUser :size="14" />
            Cliente
          </div>
          <p class="text-base font-medium text-neutral-800">{{ agendamento.cliente?.nome || 'Cliente não identificado' }}</p>
          <p class="text-sm text-neutral-500">{{ agendamento.cliente?.email || '-' }}</p>
        </div>

        <div class="space-y-1">
           <div class="flex items-center gap-2 text-neutral-500 text-xs font-bold uppercase tracking-wider">
            <PhUserGear :size="14" />
            Profissional
          </div>
          <p class="text-base font-medium text-neutral-800">{{ agendamento.profissional?.users?.nome || 'Profissional não identificado' }}</p>
        </div>
      </div>

      <!-- Observações -->
      <div v-if="agendamento.observações" class="space-y-2 pt-2 border-t border-neutral-50">
        <div class="flex items-center gap-2 text-neutral-500 text-xs font-bold uppercase tracking-wider">
          <PhNote :size="14" />
          Observações
        </div>
        <p class="text-sm text-neutral-600 bg-neutral-50 p-3 rounded-lg border border-neutral-100 italic">
          "{{ agendamento.observações }}"
        </p>
      </div>
    </div>

    <!-- Actions -->
    <template #footer>
      <div class="flex w-full justify-between items-center">
        <div class="flex items-center gap-2">
           <BaseButton 
            variant="danger" 
            @click="emit('delete', agendamento!)" 
            :disabled="loading"
          >
            <template #icon><PhTrash :size="16" /></template>
            Deletar
          </BaseButton>
          <BaseButton 
            variant="ghost" 
            @click="emit('cancel', agendamento!)" 
            :disabled="loading || (agendamento?.status as string) === 'cancelado'"
            v-if="(agendamento?.status as string) !== 'cancelado'"
            class="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
          >
            <template #icon><PhX :size="16" /></template>
            Cancelar
          </BaseButton>
        </div>

        <div class="flex items-center gap-2">
           <BaseButton variant="ghost" @click="emit('close')" :disabled="loading">
            Fechar
          </BaseButton>
          <BaseButton 
            variant="primary" 
            @click="emit('edit', agendamento!)" 
            :disabled="loading || agendamento?.status === 'cancelado'"
          >
            <template #icon><PhPencilSimple :size="16" /></template>
            Editar
          </BaseButton>
        </div>
      </div>
    </template>
  </BaseModal>
</template>
