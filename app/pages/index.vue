<script setup lang="ts">
import AgendamentoManager from '~/components/agendamentos/AgendamentoManager.vue';

const id = 'page-index';
</script>

<template>
  <div :id="id" class="p-8 h-screen flex flex-col overflow-hidden">
    <!-- Header Section -->
    <div class="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
      <div>
        <h1 class="text-2xl font-bold text-neutral-900 font-sans tracking-tight">Agendamentos</h1>
        <p class="mt-1 text-neutral-500 font-sans">Gerencie os horários e compromissos do sistema em tempo real.</p>
      </div>
    </div>

    <!-- Gerenciador de Agendamentos -->
    <AgendamentoManager class="flex-1 min-h-0" />
  </div>
</template>



