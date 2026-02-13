<script setup lang="ts">
import BaseButton from '~/components/BaseButton.vue';
import BaseInput from '~/components/BaseInput.vue';
import BaseCheckbox from '~/components/BaseCheckbox.vue';
import { PhArrowRight, PhGoogleLogo, PhGithubLogo } from '@phosphor-icons/vue';
import { ref } from 'vue';
import { useAuth } from '~/composables/useAuth';
import { useToast } from '~/composables/useToast';

definePageMeta({
  layout: false
});

const id = 'page-login';
const { login, isLoading } = useAuth();
const { error, success } = useToast();



// Estados do formulário
const email = ref('');
const password = ref('');
const rememberMe = ref(false);

// Validação
const emailError = ref('');
const passwordError = ref('');

function validateEmail(value: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

async function handleLogin() {
  // Reset errors
  emailError.value = '';
  passwordError.value = '';

  // Validação
  let hasError = false;

  if (!email.value) {
    emailError.value = 'E-mail é obrigatório';
    hasError = true;
  } else if (!validateEmail(email.value)) {
    emailError.value = 'E-mail inválido';
    hasError = true;
  }

  if (!password.value) {
    passwordError.value = 'Senha é obrigatória';
    hasError = true;
  } else if (password.value.length < 6) {
    passwordError.value = 'Senha deve ter no mínimo 6 caracteres';
    hasError = true;
  }

  if (hasError) {
    error('Por favor, corrija os erros no formulário.', 'Erro de validação');
    return;
  }

  await login(email.value, password.value);
}

function handleSocialLogin(provider: string): void {
  success(`Login com ${provider} em breve!`, 'Em desenvolvimento');
}
</script>

<template>
  <div :id="id" class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center p-6">
    <div class="w-full max-w-md">
      <!-- Logo/Brand -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-2xl mb-4 shadow-lg">
          <span class="text-3xl">🔐</span>
        </div>
        <h1 class="text-3xl font-bold text-neutral-900 mb-2">
          Bem-vindo de volta
        </h1>
        <p class="text-neutral-500">
          Entre com sua conta para continuar
        </p>
      </div>

      <!-- Card de Login -->
      <div class="bg-white rounded-2xl shadow-xl p-8 border border-neutral-100">
        <form @submit.prevent="handleLogin" class="space-y-5">
          <!-- Email -->
          <BaseInput
            v-model="email"
            type="email"
            label="E-mail"
            placeholder="seu@email.com"
            :error="emailError"
            :disabled="isLoading"
          />

          <!-- Password -->
          <BaseInput
            v-model="password"
            type="password"
            label="Senha"
            placeholder="••••••••"
            :error="passwordError"
            :disabled="isLoading"
          />

          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between">
            <BaseCheckbox
              v-model="rememberMe"
              label="Lembrar de mim"
              :disabled="isLoading"
            />
            <a
              href="/forgot-password"
              class="text-sm text-primary-500 hover:text-primary-600 font-medium transition-colors"
            >
              Esqueceu a senha?
            </a>
          </div>

          <!-- Login Button -->
          <BaseButton
            type="submit"
            variant="primary"
            size="lg"
            :loading="isLoading"
            class="w-full"
          >
            <template #icon>
              <PhArrowRight :size="20" weight="bold" />
            </template>
            Entrar
          </BaseButton>
        </form>

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-neutral-200"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-white text-neutral-500">ou continue com</span>
          </div>
        </div>

        <!-- Social Login -->
        <div class="grid grid-cols-2 gap-3">
          <BaseButton
            variant="outline"
            @click="handleSocialLogin('Google')"
            :disabled="isLoading"
          >
            <template #icon>
              <PhGoogleLogo :size="20" weight="bold" />
            </template>
            Google
          </BaseButton>
          <BaseButton
            variant="outline"
            @click="handleSocialLogin('GitHub')"
            :disabled="isLoading"
          >
            <template #icon>
              <PhGithubLogo :size="20" weight="bold" />
            </template>
            GitHub
          </BaseButton>
        </div>

        <!-- Sign Up Link -->
        <p class="text-center text-sm text-neutral-500 mt-6">
          Não tem uma conta?
          <a
            href="#"
            class="text-primary-500 hover:text-primary-600 font-semibold transition-colors"
          >
            Criar conta
          </a>
        </p>
      </div>

      <!-- Footer -->
      <p class="text-center text-xs text-neutral-400 mt-8">
        Ao continuar, você concorda com nossos
        <a href="#" class="underline hover:text-neutral-600">Termos de Uso</a>
        e
        <a href="#" class="underline hover:text-neutral-600">Política de Privacidade</a>
      </p>
    </div>
  </div>
</template>
