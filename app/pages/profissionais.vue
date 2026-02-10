<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useProfissionais } from '~/composables/useProfissionais';
import { 
  PhUser, 
  PhEnvelope, 
  PhMedal, 
  PhStethoscope,
  PhIdentificationCard
} from '@phosphor-icons/vue';

const { profissionais, isLoading, fetchProfissionais } = useProfissionais();

onMounted(() => {
  fetchProfissionais();
});

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR');
};
</script>

<template>
  <div class="p-8">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-neutral-900 font-sans">Profissionais</h1>
      <p class="mt-1 text-neutral-500 font-sans">Visualize todos os profissionais cadastrados no sistema e suas especialidades.</p>
    </div>

    <!-- Lista de Profissionais -->
    <div v-if="profissionais.length > 0" class="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
      <div 
        v-for="prof in profissionais" 
        :key="prof.profissional_id"
        class="bg-white border border-neutral-200 rounded-2xl shadow-sm hover:border-primary-300 hover:shadow-md transition-all duration-300 overflow-hidden group"
      >
        <!-- Header do Card -->
        <div class="p-6 border-b border-neutral-50 bg-neutral-50/30">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-all duration-500 shadow-inner">
              <PhUser :size="32" weight="duotone" />
            </div>
            <div class="flex-1 min-w-0">
              <h2 class="text-lg font-bold text-neutral-900 truncate font-sans">{{ prof.user_name }}</h2>
              <div class="flex items-center gap-1.5 text-neutral-500 text-sm mt-0.5">
                <PhEnvelope :size="14" />
                <span class="truncate">{{ prof.user_email }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Detalhes -->
        <div class="p-6 space-y-4 font-sans">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2 text-neutral-600">
              <PhStethoscope :size="18" weight="bold" class="text-primary-500" />
              <span class="text-sm font-semibold uppercase tracking-wider">Especialidade</span>
            </div>
            <span class="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-bold rounded-full border border-primary-100">
              {{ prof.especialidade_nome }}
            </span>
          </div>

          <div class="grid grid-cols-2 gap-4 pt-2">
            <div class="space-y-1">
              <div class="flex items-center gap-1.5 text-neutral-400 text-[10px] font-bold uppercase tracking-widest">
                <PhIdentificationCard :size="12" />
                Registro
              </div>
              <p class="text-sm text-neutral-700 font-medium font-mono">#{{ prof.profissional_id }}</p>
            </div>
            
            <div class="space-y-1">
              <div class="flex items-center gap-1.5 text-neutral-400 text-[10px] font-bold uppercase tracking-widest">
                <PhMedal :size="12" />
                Nível
              </div>
              <p class="text-sm text-neutral-700 font-medium capitalize">{{ prof.user_role }}</p>
            </div>
          </div>

          <div class="pt-4 border-t border-neutral-50">
            <p class="text-[10px] text-neutral-400 font-medium">Cadastrado em: <span class="text-neutral-500">{{ formatDate(prof.profissional_created_at) }}</span></p>
          </div>
        </div>
      </div>
    </div>

    <!-- Estado Vazio -->
    <div 
      v-else-if="!isLoading" 
      class="flex flex-col items-center justify-center p-16 bg-neutral-50 rounded-3xl border-2 border-dashed border-neutral-200 text-center"
    >
      <div class="p-6 bg-white rounded-3xl shadow-sm mb-6">
        <PhUserList :size="48" weight="thin" class="text-neutral-300" />
      </div>
      <h3 class="text-xl font-bold text-neutral-800">Nenhum profissional cadastrado</h3>
      <p class="text-neutral-500 mt-2 max-w-xs mx-auto text-sm">A lista de profissionais está vazia no momento ou não foi possível carregar os dados.</p>
    </div>

    <!-- Loading State -->
    <div v-else class="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
      <div v-for="n in 6" :key="n" class="bg-white border border-neutral-100 rounded-2xl p-6 h-[280px] animate-pulse">
        <div class="flex items-center gap-4 mb-6">
          <div class="w-16 h-16 bg-neutral-100 rounded-2xl"></div>
          <div class="flex-1 space-y-2">
            <div class="w-3/4 h-5 bg-neutral-100 rounded-lg"></div>
            <div class="w-1/2 h-3 bg-neutral-100 rounded-lg"></div>
          </div>
        </div>
        <div class="space-y-4">
          <div class="w-full h-12 bg-neutral-50 rounded-xl"></div>
          <div class="grid grid-cols-2 gap-4">
            <div class="h-10 bg-neutral-50 rounded-xl"></div>
            <div class="h-10 bg-neutral-50 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
