import { readTransactions } from '@/supabase/database/db-transactions';
import type { Database } from '@/types/supabase';
import { ref, type Ref } from 'vue';

export function useTransactions() {
  const transactions: Ref<Database['public']['Tables']['transactions']['Row'][]> = ref([]);

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

  return { transactions, fetchTransactions };
}
