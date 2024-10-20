// @ts-nocheck
import Papa from 'papaparse';

export const TRANSACTION_IMPORT_COLUMN_HEADERS = [
  'category_main',
  'category_misc',
  'date',
  'name',
  'amount'
];

// https://stackoverflow.com/questions/31375531/how-to-use-promises-with-papaparse
export async function importTransactionCSV(
  file: File
): Promise<{ data: any[]; errors: any[]; meta: Record<string, unknown> }> {
  return new Promise(function (complete, error) {
    Papa.parse(file, {
      worker: true,
      header: true,
      columns: TRANSACTION_IMPORT_COLUMN_HEADERS,
      dynamicTyping: true,
      complete,
      error
    });
  });
}

export function generateImportTemplate() {
  return Papa.unparse({ fields: TRANSACTION_IMPORT_COLUMN_HEADERS });
}
