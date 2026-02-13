<script setup lang="ts">
import DiaItem from '~/components/agendamentos/DiaItem.vue';
import AgendamentoItem from '~/components/agendamentos/AgendamentoItem.vue';
import { computed, ref, onMounted } from 'vue';
import { useAgendamentoStore } from '~/stores/agendamento';

interface Props {
  dias: Date[];
  dataSelecionada: Date;
}

const props = defineProps<Props>();
const store = useAgendamentoStore();

const emit = defineEmits<{
  (e: 'slotClick', data: { data: Date, hora: number }): void;
  (e: 'eventClick', agendamento: any): void;
}>();

const slots = computed(() => {
  const list = [];
  for (let i = 8; i <= 16; i++) {
    const isPausa = i >= 11 && i < 13;
    list.push({ hora: i, isPausa });
  }
  return list;
});

const currentTimePosition = ref(0);

const updateTimePosition = () => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  
  // Start at 8:00, each slot is 48px (h-12)
  // 56px is the day header height
  if (hours < 8 || hours >= 18) {
    currentTimePosition.value = -1;
    return;
  }
  
  const slotIndex = hours - 8;
  const pixelsPerMinute = 48 / 60;
  currentTimePosition.value = 110 + (slotIndex * 48) + (minutes * pixelsPerMinute);
};

onMounted(() => {
  updateTimePosition();
  setInterval(updateTimePosition, 60000);
});

const isSelecionada = (data: Date) => {
  return data.getDate() === props.dataSelecionada.getDate() &&
         data.getMonth() === props.dataSelecionada.getMonth() &&
         data.getFullYear() === props.dataSelecionada.getFullYear();
};

const getEventForSlot = (dia: Date, hora: number) => {
  return store.agendamentos.find(e => {
    if (!e.data_hora) return false;
    
    // Convert event time to a Date object
    const eventDate = new Date(e.data_hora);
    
    // Check if it matches the current slot
    // We compare individual components to be safe with local time
    return eventDate.getDate() === dia.getDate() &&
           eventDate.getMonth() === dia.getMonth() &&
           eventDate.getFullYear() === dia.getFullYear() &&
           eventDate.getHours() === hora;
  });
};

const isSlotInPast = (dia: Date, hora: number) => {
  const now = new Date();
  const slotDate = new Date(dia);
  slotDate.setHours(hora, 0, 0, 0);
  return slotDate < now;
};

const handleSlotClick = (dia: Date, hora: number, isPausa: boolean) => {
  if (isPausa || isSlotInPast(dia, hora)) return;
  emit('slotClick', { data: dia, hora });
};
const handleEventClick = (event: MouseEvent, agendamento: any) => {
  event.stopPropagation();
  emit('eventClick', agendamento);
};
</script>

<template>
  <div class="agendamento-grid h-full flex flex-col relative">
    <!-- Current Time Indicator -->
    <div 
      v-if="currentTimePosition > 0"
      class="absolute left-0 right-0 z-20 pointer-events-none flex items-center"
      :style="{ top: `${currentTimePosition}px` }"
    >
      <div class="w-2 h-2 bg-primary-500 rounded-full -ml-1 shadow-sm"></div>
      <div class="flex-1 border-t-2 border-primary-500/50"></div>
    </div>

    <!-- Grid Columns for Days -->
    <div class="grid grid-cols-7 flex-1">
      <div 
        v-for="dia in dias" 
        :key="dia.getTime()"
        class="flex flex-col border-r border-neutral-100 last:border-r-0 transition-colors duration-300"
      >
        <!-- Cabeçalho do Dia (Cards) -->
        <div class="h-[110px] flex items-center justify-center p-2">
          <DiaItem :data="dia" :is-selected="isSelecionada(dia)" />
        </div>

        <!-- slots de horário -->
        <div 
          v-for="slot in slots" 
          :key="slot.hora"
          @click="handleSlotClick(dia, slot.hora, slot.isPausa)"
          class="h-12 flex flex-col items-center justify-center border-b border-neutral-50 last:border-b-0 transition-all duration-300 relative group"
          :class="[
            slot.isPausa ? 'bg-neutral-50/20' : (isSlotInPast(dia, slot.hora) ? 'bg-neutral-100' : (isSelecionada(dia) ? 'bg-primary-50/5' : 'bg-white')),
            (isSlotInPast(dia, slot.hora) && !slot.isPausa) ? 'cursor-not-allowed' : 'cursor-pointer'
          ]"
        >
          <!-- Real Event -->
          <AgendamentoItem 
            v-if="getEventForSlot(dia, slot.hora)" 
            :title="getEventForSlot(dia, slot.hora)!.cliente?.nome || 'Agendamento'"
            :time="`${slot.hora}:00`"
            :color="getEventForSlot(dia, slot.hora)!.status === 'pendente' ? 'orange' : 'blue'"
            :type="getEventForSlot(dia, slot.hora)!.status === 'concluido' ? 'dev' : 'meeting'"
            @click="(e: MouseEvent) => handleEventClick(e, getEventForSlot(dia, slot.hora))"
            class="z-20 relative"
          />

          <!-- Hover Border -->
          <div 
            v-if="!slot.isPausa && !isSlotInPast(dia, slot.hora) && !getEventForSlot(dia, slot.hora)"
            class="absolute inset-x-1 inset-y-1 rounded-xl border border-transparent group-hover:border-primary-200 group-hover:bg-primary-50/50 transition-all duration-200 z-10"
          ></div>

          <span v-if="slot.isPausa" class="text-[9px] font-bold text-neutral-200 uppercase tracking-tighter z-0">Pausa</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.agendamento-grid {
  min-height: 400px;
}
</style>
