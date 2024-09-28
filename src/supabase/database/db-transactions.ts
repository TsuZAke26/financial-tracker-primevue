import { anonClient } from '../clients/anon-client';

export async function readTransactions(accountId: number, from: number, to: number) {
  const { data: transactions_data, error: transactions_error } = await anonClient
    .from('transactions')
    .select()
    .eq('account_id', accountId)
    .range(from, to)
    .order('date', { ascending: false });
  if (transactions_error) {
    throw transactions_error;
  }
  return transactions_data;
}
