<script setup lang="ts">
import AppSidebar from '~/components/AppSidebar.vue';

const id = 'user-layout';
</script>

<template>
  <div :id="id" class="flex h-screen w-full overflow-hidden bg-neutral-50 text-neutral-900">
    <!-- Sidebar fixa no lado esquerdo -->
    <AppSidebar class="z-20 shadow-xl" />

    <!-- Conteúdo principal com scroll independente -->
    <main class="flex-1 relative h-full overflow-y-auto overflow-x-hidden bg-white">
      <div class="min-h-full">
        <slot />
      </div>
    </main>
  </div>
</template>
