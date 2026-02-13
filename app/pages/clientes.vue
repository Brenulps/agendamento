<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useClientes } from '~/composables/useClientes';
import { useToast } from '~/composables/useToast';
import ClienteFormModal from '~/components/ClienteFormModal.vue';
import ConfirmDeleteModal from '~/components/ConfirmDeleteModal.vue';
import { 
  PhUserList, 
  PhUser, 
  PhEnvelope, 
  PhPhone, 
  PhCalendar,
  PhPlus,
  PhPencilSimple,
  PhTrash
} from '@phosphor-icons/vue';
import BaseButton from '~/components/BaseButton.vue';
import type { Cliente } from '~/../shared/types/Cliente';

const { clientes, isLoading, fetchClientes, addCliente, updateCliente, deleteCliente } = useClientes();
const { success, error: toastError } = useToast();

// Modal states
const isFormModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const selectedCliente = ref<Cliente | null>(null);
const clienteToDelete = ref<number | null>(null);
const isSubmitting = ref(false);

onMounted(() => {
  fetchClientes();
});

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR');
};

const handleOpenCreateModal = () => {
  selectedCliente.value = null;
  isFormModalOpen.value = true;
};

const handleOpenEditModal = (cliente: Cliente) => {
  selectedCliente.value = cliente;
  isFormModalOpen.value = true;
};

const handleOpenDeleteModal = (id: number) => {
  clienteToDelete.value = id;
  isDeleteModalOpen.value = true;
};

const handleSubmit = async (data: Omit<Cliente, 'id' | 'created_at'>) => {
  isSubmitting.value = true;
  let result;
  
  if (selectedCliente.value) {
    result = await updateCliente(selectedCliente.value.id, data);
  } else {
    result = await addCliente(data);
  }
  
  if (result.success) {
    success(result.message);
    isFormModalOpen.value = false;
  } else {
    toastError(result.message);
  }
  isSubmitting.value = false;
};

const handleConfirmDelete = async () => {
  if (clienteToDelete.value) {
    isSubmitting.value = true;
    const result = await deleteCliente(clienteToDelete.value);
    
    if (result.success) {
      success(result.message);
      isDeleteModalOpen.value = false;
      clienteToDelete.value = null;
    } else {
      toastError(result.message);
    }
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="p-8">
    <!-- Header Section -->
    <div class="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-neutral-900 font-sans tracking-tight">Clientes</h1>
        <p class="mt-1 text-neutral-500 font-sans">Gerencie a base de dados e informações dos seus clientes.</p>
      </div>

      <BaseButton 
        variant="primary" 
        @click="handleOpenCreateModal"
      >
        <template #icon>
          <PhPlus :size="20" weight="bold" />
        </template>
        Novo Cliente
      </BaseButton>
    </div>

    <!-- Lista de Clientes -->
    <div v-if="clientes.length > 0" class="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      <div 
        v-for="cliente in clientes" 
        :key="cliente.id"
        class="bg-white border border-neutral-200 rounded-2xl shadow-sm hover:border-primary-300 hover:shadow-md transition-all duration-300 overflow-hidden group relative"
      >
        <!-- Actions Overlay -->
        <div class="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
          <button 
            @click="handleOpenEditModal(cliente)"
            class="p-2 bg-white/80 backdrop-blur-sm text-primary-600 hover:bg-primary-50 rounded-xl border border-neutral-200 shadow-sm transition-all"
            title="Editar Cliente"
          >
            <PhPencilSimple :size="18" weight="bold" />
          </button>
          <button 
            @click="handleOpenDeleteModal(cliente.id)"
            class="p-2 bg-white/80 backdrop-blur-sm text-error-500 hover:bg-error-50 rounded-xl border border-neutral-200 shadow-sm transition-all"
            title="Remover Cliente"
          >
            <PhTrash :size="18" weight="bold" />
          </button>
        </div>

        <!-- Header do Card -->
        <div class="p-6 border-b border-neutral-50 bg-neutral-50/30">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-all duration-500 shadow-inner">
              <PhUser :size="28" weight="duotone" />
            </div>
            <div class="flex-1 min-w-0">
              <h2 class="text-lg font-bold text-neutral-900 truncate font-sans">{{ cliente.nome }}</h2>
              <div class="flex items-center gap-1.5 text-neutral-500 text-sm mt-0.5">
                <PhEnvelope :size="14" />
                <span class="truncate">{{ cliente.email }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Detalhes -->
        <div class="p-6 space-y-4 font-sans">
          <div class="flex items-center gap-3 text-neutral-600">
            <div class="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center">
              <PhPhone :size="16" weight="bold" class="text-neutral-500" />
            </div>
            <div>
              <p class="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Telefone</p>
              <p class="text-sm text-neutral-700 font-medium">{{ cliente.telefone || 'Não informado' }}</p>
            </div>
          </div>

          <div class="pt-4 border-t border-neutral-50 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <PhCalendar :size="14" class="text-neutral-400" />
              <p class="text-[10px] text-neutral-400 font-medium whitespace-nowrap">
                Cadastrado em: <span class="text-neutral-500">{{ formatDate(cliente.created_at) }}</span>
              </p>
            </div>
            <span class="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-[10px] font-bold rounded-md">
              ID: #{{ cliente.id }}
            </span>
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
      <h3 class="text-xl font-bold text-neutral-800">Nenhum cliente encontrado</h3>
      <p class="text-neutral-500 mt-2 max-w-xs mx-auto text-sm">A lista de clientes está vazia ou não pôde ser carregada.</p>
      
      <BaseButton 
        variant="primary" 
        class="mt-6"
        @click="handleOpenCreateModal"
      >
        <template #icon>
          <PhPlus :size="20" weight="bold" />
        </template>
        Adicionar Primeiro Cliente
      </BaseButton>
    </div>

    <!-- Loading State (Skeletons) -->
    <div v-else class="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      <div v-for="n in 6" :key="n" class="bg-white border border-neutral-100 rounded-2xl p-6 h-[220px] animate-pulse">
        <div class="flex items-center gap-4 mb-6">
          <div class="w-14 h-14 bg-neutral-100 rounded-2xl"></div>
          <div class="flex-1 space-y-2">
            <div class="w-3/4 h-5 bg-neutral-100 rounded-lg"></div>
            <div class="w-1/2 h-3 bg-neutral-100 rounded-lg"></div>
          </div>
        </div>
        <div class="space-y-4">
          <div class="w-full h-10 bg-neutral-50 rounded-xl"></div>
          <div class="h-8 bg-neutral-50 rounded-xl"></div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <ClienteFormModal 
      :show="isFormModalOpen"
      :loading="isSubmitting"
      :cliente="selectedCliente"
      @close="isFormModalOpen = false"
      @submit="handleSubmit"
    />

    <ConfirmDeleteModal 
      :show="isDeleteModalOpen"
      :loading="isSubmitting"
      title="Remover Cliente"
      message="Tem certeza que deseja remover este cliente? Todos os dados associados serão perdidos."
      @close="isDeleteModalOpen = false"
      @confirm="handleConfirmDelete"
    />
  </div>
</template>
