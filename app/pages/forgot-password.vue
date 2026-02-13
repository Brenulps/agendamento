<script setup lang="ts">
import { ref } from 'vue'
import BaseInput from '~/components/BaseInput.vue'
import BaseButton from '~/components/BaseButton.vue'
import { PhEnvelope } from '@phosphor-icons/vue'
import { useAuth } from '~/composables/useAuth'
import { useToast } from '~/composables/useToast'

// page meta: standalone layout
definePageMeta({ layout: false })

const email = ref('')
const emailError = ref('')
const { sendPasswordReset, isLoading } = useAuth()
const { error } = useToast()

function validateEmail(value: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(value)
}

async function handleSend() {
  emailError.value = ''
  if (!email.value) {
    emailError.value = 'E-mail é obrigatório'
    return
  }
  if (!validateEmail(email.value)) {
    emailError.value = 'E-mail inválido'
    return
  }

  const ok = await sendPasswordReset(email.value)
  if (ok) {
    email.value = ''
    navigateTo('/change-password')
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center p-6">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-2xl mb-4 shadow-lg">
          <PhEnvelope class="text-white" :size="28" />
        </div>
        <h1 class="text-2xl font-bold text-neutral-900 mb-2">Recuperar senha</h1>
        <p class="text-neutral-500">Informe seu e-mail e enviaremos um link para redefinir sua senha.</p>
      </div>

      <div class="bg-white rounded-2xl shadow-xl p-8 border border-neutral-100">
        <form @submit.prevent="handleSend" class="space-y-5">
          <BaseInput
            v-model="email"
            type="email"
            label="E-mail cadastrado"
            placeholder="seu@email.com"
            :error="emailError"
            :disabled="isLoading"
          />

          <BaseButton type="submit" variant="primary" size="lg" :loading="isLoading" class="w-full">Enviar link de recuperação</BaseButton>
        </form>

        <p class="text-center text-sm text-neutral-500 mt-6">
          Voltou atrás? <NuxtLink to="/login" class="text-primary-500 font-semibold">Voltar ao login</NuxtLink>
        </p>
      </div>

      <p class="text-center text-xs text-neutral-400 mt-8">Verifique sua caixa de entrada e a pasta de spam.</p>
    </div>
  </div>
</template>