<template>
  <div class="p-4 border border-gray-300 rounded-lg cursor-pointer">
    <div class="space-y-2">
      <!-- Name and Amount -->
      <div class="flex flex-row items-center justify-between">
        <div class="text-sm font-semibold truncate">{{ transaction.name }}</div>
        <div class="text-sm font-bold" :class="styleAmount(transaction.amount)">
          {{ formatAmount(transaction.amount) }}
        </div>
      </div>
      <!-- Category & Date -->
      <div class="flex flex-row items-center justify-between">
        <Badge :value="transaction.category" severity="info" size="small" />
        <div class="text-sm">{{ transaction.date }}</div>
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
