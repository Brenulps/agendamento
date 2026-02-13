<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseInput from '~/components/BaseInput.vue'
import BaseButton from '~/components/BaseButton.vue'
import { definePageMeta } from '#imports'
import { useChangePassword } from '~/composables/useChangePassword'

// standalone page (no main layout)
definePageMeta({ layout: false })

const newPassword = ref('')
const confirmPassword = ref('')
const { changePassword, isLoading, error: changeError } = useChangePassword()

const passwordsMatch = computed(() => newPassword.value === confirmPassword.value)
const validLength = computed(() => newPassword.value.length === 0 ? true : newPassword.value.length >= 6)
const canSubmitPassword = computed(() => newPassword.value.length > 0 && passwordsMatch.value && newPassword.value.length >= 6 && !isLoading.value)

async function submitPassword() {
  if (!canSubmitPassword.value) return
  const ok = await changePassword(newPassword.value)
  if (ok) {
    // limpar e redirecionar para login
    newPassword.value = ''
    confirmPassword.value = ''
    navigateTo('/login')
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center p-6">
    <div class="w-full max-w-md">
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold text-neutral-900 mb-2">Trocar senha</h1>
        <p class="text-neutral-500">Digite sua nova senha abaixo.</p>
      </div>

      <div class="bg-white rounded-2xl shadow-xl p-8 border border-neutral-100">
        <form @submit.prevent="submitPassword" class="space-y-5">
          <BaseInput
            v-model="newPassword"
            type="password"
            label="Nova senha"
            placeholder="••••••••"
            :disabled="isLoading"
          />

          <BaseInput
            v-model="confirmPassword"
            type="password"
            label="Confirmar nova senha"
            placeholder="••••••••"
            :disabled="isLoading"
          />

          <div class="text-sm">
            <p v-if="newPassword && !validLength" class="text-error-500">A senha deve ter ao menos 6 caracteres.</p>
            <p v-else-if="newPassword && !passwordsMatch" class="text-error-500">As senhas não coincidem.</p>
            <p v-else class="text-neutral-500">Use uma senha com ao menos 6 caracteres.</p>
          </div>

          <BaseButton type="submit" variant="primary" size="lg" :loading="isLoading" class="w-full" :disabled="!canSubmitPassword">Alterar senha</BaseButton>
        </form>

        <p v-if="changeError" class="mt-3 text-sm text-error-500">{{ changeError.message }}</p>

        <p class="text-center text-sm text-neutral-500 mt-6">
          Voltou atrás? <NuxtLink to="/login" class="text-primary-500 font-semibold">Voltar ao login</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>
