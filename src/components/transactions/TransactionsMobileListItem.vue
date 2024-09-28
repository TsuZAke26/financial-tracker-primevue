<template>
  <div class="p-4 border border-gray-300 rounded-lg cursor-pointer">
    <div class="flex items-start justify-between">
      <!-- Name, Date & Category -->
      <div>
        <div class="text-sm font-semibold truncate">{{ transaction.name }}</div>
        <div class="text-sm font-medium">{{ transaction.date }}</div>
        <Badge :value="transaction.category" severity="info" size="small" />
      </div>

      <!-- Amount -->
      <div class="text-lg font-bold" :class="styleAmount(transaction.amount)">
        {{ formatAmount(transaction.amount) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';

import Badge from 'primevue/badge';

import type { Database } from '@/types/supabase';
import { formatAmount, styleAmount } from '@/utils/format-utils';

defineProps({
  transaction: {
    type: Object as PropType<Database['public']['Tables']['transactions']['Row']>,
    required: true
  }
});
</script>

<style scoped></style>
