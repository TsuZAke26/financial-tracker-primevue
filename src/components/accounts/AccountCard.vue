<template>
  <Card>
    <template #content>
      <div class="space-y-4">
        <div class="flex items-start justify-between">
          <span class="text-lg font-semibold">{{ currentAccount?.name }}</span>
          <span
            class="text-2xl font-semibold"
            :class="styleAmount(currentAccountBalance?.balance as number)"
          >
            {{ formatAmount(currentAccountBalance?.balance as number) }}
          </span>
        </div>
        <div class="flex justify-end">
          <EditAccountButton />
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';

import Card from 'primevue/card';

import EditAccountButton from './EditAccountButton.vue';

import { useAccountsStore } from '@/stores/accounts';

import { formatAmount, styleAmount } from '@/utils/format-utils';

const props = defineProps({
  accountId: {
    type: String,
    required: true
  }
});

const accountsStore = useAccountsStore();
const { currentAccount, currentAccountBalance } = storeToRefs(accountsStore);
const { fetchAccountById, fetchAccountBalanceById } = accountsStore;

await fetchAccountById(Number.parseInt(props.accountId));
await fetchAccountBalanceById(Number.parseInt(props.accountId));
</script>

<style scoped></style>
