<script setup lang="ts">
import BaseButton from '~/components/BaseButton.vue';
import BaseInput from '~/components/BaseInput.vue';
import BaseCard from '~/components/BaseCard.vue';
import BaseCheckbox from '~/components/BaseCheckbox.vue';
import BaseBadge from '~/components/BaseBadge.vue';
import BaseAvatar from '~/components/BaseAvatar.vue';
import BaseAlert from '~/components/BaseAlert.vue';
import BaseSelect from '~/components/BaseSelect.vue';
import { ref } from 'vue';

const id = 'page-teste';

// Estados de teste
const inputValue = ref('');
const inputError = ref('');
const checkboxValue = ref(false);
const selectValue = ref('');
const showAlert = ref(true);

const selectOptions = [
  { value: 'opcao1', label: 'Opção 1' },
  { value: 'opcao2', label: 'Opção 2' },
  { value: 'opcao3', label: 'Opção 3' },
];
</script>

<template>
  <div :id="id" class="min-h-screen bg-neutral-50 py-12 px-6">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-neutral-900 mb-2">
        🧪 Página de Teste — Design System
      </h1>
      <p class="text-neutral-500 mb-10">
        Visualize todos os componentes base do sistema.
      </p>

      <!-- Seção: Buttons -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold text-neutral-800 mb-4">Buttons</h2>
        <BaseCard variant="elevated">
          <div class="space-y-4">
            <div>
              <p class="text-sm text-neutral-500 mb-2">Variantes</p>
              <div class="flex flex-wrap gap-3">
                <BaseButton variant="primary">Primary</BaseButton>
                <BaseButton variant="secondary">Secondary</BaseButton>
                <BaseButton variant="outline">Outline</BaseButton>
                <BaseButton variant="ghost">Ghost</BaseButton>
                <BaseButton variant="danger">Danger</BaseButton>
              </div>
            </div>
            
            <div>
              <p class="text-sm text-neutral-500 mb-2">Tamanhos</p>
              <div class="flex flex-wrap items-center gap-3">
                <BaseButton size="sm">Small</BaseButton>
                <BaseButton size="md">Medium</BaseButton>
                <BaseButton size="lg">Large</BaseButton>
              </div>
            </div>
            
            <div>
              <p class="text-sm text-neutral-500 mb-2">Estados</p>
              <div class="flex flex-wrap gap-3">
                <BaseButton :disabled="true">Disabled</BaseButton>
                <BaseButton :loading="true">Loading</BaseButton>
              </div>
            </div>
          </div>
        </BaseCard>
      </section>

      <!-- Seção: Inputs -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold text-neutral-800 mb-4">Inputs</h2>
        <BaseCard variant="elevated">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BaseInput
              v-model="inputValue"
              label="Nome completo"
              placeholder="Digite seu nome..."
            />
            <BaseInput
              type="email"
              label="E-mail"
              placeholder="seu@email.com"
            />
            <BaseInput
              type="password"
              label="Senha"
              placeholder="••••••••"
            />
            <BaseInput
              label="Com erro"
              placeholder="Campo inválido"
              error="Este campo é obrigatório"
            />
            <BaseInput
              label="Desabilitado"
              placeholder="Não editável"
              :disabled="true"
            />
          </div>
        </BaseCard>
      </section>

      <!-- Seção: Select -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold text-neutral-800 mb-4">Select</h2>
        <BaseCard variant="elevated">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BaseSelect
              v-model="selectValue"
              label="Escolha uma opção"
              :options="selectOptions"
            />
            <BaseSelect
              label="Com erro"
              :options="selectOptions"
              error="Selecione uma opção válida"
            />
            <BaseSelect
              label="Desabilitado"
              :options="selectOptions"
              :disabled="true"
            />
          </div>
        </BaseCard>
      </section>

      <!-- Seção: Checkbox -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold text-neutral-800 mb-4">Checkbox</h2>
        <BaseCard variant="elevated">
          <div class="space-y-4">
            <BaseCheckbox v-model="checkboxValue" label="Aceito os termos de uso" />
            <BaseCheckbox :model-value="true" label="Checkbox marcado" />
            <BaseCheckbox :model-value="false" label="Checkbox desmarcado" />
            <BaseCheckbox :disabled="true" label="Checkbox desabilitado" />
          </div>
        </BaseCard>
      </section>

      <!-- Seção: Badges -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold text-neutral-800 mb-4">Badges</h2>
        <BaseCard variant="elevated">
          <div class="flex flex-wrap gap-3">
            <BaseBadge variant="default">Default</BaseBadge>
            <BaseBadge variant="primary">Primary</BaseBadge>
            <BaseBadge variant="success">Success</BaseBadge>
            <BaseBadge variant="warning">Warning</BaseBadge>
            <BaseBadge variant="error">Error</BaseBadge>
          </div>
          <div class="flex flex-wrap gap-3 mt-4">
            <BaseBadge size="sm" variant="primary">Small</BaseBadge>
            <BaseBadge size="md" variant="primary">Medium</BaseBadge>
          </div>
        </BaseCard>
      </section>

      <!-- Seção: Avatars -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold text-neutral-800 mb-4">Avatars</h2>
        <BaseCard variant="elevated">
          <div class="flex flex-wrap items-center gap-4">
            <BaseAvatar size="sm" initials="SM" />
            <BaseAvatar size="md" initials="MD" />
            <BaseAvatar size="lg" initials="LG" />
            <BaseAvatar size="xl" initials="XL" />
            <BaseAvatar size="lg" />
          </div>
        </BaseCard>
      </section>

      <!-- Seção: Alerts -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold text-neutral-800 mb-4">Alerts</h2>
        <div class="space-y-4">
          <BaseAlert variant="info" title="Informação">
            Este é um alerta informativo para o usuário.
          </BaseAlert>
          <BaseAlert variant="success" title="Sucesso">
            Sua ação foi realizada com sucesso!
          </BaseAlert>
          <BaseAlert variant="warning" title="Atenção">
            Verifique os dados antes de continuar.
          </BaseAlert>
          <BaseAlert variant="error" title="Erro">
            Ocorreu um erro ao processar sua solicitação.
          </BaseAlert>
          <BaseAlert
            v-if="showAlert"
            variant="info"
            title="Alerta Dismissível"
            :dismissible="true"
            @dismiss="showAlert = false"
          >
            Clique no X para fechar este alerta.
          </BaseAlert>
        </div>
      </section>

      <!-- Seção: Cards -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold text-neutral-800 mb-4">Cards</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BaseCard variant="default">
            <h3 class="font-semibold text-neutral-800 mb-2">Default Card</h3>
            <p class="text-neutral-500 text-sm">Borda sutil com fundo branco.</p>
          </BaseCard>
          <BaseCard variant="bordered">
            <h3 class="font-semibold text-neutral-800 mb-2">Bordered Card</h3>
            <p class="text-neutral-500 text-sm">Borda mais destacada.</p>
          </BaseCard>
          <BaseCard variant="elevated">
            <h3 class="font-semibold text-neutral-800 mb-2">Elevated Card</h3>
            <p class="text-neutral-500 text-sm">Com sombra suave.</p>
          </BaseCard>
        </div>
      </section>

    </div>
  </div>
</template>
