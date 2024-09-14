import { anonClient } from '../clients/anon-client';
import type { Database } from '@/types/supabase';

export async function readAllAccountBalances() {
  const { data: accounts_data, error: accounts_error } = await anonClient
    .from('accounts')
    .select(`id`);
  if (accounts_error) {
    throw accounts_error;
  }
  const accountIds = accounts_data.map((account) => account.id);

  const { data: account_balance_data, error: account_balance_error } = await anonClient
    .from('account_balance')
    .select()
    .in('id', accountIds);
  if (account_balance_error) {
    throw account_balance_error;
  }

  return account_balance_data;
}

export async function readAllAccounts() {
  const { data: accounts_data, error: accounts_error } = await anonClient.from('accounts').select();
  if (accounts_error) {
    throw accounts_error;
  }

  return accounts_data;
}
