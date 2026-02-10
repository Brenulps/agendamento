<script setup lang="ts">
import ToastContainer from '~/components/ToastContainer.vue';
import { useUserCurrentStore } from '~/stores/user_current';

const user = useSupabaseUser();
const userStore = useUserCurrentStore();

// Fetch profile when user is authenticated
watch(user, (newUser) => {
  if (newUser) {
    userStore.fetchProfile();
  } else {
    userStore.clearProfile();
  }
}, { immediate: true });
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <ToastContainer />
  </div>
</template>

