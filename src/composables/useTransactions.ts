import { ref, type Ref } from 'vue';

import {
  createTransaction,
  readTotalTransactions,
  readTransactions,
  updateTransaction
} from '@/supabase/database/db-transactions';
import type { Database } from '@/types/supabase';
import { sortTransactionsDesc } from '@/utils/transaction-utils';
import { ModifierFlags } from 'typescript';

const transactions: Ref<Database['public']['Tables']['transactions']['Row'][]> = ref([]);
const total = ref(0);

export function useTransactions() {
  // const transactions: Ref<Database['public']['Tables']['transactions']['Row'][]> = ref([]);
  // const total = ref(0);

  async function getTotalTransactions(accountId: number) {
    const fetchedTotal = await readTotalTransactions(accountId);
    total.value = fetchedTotal ?? 0;
  }

  async function fetchTransactions(accountId: number, from: number, to: number) {
    const fetchedTransactions = await readTransactions(accountId, from, to);
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
    }
  }

  async function editTransaction(data: Database['public']['Tables']['transactions']['Update']) {
    console.log('transaction to modify', data);
    const modifiedTransaction = await updateTransaction(data);
    if (modifiedTransaction) {
      const existingIndex = transactions.value.findIndex(
        (transaction) => transaction.id === modifiedTransaction.id
      );
      console.log(`modified transaction index: ${existingIndex}`);
      if (existingIndex !== -1) {
        transactions.value.splice(existingIndex, 1, modifiedTransaction);
        console.log('modified transaction: ', transactions.value[existingIndex]);
      }
    }
  }

  function resetTransactions() {
    transactions.value = [];
  }

  return {
    transactions,
    total,
    getTotalTransactions,
    fetchTransactions,
    addTransaction,
    editTransaction,
    resetTransactions
  };
}
