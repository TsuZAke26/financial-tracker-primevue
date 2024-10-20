<template>
  <Button label="Add Transaction" size="small" @click="showDialog = true" />
  <Dialog v-model:visible="showDialog" modal header="Add Transaction">
    <form @submit.prevent="handleAddTransaction" class="space-y-4">
      <!-- Category -->
      <div class="flex flex-col gap-2">
        <label for="add-transaction-category">Category</label>
        <Select
          id="add-transaction-category"
          v-model="category"
          :options="TRANSACTION_CATEGORIES_MAIN"
          placeholder="Select a category"
          fluid
          :invalid="category === null"
        />
      </div>

      <!-- Miscellaneous Category-->
      <div v-if="category === 'Miscellaneous'" class="flex flex-col gap-2">
        <label for="add-transaction-misc-category">Misc. Category</label>
        <InputText
          id="add-transaction-category"
          v-model="miscCategory"
          placeholder="Enter a miscellaneous category"
          fluid
        />
      </div>

      <!-- Date -->
      <div class="flex flex-col gap-2">
        <label for="add-transaction-date">Date</label>
        <DatePicker
          v-model="date"
          showButtonBar
          date-format="yy-mm-dd"
          input-id="add-transaction-date"
          fluid
          :pt="{ pcInput: { root: { required: true } } }"
        />
      </div>

      <!-- Transaction Name -->
      <div class="flex flex-col gap-2">
        <label for="add-transaction-name">Name</label>
        <InputText id="add-transaction-name" v-model="name" fluid required />
      </div>

      <!-- Amount -->
      <div class="flex flex-col gap-2">
        <label for="add-transaction-amount">Amount</label>
        <InputNumber
          inputId="add-transaction-amount"
          v-model="amount"
          fluid
          :pt="{ pcInput: { root: { required: true } } }"
          currency="USD"
          mode="currency"
          useGrouping
          required
        />
      </div>

      <Button type="submit" label="Submit" class="float-right" :loading="loading" />
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, ref, type Ref } from 'vue';

import { useToast } from 'primevue/usetoast';

import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Select from 'primevue/select';
import DatePicker from 'primevue/datepicker';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';

import { useTransactions } from '@/composables/useTransactions';

import { TRANSACTION_CATEGORIES_MAIN } from '@/types/ui-types';
import type { Database } from '@/types/supabase';
import { toISODate } from '@/utils/date-utils';

const props = defineProps({
  accountId: {
    type: Number,
    required: true
  }
});

const toast = useToast();
const { getAccountId, addTransaction } = useTransactions();

const showDialog = ref(false);
const loading = ref(false);

const category = ref('');
const miscCategory = ref('');
const name = ref('');
const date: Ref<Date | null> = ref(null);
const amount: Ref<number | null> = ref(null);
const isFormValid = computed(() => {
  const hasCategory = category.value !== null && category.value.length > 0;
  const hasName = name.value !== null && name.value.length > 0;
  const hasDate = date.value !== null;
  const hasAmount = amount.value !== null && amount.value !== 0;
  const hasMiscCategory =
    category.value === 'Miscellaneous' &&
    miscCategory.value !== null &&
    miscCategory.value.length > 0;
  return (hasCategory || hasMiscCategory) && hasName && hasDate && hasAmount;
});

async function handleAddTransaction() {
  if (!isFormValid.value) {
    return;
  }

  try {
    loading.value = true;
    const newTransactionData: Database['public']['Tables']['transactions']['Insert'] = {
      account_id: getAccountId(),
      category_main: category.value,
      name: name.value,
      date: toISODate(date.value as Date),
      amount: amount.value as number
    };

    await addTransaction(newTransactionData);

    showDialog.value = false;
    toast.add({
      severity: 'success',
      summary: 'Transaction Created!',
      life: 2500
    });
  } catch (error: any) {
    console.error(error);
    toast.add({
      severity: 'error',
      summary: 'Add Transaction Failed',
      detail: error.message,
      life: 2500
    });
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped></style>
