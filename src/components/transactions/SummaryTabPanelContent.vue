<template>
  <div class="space-y-8">
    <!-- Recent Transactions -->
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <div class="text-xl font-semibold">Recent Transactions</div>
        <div v-if="transactions.length > 0" class="flex justify-end">
          <Button label="See All Transactions" size="small" @click="$emit('current-tab', '2')" />
        </div>
      </div>

      <div v-if="transactions.length > 0" class="space-y-2">
        <!-- Mobile -->
        <div class="block space-y-2 md:hidden">
          <div v-for="transaction in transactions.slice(0, 3)" :key="transaction.id">
            <TransactionsListMobileItem :transaction="transaction" />
          </div>
        </div>

        <!-- Desktop -->
        <div class="hidden md:block">
          <DataTable :value="transactions.slice(0, 3)">
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
            <Column field="amount" header="Amount">
              <template #body="slotProps">
                <span :class="styleAmount(slotProps.data.amount)" class="float-right">
                  {{ formatAmount(slotProps.data.amount) }}
                </span>
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
      <div v-else class="font-semibold text-center">No transactions found</div>
    </div>

    <!-- <div class="border border-neutral-300" /> -->

    <!-- Current Month's Spending -->
    <div>
      <div class="text-xl font-semibold">Latest Spending Breakdown</div>
      <!-- <Chart type="doughnut" :data="chartData" :options="chartOptions" /> -->
      <div v-if="transactions.length">
        <LatestSpendingReport :account-id="accountId" :transactions="transactions" />
      </div>
      <div v-else>
        <div class="font-semibold text-center">No trasnactions to report on</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Chart from 'primevue/chart';

import LatestSpendingReport from './reports/LatestSpendingReport.vue';
import TransactionsListMobileItem from './TransactionsListMobileItem.vue';
import { useTransactions } from '@/composables/useTransactions';

import { styleAmount, formatAmount } from '@/utils/format-utils';

defineProps({
  accountId: {
    type: Number,
    required: true
  }
});
defineEmits(['current-tab']);

const { transactions } = useTransactions();

// const chartData = ref();
// const chartOptions = ref({});

// async function setChartData() {
//   const latestTransactionDate = transactions.value[0].date;
//   const splitToDate = latestTransactionDate.split('-');
//   const fromDate = splitToDate[0].concat('-').concat(splitToDate[1]).concat('-').concat('01');

//   await generateReportForRange(fromDate, latestTransactionDate);

//   return {
//     labels: reportData.value.map((data) => data.category_main),
//     datasets: [
//       {
//         data: reportData.value.map((data) => data.amount)
//       }
//     ]
//   };
// }

// const setChartData = () => {
//   const documentStyle = getComputedStyle(document.body);

//   return {
//     labels: ['A', 'B', 'C'],
//     datasets: [
//       {
//         data: [540, 325, 702],
//         backgroundColor: [
//           documentStyle.getPropertyValue('--p-cyan-500'),
//           documentStyle.getPropertyValue('--p-orange-500'),
//           documentStyle.getPropertyValue('--p-gray-500')
//         ],
//         hoverBackgroundColor: [
//           documentStyle.getPropertyValue('--p-cyan-400'),
//           documentStyle.getPropertyValue('--p-orange-400'),
//           documentStyle.getPropertyValue('--p-gray-400')
//         ]
//       }
//     ]
//   };
// };

// const setChartOptions = () => {
//   const documentStyle = getComputedStyle(document.documentElement);
//   const textColor = documentStyle.getPropertyValue('--p-text-color');

//   return {
//     plugins: {
//       legend: {
//         position: 'right',
//         labels: {
//           cutout: '60%',
//           color: textColor
//         }
//       }
//     }
//   };
// };
</script>

<style scoped></style>
