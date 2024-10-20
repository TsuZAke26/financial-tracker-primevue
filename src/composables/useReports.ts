import { ref, type Ref } from 'vue';
import bigDecimal from 'js-big-decimal';

import type { ReportCategoryData } from '@/types/ui-types';
import { readTransactionsWithinDateRange } from '@/supabase/database/db-transactions';
import { sortReportCategoryDataByAmountDesc } from '@/utils/report-utils';

const accountId = ref(-1);
const reportData: Ref<ReportCategoryData[]> = ref([]);

export function useReports() {
  function setAccountId(id: number) {
    accountId.value = id;
  }

  async function generateReportForRange(from: string, to: string) {
    reportData.value = [];

    const fetchedTransactionCategoryData = await readTransactionsWithinDateRange(
      accountId.value,
      from,
      to
    );
    if (fetchedTransactionCategoryData) {
      fetchedTransactionCategoryData.forEach((fetchedReportData) => {
        // Determine if the category is already in the report data
        const existingReportDataIndex = reportData.value.findIndex((existingReportData) => {
          const matchedCategory =
            existingReportData.category_main === fetchedReportData.category_main;
          let matchedMiscCategory = true;
          if (fetchedReportData.category_misc) {
            matchedMiscCategory =
              existingReportData.category_misc === fetchedReportData.category_misc;
          }

          return matchedCategory && matchedMiscCategory;
        });

        // Add on to existing matching category, otherwise add it as new
        if (existingReportDataIndex > -1) {
          const currentSum = reportData.value[existingReportDataIndex].amount;
          reportData.value[existingReportDataIndex].amount = bigDecimal.add(
            currentSum,
            fetchedReportData.amount
          );
        } else {
          reportData.value.push(fetchedReportData);
        }
      });

      reportData.value = reportData.value.sort(sortReportCategoryDataByAmountDesc);
    }
  }

  function resetReportData() {
    accountId.value = -1;
    reportData.value = [];
  }

  return {
    setAccountId,
    reportData,
    generateReportForRange,
    resetReportData
  };
}
