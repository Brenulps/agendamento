<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAgendamentoStore } from '~/stores/agendamento';
import { 
  PhCalendarCheck, 
  PhCaretLeft, 
  PhCaretRight,
  PhCalendarBlank,
  PhClock,
  PhPlus,
  PhMagnifyingGlass
} from '@phosphor-icons/vue';
import BaseButton from '~/components/BaseButton.vue';
import AgendamentoGrid from '~/components/agendamentos/AgendamentoGrid.vue';
import ReguaHorarios from '~/components/agendamentos/ReguaHorarios.vue';
import AgendamentoFormModal from '~/components/agendamentos/AgendamentoFormModal.vue';
import AgendamentoDetailsModal from '~/components/agendamentos/AgendamentoDetailsModal.vue';
import { useAgendamentoActions } from '~/composables/useAgendamentoActions';
import type { Agendamento } from '~/../shared/types/Agendamento';

const store = useAgendamentoStore();
const { updateAgendamento, deleteAgendamento } = useAgendamentoActions();
const showModal = ref(false);
const showDetailsModal = ref(false);
const loading = ref(false);
const selectedAgendamento = ref<Partial<Agendamento> | Agendamento | null>(null);

const onSlotClick = ({ data, hora }: { data: Date, hora: number }) => {
  selectedAgendamento.value = {
    data_hora: new Date(data.setHours(hora, 0, 0, 0)).toISOString()
  };
  showModal.value = true;
};

const openNewModal = () => {
  selectedAgendamento.value = null;
  showModal.value = true;
};

const onEventClick = (agendamento: Agendamento) => {
  selectedAgendamento.value = agendamento;
  showDetailsModal.value = true;
};

const onEditAgendamento = (agendamento: Agendamento) => {
  selectedAgendamento.value = agendamento;
  showDetailsModal.value = false;
  showModal.value = true;
};

const onCancelAgendamento = async (agendamento: Agendamento) => {
  if (!confirm('Tem certeza que deseja cancelar este agendamento?')) return;
  
  loading.value = true;
  try {
     await updateAgendamento(agendamento.id, { status: 'cancelado' });
     showDetailsModal.value = false;
  } catch (error) {
    console.error('Erro ao cancelar agendamento:', error);
  } finally {
    loading.value = false;
  }
};

const onDeleteAgendamento = async (agendamento: Agendamento) => {
  if (!confirm('Tem certeza que deseja DELETAR este agendamento permanentemente?')) return;
  
  loading.value = true;
  try {
     await deleteAgendamento(agendamento.id);
     showDetailsModal.value = false;
  } catch (error) {
    console.error('Erro ao deletar agendamento:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  store.fetchAgendamentos();
});



const meses = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const tituloMesAno = computed(() => {
  const data = store.dataReferencia;
  return `${meses[data.getMonth()]} ${data.getFullYear()}`;
});

const formatarDia = (data: Date) => {
  return data.getDate().toString().padStart(2, '0');
};

const formatarDiaSemana = (data: Date) => {
  const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  return dias[data.getDay()];
};

const isHoje = (data: Date) => {
  const hoje = new Date();
  return data.getDate() === hoje.getDate() &&
         data.getMonth() === hoje.getMonth() &&
         data.getFullYear() === hoje.getFullYear();
};

const getDomingo = (data: Date) => {
  const d = new Date(data);
  const diaSemana = d.getDay();
  const domingo = new Date(d);
  domingo.setDate(d.getDate() - diaSemana);
  domingo.setHours(0, 0, 0, 0);
  return domingo;
};

const diffSemanas = computed(() => {
  const hoje = new Date();
  const domingoAtual = getDomingo(hoje);
  const domingoReferencia = getDomingo(store.dataReferencia);
  
  const diffTime = domingoReferencia.getTime() - domingoAtual.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24 * 7));
});

const exibirIrParaHoje = computed(() => {
  return Math.abs(diffSemanas.value) > 3;
});

const tituloSemana = computed(() => {
  if (diffSemanas.value === 0) return 'Esta semana';
  if (diffSemanas.value === -1) return 'Semana passada';
  if (diffSemanas.value === 1) return 'Próxima semana';
  if (diffSemanas.value < 0) return `${Math.abs(diffSemanas.value)} semanas atrás`;
  return `Em ${diffSemanas.value} semanas`;
});

