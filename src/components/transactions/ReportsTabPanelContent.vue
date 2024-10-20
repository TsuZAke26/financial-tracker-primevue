<template>
  <div class="space-y-4">
    <!-- Report Generation Controls -->
    <div class="flex flex-col gap-2 sm:flex-row">
      <!-- Start Date -->
      <DatePicker
        v-model="startDate"
        showButtonBar
        date-format="yy-mm-dd"
        input-id="account-report-tab-start-date"
        fluid
        :pt="{ pcInput: { root: { required: true } } }"
        placeholder="Start Date"
      />

      <!-- End Date -->
      <DatePicker
        v-model="endDate"
        showButtonBar
        date-format="yy-mm-dd"
        input-id="account-report-tab-end-date"
        fluid
        :pt="{ pcInput: { root: { required: true } } }"
        placeholder="End Date"
      />

      <!-- Generate Report -->
      <Button label="Generate" size="small" @click="handleGenerateReport" />
    </div>

    <!-- Report Results -->
    <div>
      <div v-if="reportData.length > 0">
        <DataTable :value="reportData">
          <Column field="category_main" header="Category" />
          <Column field="amount" header="Total">
            <template #body="slotProps">
              <span>
                {{ formatAmount(Number.parseFloat(slotProps.data.amount)) }}
              </span>
            </template>
          </Column>
        </DataTable>
      </div>
      <div v-else class="text-center">No report generated yet</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue';

import DatePicker from 'primevue/datepicker';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

import { useReports } from '@/composables/useReports';

import { toISODate } from '@/utils/date-utils';
import { formatAmount } from '@/utils/format-utils';

const props = defineProps({
  accountId: {
    type: Number,
    required: true
  }
});

const { setAccountId, reportData, generateReportForRange } = useReports();

const startDate: Ref<Date | null> = ref(null);
const endDate: Ref<Date | null> = ref(null);

async function handleGenerateReport() {
  setAccountId(props.accountId);
  await generateReportForRange(
    toISODate(startDate.value as Date),
    toISODate(endDate.value as Date)
  );
}
</script>

<style scoped></style>
