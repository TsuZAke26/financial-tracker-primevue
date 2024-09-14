<template>
  <Toast />
  <RouterView />
</template>

<script setup lang="ts">
import { useRoute, useRouter, RouterView } from 'vue-router';

import Toast from 'primevue/toast';

import { anonClient } from './supabase/clients/anon-client';

const route = useRoute();
const router = useRouter();

anonClient.auth.onAuthStateChange((event) => {
  if (event === 'SIGNED_IN' && route.path === '/auth') {
    router.push({ name: 'home' });
  } else if (event === 'SIGNED_OUT') {
    router.push({ name: 'auth' });
  }
});
</script>
