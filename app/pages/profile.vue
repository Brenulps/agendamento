<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useUserCurrentStore } from '~/stores/user_current';
import BaseInput from '~/components/BaseInput.vue';
import BaseButton from '~/components/BaseButton.vue';
import { PhInfo, PhUserCircle } from '@phosphor-icons/vue';
import { useChangePassword } from '~/composables/useChangePassword';

const userStore = useUserCurrentStore();

// local, editable name (visual only — no persistence)
const name = ref(userStore.profile?.name ?? '');
watch(() => userStore.profile, (p) => {
  name.value = p?.name ?? '';
});

const nameChanged = computed(() => (userStore.profile?.name ?? '') !== name.value);

// password change (uses composable)
const newPassword = ref('');
const confirmPassword = ref('');
const { changePassword, isLoading: changing, error: changeError } = useChangePassword();

const passwordsMatch = computed(() => newPassword.value === confirmPassword.value);
const validLength = computed(() => newPassword.value.length === 0 ? true : newPassword.value.length >= 6);
const canSubmitPassword = computed(() => newPassword.value.length > 0 && passwordsMatch.value && newPassword.value.length >= 6 && !changing.value);

async function submitPassword() {
  if (!canSubmitPassword.value) return;
  const ok = await changePassword(newPassword.value);
  if (ok) {
    newPassword.value = '';
    confirmPassword.value = '';
  }
}

async function saveName() {
  if (!nameChanged.value) return;
  await userStore.updateName(name.value.trim());
}
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
          :model-value="name"
          @update:model-value="(v) => name = v"
          placeholder="Seu nome"
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
          <div class="text-sm font-medium text-neutral-700">Data de Criação</div>
          <div class="px-4 py-2.5 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-600">
            {{ userStore.profile.created_at ? new Date(userStore.profile.created_at).toLocaleDateString() : '-' }}
          </div>
        </div>
      </div>

      <!-- Name actions -->
      <div class="mt-4 flex items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <BaseButton :disabled="!nameChanged || userStore.updatingName" @click="saveName">
            <span v-if="userStore.updatingName">Salvando...</span>
            <span v-else>Salvar</span>
          </BaseButton>
          <button class="text-sm text-neutral-500 hover:underline" type="button" @click="() => { name = userStore.profile?.name ?? '' }">Cancelar</button>
        </div>
      </div>

      <!-- Password reset -->
      <div class="mt-6 bg-neutral-50 p-4 rounded-lg border border-neutral-100">
        <h3 class="text-sm font-medium text-neutral-800 mb-3">Redefinir senha</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <BaseInput
            label="Nova senha"
            type="password"
            placeholder="••••••••"
            :model-value="newPassword"
            @update:model-value="(v) => newPassword = v"
          />
          <BaseInput
            label="Confirmar nova senha"
            type="password"
            placeholder="••••••••"
            :model-value="confirmPassword"
            @update:model-value="(v) => confirmPassword = v"
          />
        </div>

        <div class="mt-3 text-sm">
          <p v-if="newPassword && !validLength" class="text-error-500">A senha deve ter ao menos 6 caracteres.</p>
          <p v-else-if="newPassword && !passwordsMatch" class="text-error-500">As senhas não coincidem.</p>
          <p v-else class="text-neutral-500">Escolha uma nova senha segura.</p>
        </div>

        <div class="mt-4 flex items-center gap-3">
          <BaseButton :disabled="!canSubmitPassword" @click="submitPassword">
            <span v-if="changing">Atualizando...</span>
            <span v-else>Alterar senha</span>
          </BaseButton>
          <button
            type="button"
            class="text-sm text-neutral-500 hover:underline"
            @click="() => { newPassword = ''; confirmPassword = ''; }"
          >
            Limpar
          </button>
        </div>

        <p v-if="changeError" class="mt-3 text-sm text-error-500">{{ changeError.message }}</p>
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
