<template>
  <div class="grid grid-cols-1 gap-4">
    <!-- Checking Accounts -->
    <AccountSummariesByTypeCard
      title="Checking Accounts"
      :summaries="accountSummariesByType('Checking')"
    />

    <!-- Savings Accounts -->
    <AccountSummariesByTypeCard
      title="Savings Accounts"
      :summaries="accountSummariesByType('Savings')"
    />

    <!-- Credit Lines -->
    <AccountSummariesByTypeCard
      title="Credit Lines"
      :summaries="accountSummariesByType('Credit Line')"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import AccountSummariesByTypeCard from './AccountSummariesByTypeCard.vue';

import { useAccountsStore } from '@/stores/accounts';

import type { AccountSummary } from '@/types/ui-types';
import type { Database } from '@/types/supabase';
import { storeToRefs } from 'pinia';

const accountsStore = useAccountsStore();
const { accounts, accountBalances } = storeToRefs(accountsStore);
const { fetchAccounts, fetchAccountBalances } = accountsStore;

const accountSummaries = computed(() => {
  const result: AccountSummary[] = [];

  accounts.value.forEach((account) => {
    const matchingAccountBalance = accountBalances.value.find(
      (balance) => balance.id === account.id
    );
    if (matchingAccountBalance) {
      const accountSummary: AccountSummary = {
        id: account.id,
        name: account.name,
        accountType: account.account_type,
        balance: matchingAccountBalance.balance as number
      };

      result.push(accountSummary);
    }
  });

  return result;
});

const accountSummariesByType = computed(() => {
  return (type: Database['public']['Enums']['account_type']) => {
    return accountSummaries.value.filter((summary) => summary.accountType === type);
  };
});

await fetchAccounts();
await fetchAccountBalances();
</script>

<style scoped></style>
