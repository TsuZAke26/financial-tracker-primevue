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

export async function createAccount(data: Database['public']['Tables']['accounts']['Insert']) {
  const userId = (await anonClient.auth.getSession()).data.session?.user.id;
  if (!userId) {
    throw new Error('User is not authenticated, abort new account creation');
  }

  const { data: accounts_data, error: accounts_error } = await anonClient
    .from('accounts')
    .insert({
      name: data.name,
      account_type: data.account_type,
      max_balance: data.max_balance,
      user_id: userId
    })
    .select()
    .single();
  if (accounts_error) {
    throw accounts_error;
  }

  return accounts_data;
}

export async function updateAccount(data: Database['public']['Tables']['accounts']['Update']) {
  const id = data.id as number;
  const { data: accounts_data, error: accounts_error } = await anonClient
    .from('accounts')
    .update(data)
    .eq('id', id)
    .select()
    .single();
  if (accounts_error) {
    throw accounts_error;
  }

  return accounts_data;
}
