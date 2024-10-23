import { ref, type Ref } from 'vue';
import bigDecimal from 'js-big-decimal';

import type { ReportCategoryData } from '@/types/ui-types';
import { readTransactionsWithinDateRange } from '@/supabase/database/db-transactions';
import { sortReportCategoryDataByAmountDesc } from '@/utils/report-utils';

export function useReports() {
  const accountId = ref(-1);
  const reportData: Ref<ReportCategoryData[]> = ref([]);

  function setAccountId(id: number) {
    accountId.value = id;
  }

  async function generateReportForRange(from: string, to: string) {
    reportData.value = [];
    let totalSpend = '0';

    const fetchedTransactionCategoryData = await readTransactionsWithinDateRange(
      accountId.value,
      from,
      to
    );
    if (fetchedTransactionCategoryData) {
      fetchedTransactionCategoryData.forEach((fetchedReportData) => {
        totalSpend = bigDecimal.add(totalSpend, fetchedReportData.amount);

        // Determine if the category is already in the report data
        const existingReportDataIndex = reportData.value.findIndex((existingReportData) => {
          const matchedCategory =
            existingReportData.category_main === fetchedReportData.category_main;
          const matchedMiscCategory = true;
          // if (fetchedReportData.category_misc) {
          //   matchedMiscCategory =
          //     existingReportData.category_misc === fetchedReportData.category_misc;
          // }

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

      // Update percent spend for each found category
      reportData.value.forEach((reportCategoryData) => {
        reportCategoryData.percent = bigDecimal.divide(reportCategoryData.amount, totalSpend, 2);
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