const dataSelecionada = ref(new Date());

const isSelecionada = (data: Date) => {
  return data.getDate() === dataSelecionada.value.getDate() &&
         data.getMonth() === dataSelecionada.value.getMonth() &&
         data.getFullYear() === dataSelecionada.value.getFullYear();
};

const selecionarDia = (data: Date) => {
  dataSelecionada.value = data;
};
</script>

<template>
  <div class="agendamento-manager flex flex-col h-full bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
    <!-- Header: Navegação e Mes/Ano -->
    <div class="agendamento-header px-6 py-4 border-b border-neutral-100 bg-white flex items-center justify-between shrink-0">
      <!-- Left: Month/Year -->
      <div class="flex items-center gap-4">
        <h2 class="text-xl font-bold text-neutral-800 font-sans tracking-tight">
          {{ tituloMesAno }}
        </h2>
        
        <!-- Today button -->
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <button 
            v-if="exibirIrParaHoje"
            @click="store.setDataReferencia(new Date())"
            class="text-[9px] font-black text-primary-500 bg-primary-50 hover:bg-primary-100 px-2 py-1 rounded-md border border-primary-100 transition-colors uppercase tracking-wider"
          >
            Hoje
          </button>
        </Transition>
      </div>

      <!-- Center: Week Navigation (Restored) -->
      <div class="flex items-center bg-neutral-50 p-1 rounded-xl border border-neutral-100">
        <button 
          @click="store.voltarSemana"
          class="p-1 hover:bg-white hover:shadow-sm rounded-lg transition-all text-neutral-400 hover:text-neutral-700"
        >
          <PhCaretLeft :size="16" weight="bold" />
        </button>
        
        <div class="px-4 min-w-[120px] text-center">
          <span class="text-[11px] font-bold text-neutral-700">
            {{ tituloSemana }}
          </span>
        </div>

        <button 
          @click="store.avancarSemana"
          class="p-1 hover:bg-white hover:shadow-sm rounded-lg transition-all text-neutral-400 hover:text-neutral-700"
        >
          <PhCaretRight :size="16" weight="bold" />
        </button>
      </div>

      <!-- Right: Search and Add -->
      <div class="flex items-center gap-3">
        <button class="p-1.5 text-neutral-400 hover:text-neutral-700 transition-colors">
          <PhMagnifyingGlass :size="18" weight="bold" />
        </button>
        <button 
          @click="openNewModal"
          class="flex items-center gap-1.5 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white px-4 py-2 rounded-xl font-bold text-xs shadow-md shadow-primary-500/10 transition-all group"
        >
          <PhPlus :size="14" weight="bold" class="transition-transform group-hover:rotate-90" />
          Novo
        </button>
      </div>
    </div>
    
    <!-- Body: Grade Semanal -->
    <div class="agendamento-body flex-1 overflow-auto p-4 bg-white flex flex-col">
      <div v-if="store.isLoading" class="flex flex-col items-center justify-center h-full text-neutral-400">
        <PhCalendarCheck :size="48" weight="thin" class="animate-pulse mb-4" />
        <span class="text-sm font-medium">Sincronizando agendamentos...</span>
      </div>
      
      <div v-else class="flex flex-col h-full overflow-hidden">
        <div class="flex flex-1 overflow-hidden">
          <!-- Régua de Horários -->
          <ReguaHorarios />
          
          <!-- Componente da Grade de Agendamentos -->
          <AgendamentoGrid 
            :dias="store.diasDaSemana" 
            :data-selecionada="dataSelecionada"
            @slot-click="onSlotClick"
            @event-click="onEventClick"
            class="flex-1" 
          />
        </div>
      </div>
    </div>

    <!-- Modals -->
    <AgendamentoFormModal
      :show="showModal"
      :agendamento="selectedAgendamento"
      @close="showModal = false"
      @success="() => {
        showModal = false;
        // AgendamentoActions already refreshed the store
      }"
    />

    <AgendamentoDetailsModal
      :show="showDetailsModal"
      :agendamento="(selectedAgendamento as Agendamento)"
      :loading="loading"
      @close="showDetailsModal = false"
      @edit="onEditAgendamento"
      @cancel="onCancelAgendamento"
      @delete="onDeleteAgendamento"
    />
  </div>
</template>

<style scoped>
.agendamento-manager {
  height: 100%;
}
</style>