<template>
  <div class="grid grid-cols-1 gap-2 sm:grid-cols-6">
    <ImportTemplateFileSelect class="sm:col-span-3" />
    <ImportTemplateDownloadButton class="sm:col-span-2" />
    <Button
      label="Import"
      size="small"
      @click="handleTemplateImport"
      :loading="loading"
      :disabled="!readyToImport"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { useToast } from 'primevue/usetoast';
import Button from 'primevue/button';

import { useTransactions } from '@/composables/useTransactions';

import ImportTemplateFileSelect from './ImportTemplateFileSelect.vue';
import ImportTemplateDownloadButton from './ImportTemplateDownloadButton.vue';

const toast = useToast();

const { readyToImport, importTransactions } = useTransactions();

const loading = ref(false);
async function handleTemplateImport() {
  try {
    loading.value = true;
    await importTransactions();
    toast.add({
      severity: 'success',
      summary: 'Import Transactions Successful!',
      life: 2500
    });
  } catch (error: any) {
    console.error(error);
    toast.add({
      severity: 'error',
      summary: 'Import Transactions Failed',
      detail: error.message,
      life: 2500
    });
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped></style>
