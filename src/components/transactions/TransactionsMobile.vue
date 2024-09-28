<template>
  <DataView :value="transactions" paginator :rows="5">
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
import type { PropType } from 'vue';

import DataView from 'primevue/dataview';

import TransactionsMobileListItem from './TransactionsMobileListItem.vue';

import type { Database } from '@/types/supabase';

defineProps({
  transactions: {
    type: Array as PropType<Array<Database['public']['Tables']['transactions']['Row']>>,
    default: () => []
  }
});
</script>

<style scoped></style>
