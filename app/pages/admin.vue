<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useUserCurrentStore } from '~/stores/user_current'
import { useAdmin } from '~/composables/useAdmin'
import { useUsuarios } from '~/composables/useUsuarios'
import { useToast } from '~/composables/useToast'
import BaseButton from '~/components/BaseButton.vue'
import UserFormModal from '~/components/UserFormModal.vue'
import ConfirmDeleteModal from '~/components/ConfirmDeleteModal.vue'
import { PhTrash } from '@phosphor-icons/vue'

// exige autenticação e checagem específica de admin (checagem local mantida)
definePageMeta({ auth: true })

const userStore = useUserCurrentStore()
const { isAdmin, isLoading, checkAdmin } = useAdmin()
const { usuarios, isLoading: usuariosLoading, fetchUsuarios } = useUsuarios()
const toast = useToast()
const localIsAdmin = computed(() => userStore.profile?.role === 'admin')

// UI modal state para criar usuário
const isUserModalOpen = ref(false)
const isCreatingUser = ref(false)

// UI modal state para deletar usuário
const isDeleteModalOpen = ref(false)
const isDeletingUser = ref(false)
const userToDelete = ref<{ id: string; name: string | null; email: string } | null>(null)

const handleCreateUser = async (payload: { name?: string; email: string; password: string; role: string }) => {
  isCreatingUser.value = true
  try {
    // apenas name/email/password/role conforme especificado
    await $fetch('/api/admin/users', { method: 'POST', body: { name: payload.name, email: payload.email, password: payload.password, role: payload.role } })
    toast.success('Usuário criado com sucesso')
    await fetchUsuarios()
    isUserModalOpen.value = false
  } catch (err: any) {
    console.error('Erro criando usuário:', err)
    toast.error(err?.message || 'Falha ao criar usuário')
  } finally {
    isCreatingUser.value = false
  }
}

const openDeleteModal = (user: any) => {
  userToDelete.value = user
  isDeleteModalOpen.value = true
}

const handleDeleteUser = async () => {
  if (!userToDelete.value) return
  isDeletingUser.value = true
  try {
    await $fetch(`/api/admin/users?id=${userToDelete.value.id}`, { method: 'DELETE' })
    toast.success('Usuário excluído com sucesso')
    await fetchUsuarios()
    isDeleteModalOpen.value = false
  } catch (err: any) {
    console.error('Erro ao excluir usuário:', err)
    toast.error(err?.message || 'Falha ao excluir usuário')
  } finally {
    isDeletingUser.value = false
    userToDelete.value = null
  }
}

onMounted(async () => {
  // garante que o profile foi carregado (sidebar / UI dependem dele)
  if (!userStore.profile) await userStore.fetchProfile()

  // roda checagem via RPC/composable (redundante com middleware, evita flicker)
  await checkAdmin()

  // carrega lista de usuários para exibição na UI administrativa
  await fetchUsuarios()

  // se não for admin, garante redirecionamento imediato
  if (!isAdmin.value && !localIsAdmin.value) return navigateTo('/')
})
</script>

<template>
  <div class="p-8 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Área do Administrador</h1>
    <p class="text-neutral-500 mb-6">Apenas usuários com permissão de administrador podem ver esta página.</p>

    <div class="bg-white p-6 rounded-xl border border-neutral-100 shadow-sm">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <h2 class="text-lg font-medium">Usuários</h2>
          <BaseButton size="sm" variant="primary" @click="isUserModalOpen = true">Adicionar usuário</BaseButton>
        </div>
        <div class="text-sm text-neutral-500">Total: <strong>{{ usuarios.length }}</strong></div>
      </div>

      <div v-if="usuariosLoading" class="py-8 text-center text-neutral-500">Carregando usuários...</div>
      <div v-else-if="!usuarios.length" class="py-8 text-center text-neutral-500">Nenhum usuário encontrado.</div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm table-auto">
          <thead class="text-left text-neutral-500">
            <tr>
              <th class="pb-2">Nome</th>
              <th class="pb-2">Email</th>
              <th class="pb-2">Papel</th>
              <th class="pb-2">Criado em</th>
              <th class="pb-2 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in usuarios" :key="u.id" class="border-t">
              <td class="py-3">{{ u.name || '—' }}</td>
              <td class="py-3">{{ u.email || '—' }}</td>
              <td class="py-3 capitalize">{{ u.role || 'user' }}</td>
              <td class="py-3 text-sm text-neutral-500">{{ new Date(u.created_at).toLocaleString() }}</td>
              <td class="py-3 text-right">
                <button 
                  v-if="u.id !== userStore.profile?.id"
                  class="p-2 text-neutral-400 hover:text-error-500 hover:bg-error-50 rounded-lg transition-colors"
                  title="Excluir usuário"
                  @click="openDeleteModal(u)"
                >
                  <PhTrash :size="18" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-4 text-sm text-neutral-500">Usuário atual: <strong>{{ userStore.profile?.email }}</strong></div>

      <!-- User form modal (cria usuário via server) -->
      <UserFormModal :show="isUserModalOpen" :loading="isCreatingUser" @close="isUserModalOpen = false" @submit="handleCreateUser" />

      <!-- Modal de confirmação de exclusão -->
      <ConfirmDeleteModal
        :show="isDeleteModalOpen"
        :loading="isDeletingUser"
        title="Excluir Usuário"
        :message="`Tem certeza que deseja excluir o usuário ${userToDelete?.name || userToDelete?.email}? Esta ação removerá o acesso dele permanentemente.`"
        @close="isDeleteModalOpen = false"
        @confirm="handleDeleteUser"
      />
    </div>
  </div>
</template>