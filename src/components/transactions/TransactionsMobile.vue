<template>
  <DataView
    :value="transactions"
    paginator
    :rows="TRANSACTIONS_PAGE_SIZE_MOBILE"
    @page="$emit('fetch-transactions', TRANSACTIONS_PAGE_SIZE_MOBILE)"
  >
    <template #list="slotProps">
      <div class="flex flex-col gap-2">
        <div v-for="transaction in slotProps.items" :key="transaction.id">
          <TransactionsMobileListItem :transaction="transaction" />
        </div>
      </div>
    </template>
  </DataView>
</template>

<script setup lang="ts">
import { ref, type PropType } from 'vue';

import DataView from 'primevue/dataview';

import TransactionsMobileListItem from './TransactionsMobileListItem.vue';

import type { Database } from '@/types/supabase';

defineProps({
  transactions: {
    type: Array as PropType<Array<Database['public']['Tables']['transactions']['Row']>>,
    default: () => []
  }
});

defineEmits(['fetch-transactions']);

const TRANSACTIONS_PAGE_SIZE_MOBILE = 5;
</script>

<style scoped></style>
