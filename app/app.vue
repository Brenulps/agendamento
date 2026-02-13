<script setup lang="ts">
import ToastContainer from '~/components/ToastContainer.vue';
import { useUserCurrentStore } from '~/stores/user_current';
import { useRouter, useRoute } from '#imports';

const user = useSupabaseUser();
const userStore = useUserCurrentStore();
const router = useRouter();
const route = useRoute();

// Fetch profile when user is authenticated
watch(user, (newUser) => {
  if (newUser) {
    userStore.fetchProfile();
  } else {
    userStore.clearProfile();
  }
}, { immediate: true });

// Client-side debug: log route changes so navigation issues are visible in browser console
if (process.client) {
  router.afterEach((to, from) => {
    // eslint-disable-next-line no-console
    console.log('[router] navigated', { from: from.fullPath, to: to.fullPath })
  })
}
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

