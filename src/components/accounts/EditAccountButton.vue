<template>
  <Button label="Edit Account" @click="handleShowEditDialog" size="small" />
  <Dialog v-model:visible="showDialog" modal header="Edit Account">
    <form @submit.prevent="handleEditAccount" class="space-y-4">
      <!-- Account Type -->
      <div class="flex flex-col gap-2">
        <label for="add-account-type">Account Type</label>
        <Select
          id="add-account-type"
          v-model="accountType"
          :options="ACCOUNT_TYPES"
          fluid
          disabled
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
import { storeToRefs } from 'pinia';

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
const { currentAccount } = storeToRefs(accountsStore);
const { editAccount } = accountsStore;

const showDialog = ref(false);
const loading = ref(false);

const name = ref('');
const accountType: Ref<Database['public']['Enums']['account_type']> = ref('Checking');
const maxBalance: Ref<number | undefined> = ref(undefined);
function updateLocalValues() {
  name.value = currentAccount.value?.name as string;
  accountType.value = currentAccount.value
    ?.account_type as Database['public']['Enums']['account_type'];
  maxBalance.value = currentAccount.value?.max_balance as number;
}
function handleShowEditDialog() {
  updateLocalValues();
  showDialog.value = true;
}
async function handleEditAccount() {
  try {
    loading.value = true;
    const updatedAccountData: Database['public']['Tables']['accounts']['Update'] = {
      id: currentAccount.value?.id,
      name: name.value,
      account_type: accountType.value,
      max_balance: maxBalance.value
    };
    await editAccount(updatedAccountData);
    updateLocalValues();
    showDialog.value = false;
    toast.add({
      severity: 'success',
      summary: 'Account Updated!',
      detail: `${accountType.value} account "${name.value}" updated successfully`,
      life: 2500
    });
  } catch (error: any) {
    console.error(error);
    toast.add({
      severity: 'error',
      summary: 'Edit Account Failed',
      detail: error.message,
      life: 2500
    });
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped></style>
