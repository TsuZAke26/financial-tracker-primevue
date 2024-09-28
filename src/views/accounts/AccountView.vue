<template>
  <div class="space-y-4">
    <Suspense>
      <div>
        <AccountCard :account-id="accountId" />
        <AccountTransactionsCard :account-id="Number.parseInt(accountId)" />
      </div>

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
import AccountTransactionsCard from '@/components/transactions/AccountTransactionsCard.vue';

defineProps({
  accountId: {
    type: String,
    required: true
  }
});
</script>

<style scoped></style>
