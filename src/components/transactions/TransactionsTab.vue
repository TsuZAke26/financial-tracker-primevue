<template>
  <div class="flex flex-col gap-4">
    <div class="flex justify-end">
      <Button label="Add Transaction" size="small" />
    </div>

    <div>
      <!-- List Transaction (mobile) -->
      <div class="block space-y-2 md:hidden">
        <TransactionsMobile
          :transactions="transactions"
          @fetch-transactions="$emit('fetch-transactions', $event)"
        />
      </div>

      <!-- List Transactions (desktop) -->
      <TransactionsDesktop
        :transactions="transactions"
        class="hidden md:block"
        @fetch-transactions="$emit('fetch-transactions', $event)"
      />
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

defineEmits(['fetch-transactions']);
</script>

<style scoped></style>
