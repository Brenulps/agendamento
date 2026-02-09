<script setup lang="ts">
import BaseToast from '~/components/BaseToast.vue';
import { useToast } from '~/composables/useToast';

const id = 'toast-container';
const { toasts, remove } = useToast();
</script>

<template>
  <div
    :id="id"
    class="fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none"
  >
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="pointer-events-auto"
    >
      <BaseToast :toast="toast" @remove="remove" />
    </div>
  </div>
</template>
