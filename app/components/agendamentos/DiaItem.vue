<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  data: Date;
  isSelected?: boolean;
}

const props = defineProps<Props>();

const nomeDia = computed(() => {
  return props.data.toLocaleDateString('en-US', { weekday: 'short' });
});

const diaNumero = computed(() => {
  return props.data.getDate();
});

const isHoje = computed(() => {
  const hoje = new Date();
  return props.data.getDate() === hoje.getDate() &&
         props.data.getMonth() === hoje.getMonth() &&
         props.data.getFullYear() === hoje.getFullYear();
});
</script>

<template>
  <div 
    class="dia-card flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300 w-full min-h-[70px] border"
    :class="[
      isSelected 
        ? 'bg-primary-500 border-primary-500 text-white shadow-md shadow-primary-500/20 translate-y-[-2px]' 
        : 'bg-white border-neutral-100 text-neutral-400 hover:border-neutral-300'
    ]"
  >
    <div 
      class="text-lg font-bold leading-none mb-0.5"
      :class="isSelected ? 'text-white' : 'text-neutral-700'"
    >
      {{ diaNumero }}
    </div>
    <div 
      class="text-[9px] font-bold uppercase tracking-wider"
      :class="isSelected ? 'text-primary-100' : 'text-neutral-400'"
    >
      {{ nomeDia }}
    </div>
  </div>
</template>

<style scoped>
.dia-card {
  transition: all 0.3s ease;
}
</style>
