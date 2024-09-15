<template>
  <Button label="Add Account" @click="showDialog = true" />
  <Dialog v-model:visible="showDialog" modal header="Add Account">
    <form @submit.prevent="handleAddAccount" class="space-y-4">
      <!-- Account Type -->
      <div class="flex flex-col gap-2">
        <label for="add-account-type">Account Type</label>
        <Select
          id="add-account-type"
          v-model="accountType"
          :options="ACCOUNT_TYPES"
          fluid
          required
        />
      </div>

      <!-- Account Name -->
      <div class="flex flex-col gap-2">
        <label for="add-account-name">Account Name</label>
        <InputText id="add-account-name" v-model="name" fluid required />
      </div>

      <!-- (Optional) Maximum Balance -->
      <div
        v-if="ACCOUNT_TYPES_MAX_BALANCE_REQUIRED.includes(accountType)"
        class="flex flex-col gap-2"
      >
        <label for="add-account-max-balance">Max Balance</label>
        <InputNumber
          inputId="add-account-max-balance"
          v-model="maxBalance"
          fluid
          :pt="{ pcInput: { root: { required: true } } }"
          currency="USD"
          mode="currency"
          :min="1"
        />
      </div>
      <Button type="submit" label="Submit" class="float-right" :loading="loading" />
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue';

import { useToast } from 'primevue/usetoast';

import Button from 'primevue/button';
import Select from 'primevue/select';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Dialog from 'primevue/dialog';

import { useAccountsStore } from '@/stores/accounts';

import type { Database } from '@/types/supabase';
import { ACCOUNT_TYPES, ACCOUNT_TYPES_MAX_BALANCE_REQUIRED } from '@/types/ui-types';

const toast = useToast();

const accountsStore = useAccountsStore();
const { addAccount } = accountsStore;

const showDialog = ref(false);
const loading = ref(false);

const name = ref('');
const accountType: Ref<Database['public']['Enums']['account_type']> = ref('Checking');
const maxBalance = ref(undefined);
async function handleAddAccount() {
  try {
    loading.value = true;
    const newAccountData: Database['public']['Tables']['accounts']['Insert'] = {
      name: name.value,
      account_type: accountType.value,
      max_balance: maxBalance.value
    };
    await addAccount(newAccountData);
    showDialog.value = false;
    toast.add({
      severity: 'success',
      summary: 'Account Created!',
      detail: `${accountType.value} account "${name.value}" created`,
      life: 2500
    });
  } catch (error: any) {
    console.error(error);
    toast.add({
      severity: 'error',
      summary: 'Add Account Failed',
      detail: error.message,
      life: 2500
    });
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped></style>
