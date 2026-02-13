<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import BaseModal from './BaseModal.vue'
import BaseButton from './BaseButton.vue'
import BaseInput from './BaseInput.vue'
import BaseSelect from './BaseSelect.vue'
import { PhUserPlus } from '@phosphor-icons/vue'

const props = defineProps<{
  show: boolean
  loading?: boolean
  user?: any | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: { name: string; email: string; password: string; role: string }): void
}>()

const form = ref({ name: '', email: '', password: '', role: 'user' })

const roleOptions = [
  { label: 'Membro', value: 'user' },
  { label: 'Admin', value: 'admin' }
]

const isEditing = computed(() => !!props.user)

watch(
  () => props.show,
  (isVisible) => {
    if (isVisible) {
      if (props.user) {
        form.value = {
          name: props.user.name || '',
          email: props.user.email || '',
          password: '',
          role: props.user.role || 'user'
        }
      } else {
        form.value = { name: '', email: '', password: '', role: 'user' }
      }
    }
  }
)

const isFormValid = computed(() => {
  return (
    form.value.name.trim() !== '' &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email) &&
    form.value.password.length >= 6 &&
    !!form.value.role
  )
})

const handleSubmit = () => {
  // visual only — emite para possibilitar integração futura
  emit('submit', { ...form.value })
}
</script>

<template>
  <BaseModal :show="show" @close="emit('close')" size="md">
    <template #title>
      <div class="flex items-center gap-2">
        <PhUserPlus weight="fill" class="text-primary-500" />
        {{ isEditing ? 'Editar Usuário' : 'Novo Usuário' }}
      </div>
    </template>

    <div class="space-y-6 py-2">
      <p class="text-sm text-neutral-500">
        {{ isEditing ? 'Atualize os dados do usuário.' : 'Preencha os dados abaixo para criar um novo usuário.' }}
      </p>

      <div class="grid gap-5">
        <BaseInput v-model="form.name" label="Nome" placeholder="Ex: João Silva" :disabled="loading" required />

        <BaseInput v-model="form.email" label="E-mail" type="email" placeholder="Ex: joao@email.com" :disabled="loading" required />

        <BaseInput v-model="form.password" label="Senha" type="password" placeholder="Mínimo 6 caracteres" :disabled="loading" required />

        <BaseSelect v-model="form.role" label="Cargo" :options="roleOptions" :disabled="loading" />
      </div>

      <div v-if="form.name || form.email" class="bg-neutral-50 rounded-xl p-4 border border-neutral-100 flex items-center gap-3">
        <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary-500 shadow-sm border border-neutral-100">
          <PhUserPlus :size="20" weight="duotone" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-bold text-neutral-400 uppercase tracking-wider">Visualização</p>
          <p class="text-sm font-semibold text-neutral-700 truncate">{{ form.name || form.email }}</p>
        </div>
      </div>
    </div>

    <template #footer>
      <BaseButton variant="ghost" @click="emit('close')" :disabled="loading">Cancelar</BaseButton>
      <BaseButton variant="primary" @click="handleSubmit" :loading="loading" :disabled="!isFormValid">{{ isEditing ? 'Salvar' : 'Cadastrar Usuário' }}</BaseButton>
    </template>
  </BaseModal>
</template>
