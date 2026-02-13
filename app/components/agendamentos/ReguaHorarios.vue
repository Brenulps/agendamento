<script setup lang="ts">
import { computed } from 'vue';

const horarios = computed(() => {
  const list = [];
  for (let i = 8; i <= 17; i++) {
    const isPM = i >= 12;
    const hour = i > 12 ? i - 12 : i;
    const ampm = isPM ? 'PM' : 'AM';
    list.push(`${hour.toString().padStart(2, '0')}:00 ${ampm}`);
  }
  return list;
});
</script>

<template>
  <div class="regua-horarios flex flex-col pt-[110px]">
    <div 
      v-for="hora in horarios" 
      :key="hora"
      class="hora-slot flex items-start justify-end pr-4 text-[10px] font-bold text-neutral-400 font-sans h-12"
    >
      <span class="leading-none mt-[-5px] uppercase tracking-tighter">{{ hora }}</span>
    </div>
  </div>
</template>

<style scoped>
.regua-horarios {
  width: 80px;
  flex-shrink: 0;
}

.hora-slot {
  border-bottom: 1px solid transparent;
}
</style>
