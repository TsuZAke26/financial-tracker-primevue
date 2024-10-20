<template>
  <input
    id="import-transactions-file-input"
    class="block w-full max-w-md text-sm border rounded-lg border-neutral-200 dark:border-neutral-700 text-slate-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-emerald-500 file:text-white hover:file:bg-emerald-700"
    @change="handleFileSelect"
    accept="text/csv"
    type="file"
  />
</template>

<script setup lang="ts">
import { useTransactions } from '@/composables/useTransactions';

const { setFileToImport } = useTransactions();

function handleFileSelect(event: any) {
  console.log(event);
  setFileToImport(event.target.files[0]);
}
</script>

<style scoped></style>
