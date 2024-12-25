<template>
  <DataTable
    :value="transactions"
    paginator
    :rows="TRANSACTIONS_PAGE_SIZE_DESKTOP"
    @page="$emit('fetch-transactions', TRANSACTIONS_PAGE_SIZE_DESKTOP)"
  >
    <Column field="category_main" header="Category">
      <template #body="slotProps">
        <div>{{ slotProps.data.category_main }}</div>
        <div v-if="slotProps.data.category_misc !== undefined">
          {{ slotProps.data.category_misc }}
        </div>
      </template>
    </Column>
    <Column field="date" header="Date"></Column>
    <Column field="name" header="Name"></Column>
    <Column field="amount" header="Amount" class="text-right">
      <template #body="slotProps">
        <span :class="styleAmount(slotProps.data.amount)" class="text-right">
          {{ formatAmount(slotProps.data.amount) }}
        </span>
      </template>
    </Column>
  </DataTable>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

import type { Database } from '@/types/supabase';

import { styleAmount, formatAmount } from '@/utils/format-utils';

defineProps({
  transactions: {
    type: Array as PropType<Array<Database['public']['Tables']['transactions']['Row']>>,
    default: () => []
  }
});

defineEmits(['fetch-transactions']);

const TRANSACTIONS_PAGE_SIZE_DESKTOP = 10;
</script>

<style scoped></style>
