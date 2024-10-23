import { anonClient } from '../clients/anon-client';

import { useAccountsStore } from '@/stores/accounts';

import type { Database } from '@/types/supabase';
import type { ReportCategoryData } from '@/types/ui-types';

const { accountTypeById } = useAccountsStore();

export async function readTotalTransactions(accountId: number) {
  const { count: transactions_count, error: transactions_error } = await anonClient
    .from('transactions')
    .select('*', { count: 'exact', head: true })
    .eq('account_id', accountId);
  if (transactions_error) {
    throw transactions_error;
  }

  return transactions_count;
}

export async function readTransactionsInRange(accountId: number, from: number, to: number) {
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

export async function readTransactionsWithinDateRange(accountId: number, from: string, to: string) {
  const accountType = accountTypeById(accountId);

  let query = anonClient
    .from('transactions')
    .select('category_main, category_misc, amount')
    .eq('account_id', accountId)
    .gte('date', from)
    .lte('date', to);

  if (accountType === 'Credit Line') {
    query = query.gt('amount', 0);
  } else {
    query = query.lt('amount', 0);
  }

  const { data: transactions_data, error: transactions_error } = await query;
  if (transactions_error) {
    throw transactions_error;
  }

  return transactions_data.map((data) => {
    const result: ReportCategoryData = {
      category_main: data.category_main,
      category_misc: data.category_misc,
      amount: Math.abs(data.amount).toString(),
      percent: '0'
    };
    return result;
  });
}

export async function createTransaction(
  data: Database['public']['Tables']['transactions']['Insert']
) {
  const { data: transactions_data, error: transactions_error } = await anonClient
    .from('transactions')
    .insert({
      name: data.name,
      date: data.date,
      amount: data.amount,
      category_main: data.category_main,
      category_misc: data.category_misc,
      account_id: data.account_id
    })
    .select()
    .single();
  if (transactions_error) {
    throw transactions_error;
  }

  return transactions_data;
}

export async function createTransactions(
  data: Database['public']['Tables']['transactions']['Insert'][]
) {
  const { data: transactions_data, error: transactions_error } = await anonClient
    .from('transactions')
    .insert(data)
    .select();
  if (transactions_error) {
    throw transactions_error;
  }

  return transactions_data;
}

export async function updateTransaction(
  data: Database['public']['Tables']['transactions']['Update']
) {
  const { data: transactions_data, error: transactions_error } = await anonClient
    .from('transactions')
    .update({
      name: data.name,
      date: data.date,
      amount: data.amount,
      category_main: data.category_main,
      category_misc: data.category_misc
    })
    .eq('id', data.id as number)
    .select()
    .single();
  if (transactions_error) {
    throw transactions_error;
  }

  return transactions_data;
}
