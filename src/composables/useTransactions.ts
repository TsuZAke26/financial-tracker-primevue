import { computed, ref, type Ref } from 'vue';

import { useAccountsStore } from '@/stores/accounts';

import {
  createTransaction,
  createTransactions,
  readTotalTransactions,
  readTransactions,
  updateTransaction
} from '@/supabase/database/db-transactions';

import type { Database } from '@/types/supabase';

import { sortTransactionsDesc } from '@/utils/transaction-utils';
import { importTransactionCSV } from '@/utils/csv-utils';

const { fetchAccountBalanceById } = useAccountsStore();

// Global state for composable
const accountId = ref(-1);
const transactions: Ref<Database['public']['Tables']['transactions']['Row'][]> = ref([]);
const total = ref(0);

const fileToImport: Ref<File | null> = ref(null);

export function useTransactions() {
  function getAccountId() {
    return accountId.value;
  }

  function setAccountId(id: number) {
    accountId.value = id;
  }

  async function fetchTotalTransactions() {
    if (accountId.value === -1) {
      throw new Error('No account id set');
    }

    const fetchedTotal = await readTotalTransactions(accountId.value);
    total.value = fetchedTotal ?? 0;
  }

  async function fetchTransactions(from: number, to: number) {
    if (accountId.value === -1) {
      throw new Error('No account id set');
    }

    const fetchedTransactions = await readTransactions(accountId.value, from, to);
    fetchedTransactions.forEach((fetchedTransaction) => {
      const existingIndex = transactions.value.findIndex(
        (transaction) => transaction.id === fetchedTransaction.id
      );
      if (existingIndex !== -1) {
        transactions.value.splice(existingIndex, 1, fetchedTransaction);
      } else {
        transactions.value.push(fetchedTransaction);
      }
    });
  }

  async function addTransaction(data: Database['public']['Tables']['transactions']['Insert']) {
    const newTransaction = await createTransaction(data);
    if (newTransaction) {
      transactions.value.push(newTransaction);
      transactions.value.sort(sortTransactionsDesc);
      await fetchAccountBalanceById(accountId.value);
    }
  }

  async function editTransaction(data: Database['public']['Tables']['transactions']['Update']) {
    const modifiedTransaction = await updateTransaction(data);
    if (modifiedTransaction) {
      const existingIndex = transactions.value.findIndex(
        (transaction) => transaction.id === modifiedTransaction.id
      );
      if (existingIndex !== -1) {
        transactions.value.splice(existingIndex, 1, modifiedTransaction);
        await fetchAccountBalanceById(accountId.value);
      }
    }
  }

  function resetTransactions() {
    accountId.value = -1;
    transactions.value = [];
    clearFileToImport();
  }

  function setFileToImport(file: File) {
    fileToImport.value = file;
  }

  function clearFileToImport() {
    fileToImport.value = null;
  }

  const readyToImport = computed(() => fileToImport.value);

  async function importTransactions() {
    if (accountId.value === -1) {
      throw new Error('No account id set');
    }

    if (!fileToImport.value) {
      throw new Error('No file selected');
    }

    if (fileToImport.value?.type !== 'text/csv') {
      throw new Error('Not a CSV file');
    }

    const transactionsJSON = (await importTransactionCSV(fileToImport.value)).data;
    const transactionsToImport: Database['public']['Tables']['transactions']['Insert'][] =
      transactionsJSON.map((transaction: any) => {
        const transformedTransaction: Database['public']['Tables']['transactions']['Insert'] = {
          ...transaction
        };
        transformedTransaction.account_id = accountId.value;

        return transformedTransaction;
      });

    const importedTransactions = await createTransactions(transactionsToImport);
    if (importedTransactions) {
      transactions.value = transactions.value
        .concat(importedTransactions)
        .sort(sortTransactionsDesc);
      await fetchAccountBalanceById(accountId.value);
      clearFileToImport();
    }
  }

  return {
    getAccountId,
    setAccountId,
    transactions,
    total,
    fetchTotalTransactions,
    fetchTransactions,
    addTransaction,
    editTransaction,
    resetTransactions,
    setFileToImport,
    readyToImport,
    importTransactions
  };
}
