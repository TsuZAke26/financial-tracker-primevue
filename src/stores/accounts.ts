import { ref, type Ref } from 'vue';
import { defineStore } from 'pinia';

import type { Database } from '@/types/supabase';
import {
  createAccount,
  readAllAccountBalances,
  readAllAccounts
} from '@/supabase/database/db-accounts';

export const useAccountsStore = defineStore('accounts', () => {
  const accounts: Ref<Database['public']['Tables']['accounts']['Row'][]> = ref([]);
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
  async function addAccount(data: Database['public']['Tables']['accounts']['Insert']) {
    const newAccount = await createAccount(data);
    if (newAccount) {
      accounts.value.push(newAccount);
    }
  }

  const accountBalances: Ref<Database['public']['Views']['account_balance']['Row'][]> = ref([]);
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

  return { accounts, fetchAccounts, addAccount, accountBalances, fetchAccountBalances };
});
