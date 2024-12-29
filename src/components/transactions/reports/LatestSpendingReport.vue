<template>
  <div>
    <DataTable :value="reportData">
      <Column field="category_main" header="Category"></Column>
      <Column field="amount" header="Amount">
        <template #body="slotProps">
          <div>{{ formatAmount(slotProps.data.amount) }}</div>
        </template>
      </Column>
      <Column field="percent" header="% Spend">
        <template #body="slotProps">
          <div>{{ formatPercent(slotProps.data.percent) }}%</div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, toRefs, type PropType, type Ref } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

import type { Database } from '@/types/supabase';
import type { ReportCategoryData } from '@/types/ui-types';

import { generateReportForRange } from '@/utils/report-utils';
import { formatAmount, formatPercent } from '@/utils/format-utils';

const props = defineProps({
  accountId: {
    type: Number,
    required: true
  },
  transactions: {
    type: Array as PropType<Array<Database['public']['Tables']['transactions']['Row']>>,
    default: () => []
  }
});

const { transactions: localTransactions } = toRefs(props);
const reportData: Ref<ReportCategoryData[]> = ref([]);

onMounted(async () => {
  const latestTransactionDate = localTransactions.value[0].date;
  const latestDateSplit = latestTransactionDate.split('-');
  const fromDate = latestDateSplit[0]
    .concat('-')
    .concat(latestDateSplit[1])
    .concat('-')
    .concat('01');

  reportData.value = (await generateReportForRange(
    props.accountId,
    fromDate,
    latestTransactionDate
  )) as ReportCategoryData[];
});
</script>

<style scoped></style>
