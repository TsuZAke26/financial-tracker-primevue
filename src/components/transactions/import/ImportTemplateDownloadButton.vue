<template>
  <Button
    label="Download Template"
    size="small"
    severity="secondary"
    @click="handleDownloadTemplate"
  />
</template>

<script setup lang="ts">
import Button from 'primevue/button';

import { generateImportTemplate } from '@/utils/csv-utils';

function handleDownloadTemplate() {
  const template = new Blob([generateImportTemplate()], { type: 'text/csv' });

  // https://www.geeksforgeeks.org/how-to-export-html-table-to-csv-using-javascript/
  let tempLink = document.createElement('a');

  tempLink.download = 'import_template.csv';
  let templateUrl = window.URL.createObjectURL(template);
  tempLink.href = templateUrl;

  tempLink.style.display = 'none';
  document.body.appendChild(tempLink);

  tempLink.click();
  document.body.removeChild(tempLink);
}
</script>

<style scoped></style>
