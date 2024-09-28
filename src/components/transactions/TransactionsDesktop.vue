<template>
  <DataTable :value="transactions" paginator :rows="10">
    <Column field="category" header="Category"></Column>
    <Column field="date" header="Date"></Column>
    <Column field="name" header="Name"></Column>
    <Column field="amount" header="Amount">
      <template #body="slotProps">
        <span :class="styleAmount(slotProps.data.amount)">
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
</script>

<style scoped></style>
