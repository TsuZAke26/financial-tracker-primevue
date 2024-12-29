<template>
  <div class="space-y-4">
    <!-- Report Generation Controls -->
    <div class="space-y-2">
      <div class="text-lg font-semibold">Quick Reports</div>
      <div class="flex flex-row gap-4">
        <Button label="YTD" @click="handleYTDReport" :loading="loading" />
        <Button
          v-for="i in 4"
          :key="i"
          :label="`Q${i}`"
          @click="handleQuarterReport(i)"
          :loading="loading"
        />
      </div>
    </div>

    <div class="space-y-2">
      <div class="text-lg font-semibold">Custom Date Range</div>
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
        <Button label="Generate" size="small" @click="handleGenerateReport" :loading="loading" />
      </div>
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
          <Column field="percent" header="% Spend">
            <template #body="slotProps">
              <div>{{ formatPercent(slotProps.data.percent) }}%</div>
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

import { useToast } from 'primevue/usetoast';

import DatePicker from 'primevue/datepicker';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

import { toISODate } from '@/utils/date-utils';
import { formatAmount, formatPercent } from '@/utils/format-utils';
import { generateReportForRange } from '@/utils/report-utils';
import type { ReportCategoryData } from '@/types/ui-types';

const props = defineProps({
  accountId: {
    type: Number,
    required: true
  }
});

const toast = useToast();
const loading = ref(false);

const startDate: Ref<Date | null> = ref(null);
const endDate: Ref<Date | null> = ref(null);
const reportData: Ref<ReportCategoryData[]> = ref([]);

async function handleYTDReport() {
  const currentYear = new Date().getFullYear().toString();
  const startDate = `${currentYear}-01-01`;
  const endDate = toISODate(new Date());

  try {
    loading.value = true;
    reportData.value = (await generateReportForRange(
      props.accountId,
      startDate,
      endDate
    )) as ReportCategoryData[];
    toast.add({
      severity: 'success',
      summary: 'Report Generated Successfully!',
      life: 2500
    });
  } catch (error: any) {
    console.error(error);
    toast.add({
      severity: 'error',
      summary: 'Add Transaction Failed',
      detail: error.message,
      life: 2500
    });
  } finally {
    loading.value = false;
  }
}

async function handleQuarterReport(quarter: number) {
  const currentYear = new Date().getFullYear().toString();
  try {
    let startYear = currentYear,
      startMonth = '',
      startDay = '01';
    let endYear = currentYear,
      endMonth = '',
      endDay = '';

    switch (quarter) {
      case 1:
        startMonth = '01';
        endMonth = '03';
        endDay = '31';
        break;
      case 2:
        startMonth = '04';
        endMonth = '06';
        endDay = '30';
        break;
      case 3:
        startMonth = '07';
        endMonth = '09';
        endDay = '30';
        break;
      case 4:
        startMonth = '10';
        endMonth = '12';
        endDay = '31';
        break;
      default:
        console.error('Unsupported quarter value');
    }

    const startDate = `${startYear}-${startMonth}-${startDay}`;
    const endDate = `${endYear}-${endMonth}-${endDay}`;

    reportData.value = (await generateReportForRange(
      props.accountId,
      startDate,
      endDate
    )) as ReportCategoryData[];
    toast.add({
      severity: 'success',
      summary: 'Report Generated Successfully!',
      life: 2500
    });
  } catch (error: any) {
    console.error(error);
    toast.add({
      severity: 'error',
      summary: 'Report Generation Failed',
      detail: error.message,
      life: 2500
    });
  } finally {
    loading.value = false;
  }
}

async function handleGenerateReport() {
  try {
    loading.value = true;
    reportData.value = (await generateReportForRange(
      props.accountId,
      toISODate(startDate.value as Date),
      toISODate(endDate.value as Date)
    )) as ReportCategoryData[];
    toast.add({
      severity: 'success',
      summary: 'Report Generated Successfully!',
      life: 2500
    });
  } catch (error: any) {
    console.error(error);
    toast.add({
      severity: 'error',
      summary: 'Report Generation Failed',
      detail: error.message,
      life: 2500
    });
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped></style>
