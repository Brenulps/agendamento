<script setup lang="ts">
import { 
  PhHouse, 
  PhCalendar, 
  PhBriefcase, 
  PhUserList, 
  PhGear, 
  PhSignOut, 
  PhChartPie, 
  PhCaretLeft, 
  PhCaretRight,
  PhUser,
  PhCaretUp,
  PhCaretDown
} from '@phosphor-icons/vue';
import { useAuth } from '~/composables/useAuth';
import { useLayout } from '~/composables/useLayout';
import { ref } from 'vue';
import { useRoute } from '#imports';

const id = 'app-sidebar';
const { user, logout, isLoading } = useAuth();
const { isSidebarCollapsed, toggleSidebar } = useLayout();
const route = useRoute();

const isSettingsOpen = ref(false);

const menuItems = [
  { label: 'Dashboard', icon: PhHouse, to: '/' },
  { label: 'Agendamentos', icon: PhCalendar, to: '/agendamentos' },
  { label: 'Clientes', icon: PhUserList, to: '/clientes' },
  { label: 'Profissionais', icon: PhUserList, to: '/profissionais' },
  { label: 'Especialidades', icon: PhBriefcase, to: '/especialidades' },
  { label: 'Estatísticas', icon: PhChartPie, to: '/stats' },
];

function toggleSettings() {
  if (isSidebarCollapsed.value) {
    toggleSidebar();
    isSettingsOpen.value = true;
  } else {
    isSettingsOpen.value = !isSettingsOpen.value;
  }
}
</script>

<template>
  <aside 
    :id="id" 
    class="relative h-screen bg-white border-r border-neutral-200 flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out"
    :class="[isSidebarCollapsed ? 'w-20' : 'w-64']"
  >
    <!-- Toggle Button -->
    <button 
      @click="toggleSidebar"
      class="absolute -right-3 top-20 w-6 h-6 bg-white border border-neutral-200 rounded-full flex items-center justify-center shadow-md hover:bg-neutral-50 transition-colors z-30"
    >
      <PhCaretLeft v-if="!isSidebarCollapsed" :size="14" weight="bold" />
      <PhCaretRight v-else :size="14" weight="bold" />
    </button>

    <!-- Logo -->
    <div class="p-4 border-b border-neutral-100 flex items-center gap-3 overflow-hidden h-[81px]">
      <div class="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
        <span class="text-xl">🔐</span>
      </div>
      <span 
        v-if="!isSidebarCollapsed"
        class="font-bold text-xl text-neutral-900 whitespace-nowrap transition-opacity duration-300"
        :class="[isSidebarCollapsed ? 'opacity-0' : 'opacity-100']"
      >
        Supabase
      </span>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 p-3 space-y-2 overflow-y-auto overflow-x-hidden">
      <NuxtLink
        v-for="item in menuItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200"
        :class="[
          route.path === item.to 
            ? 'bg-primary-50 text-primary-600 font-semibold' 
            : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700'
        ]"
      >
        <component 
          :is="item.icon" 
          :size="24" 
          :weight="route.path === item.to ? 'bold' : 'regular'" 
          class="flex-shrink-0"
        />
        <span 
          v-if="!isSidebarCollapsed"
          class="whitespace-nowrap transition-all duration-300 overflow-hidden"
          :class="[isSidebarCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100']"
        >
          {{ item.label }}
        </span>
      </NuxtLink>
    </nav>

    <!-- User Profile & Dropdown Settings -->
    <div class="p-3 border-t border-neutral-100 bg-neutral-50/50">
      <!-- Dropdown Content (Above the button) -->
      <div 
        v-if="isSettingsOpen && !isSidebarCollapsed" 
        class="mb-2 bg-white rounded-xl border border-neutral-100 shadow-lg overflow-hidden transition-all duration-300"
      >
        <NuxtLink 
          to="/profile"
          class="w-full flex items-center gap-3 px-4 py-3 text-sm text-neutral-600 hover:bg-neutral-50 transition-colors"
        >
          <PhUser :size="18" />
          Perfil
        </NuxtLink>
        <button 
          @click="logout"
          :disabled="isLoading"
          class="w-full flex items-center gap-3 px-4 py-3 text-sm text-error-600 hover:bg-error-50 transition-colors"
        >
          <PhSignOut :size="18" :class="{ 'animate-pulse': isLoading }" />
          Sair
        </button>
      </div>

      <!-- Settings Dropdown Trigger -->
      <button
        @click="toggleSettings"
        class="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group overflow-hidden"
        :class="[
          isSettingsOpen 
            ? 'bg-neutral-200 text-neutral-900' 
            : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
        ]"
      >
        <PhGear 
          :size="24" 
          :weight="isSettingsOpen ? 'fill' : 'regular'"
          class="flex-shrink-0"
        />
        <div v-if="!isSidebarCollapsed" class="flex-1 flex items-center justify-between min-w-0">
          <span class="font-medium whitespace-nowrap">Configurações</span>
          <component 
            :is="isSettingsOpen ? PhCaretDown : PhCaretUp" 
            :size="14" 
            weight="bold"
            class="transition-transform duration-300"
          />
        </div>
      </button>

      <!-- Collapsed User Indicator (Dot) -->
      <div v-if="isSidebarCollapsed && user" class="mt-2 flex justify-center">
        <div class="w-2 h-2 bg-success-500 rounded-full shadow-sm" :title="user.email"></div>
      </div>
    </div>
  </aside>
</template>

