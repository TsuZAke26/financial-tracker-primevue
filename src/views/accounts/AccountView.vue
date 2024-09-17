<template>
  <div>
    <Suspense>
      <AccountCard :account-id="accountId" />
      <template #fallback>
        <div class="flex items-center justify-center h-screen items center">
          <ProgressSpinner />
        </div>
      </template>
    </Suspense>
  </div>
</template>

<script setup lang="ts">
import ProgressSpinner from 'primevue/progressspinner';

import AccountCard from '@/components/accounts/AccountCard.vue';

defineProps({
  accountId: {
    type: String,
    required: true
  }
});
</script>

<style scoped></style>
