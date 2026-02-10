<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useEspecialidades } from '~/composables/useEspecialidades';
import { useToast } from '~/composables/useToast';
import { useUserCurrentStore } from '~/stores/user_current';
import BaseButton from '~/components/BaseButton.vue';
import EspecialidadeFormModal from '~/components/EspecialidadeFormModal.vue';
import ConfirmDeleteModal from '~/components/ConfirmDeleteModal.vue';
import { 
  PhStethoscope, 
  PhMagicWand, 
  PhAppleLogo, 
  PhCookingPot, 
  PhSoccerBall, 
  PhTooth, 
  PhBrain,
  PhPlus,
  PhPencil,
  PhTrash
} from '@phosphor-icons/vue';

const { especialidades, isLoading, fetchEspecialidades, addEspecialidade, updateEspecialidade, deleteEspecialidade } = useEspecialidades();
const { success, error: toastError } = useToast();
const userStore = useUserCurrentStore();

// Estados dos Modais
const showFormModal = ref(false);
const showDeleteModal = ref(false);
const isEditing = ref(false);
const selectedItem = ref<{ id: number; nome: string } | null>(null);
const isActionLoading = ref(false);

// Role check
const isAdmin = computed(() => userStore.profile?.role === 'admin');

// Carregar automaticamente ao entrar na página
onMounted(() => {
  fetchEspecialidades();
});

// Ações
const handleAddClick = () => {
  isEditing.value = false;
  selectedItem.value = null;
  showFormModal.value = true;
};

const handleEditClick = (item: { id: number; nome: string | null }) => {
  isEditing.value = true;
  selectedItem.value = { id: item.id, nome: item.nome || '' };
  showFormModal.value = true;
};

const handleDeleteClick = (item: { id: number; nome: string | null }) => {
  selectedItem.value = { id: item.id, nome: item.nome || '' };
  showDeleteModal.value = true;
};

const onFormSubmit = async (nome: string) => {
  isActionLoading.value = true;
  showFormModal.value = false; // Fecha imediatamente
  try {
    if (isEditing.value && selectedItem.value) {
      const response = await updateEspecialidade(selectedItem.value.id, nome);
      if (response.success) {
        success(response.message || 'Especialidade atualizada com sucesso!');
      } else {
        toastError(response.message || 'Erro ao atualizar especialidade.');
      }
    } else {
      const response = await addEspecialidade(nome);
      if (response.success) {
        success(response.message || 'Especialidade adicionada com sucesso!');
      } else {
        toastError(response.message || 'Erro ao adicionar especialidade.');
      }
    }
  } finally {
    isActionLoading.value = false;
  }
};

const onConfirmDelete = async () => {
  if (!selectedItem.value) return;
  
  isActionLoading.value = true;
  showDeleteModal.value = false; // Fecha imediatamente
  try {
    const response = await deleteEspecialidade(selectedItem.value.id);
    if (response.success) {
      success(response.message || 'Especialidade excluída com sucesso!');
    } else {
      toastError(response.message || 'Erro ao excluir especialidade.');
    }
  } finally {
    isActionLoading.value = false;
  }
};

// Mapeamento de ícones
const getIcon = (nome: string | null) => {
  if (!nome) return PhStethoscope;
  
  const n = nome.toLowerCase();
  if (n.includes('mágico')) return PhMagicWand;
  if (n.includes('nutricionista')) return PhAppleLogo;
  if (n.includes('padeiro')) return PhCookingPot;
  if (n.includes('futebol')) return PhSoccerBall;
  if (n.includes('dentista')) return PhTooth;
  if (n.includes('filósofo')) return PhBrain;
  
  return PhStethoscope;
};
</script>

<template>
  <div class="p-8">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-neutral-900 font-sans">Especialidades</h1>
        <p class="mt-1 text-neutral-500 font-sans">Gerencie as especialidades disponíveis no sistema.</p>
      </div>
      
      <BaseButton v-if="isAdmin" variant="primary" @click="handleAddClick">
        <template #icon>
          <PhPlus weight="bold" />
        </template>
        Nova Especialidade
      </BaseButton>
    </div>

    <!-- Lista de Especialidades -->
    <div v-if="especialidades.length > 0" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div 
        v-for="item in especialidades" 
        :key="item.id"
        class="p-4 bg-white border border-neutral-200 rounded-xl shadow-sm hover:border-primary-300 transition-colors group relative"
      >
        <div class="flex items-center gap-4">
          <div class="p-3 bg-primary-50 text-primary-500 rounded-xl group-hover:bg-primary-500 group-hover:text-white transition-all duration-300">
            <component :is="getIcon(item.nome)" :size="24" weight="duotone" />
          </div>
          <div class="flex-1 pr-16">
            <p class="font-bold text-neutral-900 text-lg line-clamp-1">{{ item.nome }}</p>
            <p class="text-xs text-neutral-400 font-medium tracking-wider uppercase">CÓDIGO: #{{ item.id }}</p>
          </div>
        </div>

        <!-- Ações do Card -->
        <div v-if="isAdmin" class="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            @click="handleEditClick(item)"
            class="p-1.5 text-neutral-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
            title="Editar"
          >
            <PhPencil :size="18" weight="bold" />
          </button>
          <button 
            @click="handleDeleteClick(item)"
            class="p-1.5 text-neutral-400 hover:text-error-500 hover:bg-error-50 rounded-lg transition-colors"
            title="Excluir"
          >
            <PhTrash :size="18" weight="bold" />
          </button>
        </div>
      </div>
    </div>

    <!-- Estado Vazio -->
    <div 
      v-else-if="!isLoading" 
      class="flex flex-col items-center justify-center p-12 bg-neutral-50 rounded-2xl border-2 border-dashed border-neutral-200 text-center"
    >
      <div class="p-4 bg-white rounded-full shadow-sm mb-4">
        <PhStethoscope :size="32" weight="thin" class="text-neutral-300" />
      </div>
      <p class="text-neutral-500 font-medium">Nenhuma especialidade encontrada.</p>
      <p class="text-neutral-400 text-sm mt-1">Houve algum erro ou não há dados no banco.</p>
    </div>

    <!-- Loading State Skeleton -->
    <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="n in 6" :key="n" class="p-4 bg-white border border-neutral-100 rounded-xl animate-pulse">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-neutral-100 rounded-xl"></div>
          <div class="space-y-2 flex-1">
            <div class="w-3/4 h-5 bg-neutral-100 rounded"></div>
            <div class="w-1/4 h-3 bg-neutral-100 rounded"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modais -->
    <EspecialidadeFormModal 
      :show="showFormModal"
      :edit="isEditing"
      :data="selectedItem"
      :loading="isActionLoading"
      @close="showFormModal = false"
      @submit="onFormSubmit"
    />

    <ConfirmDeleteModal 
      :show="showDeleteModal"
      :loading="isActionLoading"
      title="Excluir Especialidade"
      :message="`Tem certeza que deseja excluir a especialidade '${selectedItem?.nome}'?`"
      @close="showDeleteModal = false"
      @confirm="onConfirmDelete"
    />
  </div>
</template>
