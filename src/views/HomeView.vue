<template>
  <div>
    <Suspense>
      <AccountSummaries />
      <template #fallback>
        <div class="flex justify-center h-screen items center">
          <ProgressSpinner />
        </div>
      </template>
    </Suspense>
  </div>
</template>

<script setup lang="ts">
import ProgressSpinner from 'primevue/progressspinner';

import AccountSummaries from '@/components/accounts/AccountSummaries.vue';
</script>
