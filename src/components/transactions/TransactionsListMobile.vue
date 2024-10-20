<template>
  <DataView
    :value="transactions"
    paginator
    :rows="TRANSACTIONS_PAGE_SIZE_MOBILE"
    :pageLinkSize="4"
    paginatorTemplate="PrevPageLink PageLinks NextPageLink"
    @page="$emit('fetch-transactions', TRANSACTIONS_PAGE_SIZE_MOBILE)"
  >
    <template #list="slotProps">
      <div class="flex flex-col gap-2 mb-4">
        <div v-for="transaction in slotProps.items" :key="transaction.id">
          <TransactionsListMobileItem :transaction="transaction" />
        </div>
      </div>
    </template>
  </DataView>
</template>

<script setup lang="ts">
import { type PropType } from 'vue';

import DataView from 'primevue/dataview';

import TransactionsListMobileItem from './TransactionsListMobileItem.vue';

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
