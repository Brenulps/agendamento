<script setup lang="ts">
import { useUserCurrentStore } from '~/stores/user_current';
import BaseInput from '~/components/BaseInput.vue';
import { PhInfo, PhUserCircle } from '@phosphor-icons/vue';

const userStore = useUserCurrentStore();
</script>

<template>
  <div class="p-8 max-w-4xl mx-auto">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-neutral-900">Meu Perfil</h1>
      <p class="mt-1 text-neutral-500">Visualize aqui suas informações pessoais cadastradas no sistema.</p>
    </div>

    <!-- Loading State -->
    <div v-if="userStore.loading" class="flex items-center justify-center p-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
    </div>

    <!-- Profile Data -->
    <div v-else-if="userStore.profile" class="space-y-8 bg-white p-8 rounded-xl border border-neutral-100 shadow-sm">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BaseInput
          label="Nome"
          :model-value="userStore.profile.name || ''"
          placeholder="Seu nome"
          disabled
        />
        
        <BaseInput
          label="E-mail"
          type="email"
          :model-value="userStore.profile.email || ''"
          placeholder="seu@email.com"
          disabled
        />
        
        <BaseInput
          label="Cargo / Permissão"
          :model-value="userStore.profile.role || ''"
          placeholder="user"
          disabled
        />

        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-neutral-700">Data de Criação</label>
          <div class="px-4 py-2.5 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-600">
            {{ userStore.profile.created_at ? new Date(userStore.profile.created_at).toLocaleDateString() : '-' }}
          </div>
        </div>
      </div>

      <div class="pt-6 border-t border-neutral-100">
        <div class="flex items-center gap-2 text-sm text-neutral-400">
          <PhInfo :size="16" weight="regular" />
          <span>As informações de perfil são gerenciadas centralmente.</span>
        </div>
      </div>
    </div>

    <!-- Error/Empty State -->
    <div v-else class="text-center p-12 bg-neutral-50 rounded-xl border border-dashed border-neutral-200">
      <PhUserCircle :size="48" weight="light" class="mx-auto text-neutral-300" />
      <p class="mt-4 text-neutral-500">Nenhuma informação de perfil encontrada.</p>
      <p v-if="userStore.error" class="text-sm text-error-500 mt-2">{{ userStore.error.message }}</p>
    </div>
  </div>
</template>
