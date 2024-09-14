<template>
  <Card>
    <template #title>{{ title }}</template>
    <template #content>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card
          v-for="summary in summaries"
          :key="summary.id"
          class="w-full cursor-pointer hover:bg-green-300"
        >
          <template #content>
            <div class="flex items-center justify-between gap-4">
              <div :class="styleAmount(summary.balance)">{{ summary.name }}</div>
              <div>{{ formatAmount(summary.balance) }}</div>
            </div>
          </template>
        </Card>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';

import Card from 'primevue/card';

import type { AccountSummary } from '@/types/ui-types';

import { formatAmount, styleAmount } from '@/utils/format-utils';

defineProps({
  title: {
    type: String,
    required: true
  },
  summaries: {
    type: Array as PropType<Array<AccountSummary>>,
    required: true
  }
});
</script>

<style scoped></style>
