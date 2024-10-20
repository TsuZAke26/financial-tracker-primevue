import { ref, type Ref } from 'vue';
import { defineStore } from 'pinia';

import type { Database } from '@/types/supabase';
import {
  createAccount,
  readAccountBalanceById,
  readAllAccountBalances,
  readAllAccounts,
  updateAccount
} from '@/supabase/database/db-accounts';

export const useAccountsStore = defineStore('accounts', () => {
  const accounts: Ref<Database['public']['Tables']['accounts']['Row'][]> = ref([]);
  const currentAccount: Ref<Database['public']['Tables']['accounts']['Row'] | undefined> =
    ref(undefined);
  function accountTypeById(accountId: number) {
    const exists = accounts.value.find((existingAccount) => existingAccount.id === accountId);
    if (exists) {
      return exists.account_type;
    }
  }
  async function fetchAccounts() {
    const fetchedAccounts = await readAllAccounts();
    fetchedAccounts.forEach((fetchedAccount) => {
      const existingIndex = accounts.value.findIndex((account) => account.id === fetchedAccount.id);
      if (existingIndex !== -1) {
        accounts.value.splice(existingIndex, 1, fetchedAccount);
      } else {
        accounts.value.push(fetchedAccount);
      }
    });
  }
  async function fetchAccountById(accountId: number) {
    const existingIndex = accounts.value.findIndex((account) => account.id === accountId);
    if (existingIndex === -1) {
      await fetchAccounts();
    }
    currentAccount.value = accounts.value.find((storeAccount) => storeAccount.id === accountId);
  }
  async function addAccount(data: Database['public']['Tables']['accounts']['Insert']) {
    const newAccount = await createAccount(data);
    if (newAccount) {
      accounts.value.push(newAccount);
    }
  }
  async function editAccount(data: Database['public']['Tables']['accounts']['Update']) {
    const updatedAccount = await updateAccount(data);

    currentAccount.value = updatedAccount;

    const existingIndex = accounts.value.findIndex((account) => account.id === updatedAccount.id);
    if (existingIndex !== -1) {
      accounts.value.splice(existingIndex, 1, updatedAccount);
    }
  }

  const accountBalances: Ref<Database['public']['Views']['account_balance']['Row'][]> = ref([]);
  const currentAccountBalance: Ref<
    Database['public']['Views']['account_balance']['Row'] | undefined
  > = ref(undefined);
  async function fetchAccountBalances() {
    const fetchedAccountBalances = await readAllAccountBalances();
    fetchedAccountBalances.forEach((fetchedAccountBalance) => {
      const existingIndex = accountBalances.value.findIndex(
        (accountBalance) => accountBalance.id === fetchedAccountBalance.id
      );
      if (existingIndex !== -1) {
        accountBalances.value.splice(existingIndex, 1, fetchedAccountBalance);
      } else {
        accountBalances.value.push(fetchedAccountBalance);
      }
    });
  }
  async function fetchAccountBalanceById(accountId: number) {
    currentAccountBalance.value = await readAccountBalanceById(accountId);
  }

  return {
    accounts,
    currentAccount,
    accountTypeById,
    fetchAccounts,
    fetchAccountById,
    addAccount,
    editAccount,
    accountBalances,
    currentAccountBalance,
    fetchAccountBalances,
    fetchAccountBalanceById
  };
});
