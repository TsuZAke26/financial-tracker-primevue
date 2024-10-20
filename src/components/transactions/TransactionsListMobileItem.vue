<template>
  <div
    class="p-4 space-y-2 border rounded-lg cursor-pointer border-neutral-200 dark:border-neutral-700"
    @click="showDialog = true"
  >
    <!-- Name and Amount -->
    <div class="flex flex-row items-center justify-between">
      <div class="text-sm font-semibold truncate">{{ transaction.name }}</div>
      <div class="text-sm font-bold" :class="styleAmount(transaction.amount)">
        {{ formatAmount(transaction.amount) }}
      </div>
    </div>
    <!-- Category & Date -->
    <div class="flex flex-row items-center justify-between">
      <Badge :value="transaction.category_main" severity="info" size="small" />
      <div class="text-sm">{{ transaction.date }}</div>
    </div>
  </div>

  <Dialog v-model:visible="showDialog" modal header="Edit Transaction">
    <form @submit.prevent="handleEditTransaction" class="space-y-4">
      <!-- Category -->
      <div class="flex flex-col gap-2">
        <label for="edit-transaction-category">Category</label>
        <Select
          id="edit-transaction-category"
          v-model="category"
          :options="TRANSACTION_CATEGORIES_MAIN"
          placeholder="Select a category"
          fluid
          :invalid="category === null"
        />
      </div>

      <!-- Miscellaneous Category-->
      <div v-if="category === 'Miscellaneous'" class="flex flex-col gap-2">
        <label for="edit-transaction-misc-category">Misc. Category</label>
        <InputText
          id="edit-transaction-misc-category"
          v-model="miscCategory"
          placeholder="Select a category"
          fluid
        />
      </div>

      <!-- Date -->
      <div class="flex flex-col gap-2">
        <label for="edit-transaction-date">Date</label>
        <DatePicker
          v-model="date"
          showButtonBar
          date-format="yy-mm-dd"
          input-id="edit-transaction-date"
          fluid
          :pt="{ pcInput: { root: { required: true } } }"
        />
      </div>

      <!-- Transaction Name -->
      <div class="flex flex-col gap-2">
        <label for="edit-transaction-name">Name</label>
        <InputText id="edit-transaction-name" v-model="name" fluid required />
      </div>

      <!-- Amount -->
      <div class="flex flex-col gap-2">
        <label for="edit-transaction-amount">Amount</label>
        <InputNumber
          inputId="edit-transaction-amount"
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
import { computed, ref, toRef, type PropType, type Ref } from 'vue';

import { useToast } from 'primevue/usetoast';
import Badge from 'primevue/badge';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Select from 'primevue/select';
import DatePicker from 'primevue/datepicker';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';

import { useTransactions } from '@/composables/useTransactions';

import type { Database } from '@/types/supabase';
import { TRANSACTION_CATEGORIES_MAIN } from '@/types/ui-types';

import { toISODate } from '@/utils/date-utils';
import { formatAmount, styleAmount } from '@/utils/format-utils';

const props = defineProps({
  transaction: {
    type: Object as PropType<Database['public']['Tables']['transactions']['Row']>,
    required: true
  }
});
const reactiveTransaction = toRef(props.transaction);

const toast = useToast();
const { editTransaction } = useTransactions();

const showDialog = ref(false);
const loading = ref(false);

const category = ref(reactiveTransaction.value.category_main);
const miscCategory = ref(reactiveTransaction.value.category_misc ?? 'Miscellaneous');
const name = ref(reactiveTransaction.value.name);
const date: Ref<Date | null> = ref(new Date(Date.parse(reactiveTransaction.value.date)));
const amount: Ref<number | null> = ref(reactiveTransaction.value.amount);
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

async function handleEditTransaction() {
  if (!isFormValid.value) {
    return;
  }

  try {
    loading.value = true;
    const newTransactionData: Database['public']['Tables']['transactions']['Update'] = {
      id: reactiveTransaction.value.id,
      category_main: category.value,
      category_misc: miscCategory.value,
      name: name.value,
      date: toISODate(date.value as Date),
      amount: amount.value as number
    };

    await editTransaction(newTransactionData);

    showDialog.value = false;
    toast.add({
      severity: 'success',
      summary: 'Transaction Updated!',
      life: 2500
    });
  } catch (error: any) {
    console.error(error);
    toast.add({
      severity: 'error',
      summary: 'Edit Transaction Failed',
      detail: error.message,
      life: 2500
    });
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped></style>
