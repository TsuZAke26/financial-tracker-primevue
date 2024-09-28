<template>
  <div class="flex flex-col gap-4">
    <div class="flex justify-end">
      <Button label="Add Transaction" size="small" />
    </div>

    <div>
      <!-- List Transaction (mobile) -->
      <div class="block space-y-2 sm:hidden">
        <TransactionsMobile :transactions="transactions" />
      </div>

      <!-- List Transactions (desktop) -->
      <TransactionsDesktop :transactions="transactions" class="hidden sm:block" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';

import Button from 'primevue/button';

import TransactionsDesktop from './TransactionsDesktop.vue';
import TransactionsMobile from './TransactionsMobile.vue';

import type { Database } from '@/types/supabase';

defineProps({
  transactions: {
    type: Array as PropType<Array<Database['public']['Tables']['transactions']['Row']>>,
    default: () => []
  }
});
</script>

<style scoped></style>
