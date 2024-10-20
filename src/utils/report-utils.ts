import type { ReportCategoryData } from '@/types/ui-types';

export function sortReportCategoryDataByAmountDesc(a: ReportCategoryData, b: ReportCategoryData) {
  if (Number.parseFloat(a.amount) < Number.parseFloat(b.amount)) return 1;
  else if (Number.parseFloat(a.amount) > Number.parseFloat(b.amount)) return -1;
  else return 0;
}
