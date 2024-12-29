import bigDecimal from 'js-big-decimal';

import { readTransactionsWithinDateRange } from '@/supabase/database/db-transactions';
import type { ReportCategoryData } from '@/types/ui-types';

function sortReportCategoryDataByAmountDesc(a: ReportCategoryData, b: ReportCategoryData) {
  if (Number.parseFloat(a.amount) < Number.parseFloat(b.amount)) return 1;
  else if (Number.parseFloat(a.amount) > Number.parseFloat(b.amount)) return -1;
  else return 0;
}

export async function generateReportForRange(accountId: number, from: string, to: string) {
  const reportData: ReportCategoryData[] = [];
  let totalSpend = '0';

  const fetchedTransactionCategoryData = await readTransactionsWithinDateRange(accountId, from, to);
  if (fetchedTransactionCategoryData) {
    fetchedTransactionCategoryData.forEach((fetchedReportData) => {
      totalSpend = bigDecimal.add(totalSpend, fetchedReportData.amount);

      // Determine if the category is already in the report data
      const existingReportDataIndex = reportData.findIndex((existingReportData) => {
        const matchedCategory =
          existingReportData.category_main === fetchedReportData.category_main;
        return matchedCategory;
        // const matchedMiscCategory = true;
        // if (fetchedReportData.category_misc) {
        //   matchedMiscCategory =
        //     existingReportData.category_misc === fetchedReportData.category_misc;
        // }
        // return matchedCategory && matchedMiscCategory;
      });

      // Add on to existing matching category, otherwise add it as new
      if (existingReportDataIndex > -1) {
        const currentSum = reportData[existingReportDataIndex].amount;
        reportData[existingReportDataIndex].amount = bigDecimal.add(
          currentSum,
          fetchedReportData.amount
        );
      } else {
        reportData.push(fetchedReportData);
      }
    });

    // Update percent spend for each found category
    reportData.forEach((reportCategoryData) => {
      reportCategoryData.percent = bigDecimal.divide(reportCategoryData.amount, totalSpend, 2);
    });

    return reportData.sort(sortReportCategoryDataByAmountDesc);
  }
}
