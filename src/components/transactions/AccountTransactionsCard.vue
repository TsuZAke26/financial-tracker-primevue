<template>
  <Card>
    <template #content>
      <Tabs value="0" scrollable>
        <TabList>
          <Tab value="0">Summary</Tab>
          <Tab value="1">Reports</Tab>
          <Tab value="2">Transactions</Tab>
          <Tab value="3">Import</Tab>
        </TabList>
        <TabPanels>
          <TabPanel value="0">
            <div>Account Data</div>
          </TabPanel>
          <TabPanel value="1">
            <div>Spending Reports</div>
          </TabPanel>
          <TabPanel value="2">
            <TransactionsTabPanelContent
              :account-id="accountId"
              :transactions="transactions"
              @fetch-transactions="fetchNextPage($event)"
            />
          </TabPanel>
          <TabPanel value="3">
            <ImportTransactions />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import Card from 'primevue/card';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';

import TransactionsTabPanelContent from './TransactionsTabPanelContent.vue';
import ImportTransactions from './import/ImportTransactions.vue';

import { useTransactions } from '@/composables/useTransactions';

const props = defineProps({
  accountId: {
    type: Number,
    required: true
  }
});

const {
  setAccountId,
  transactions,
  total,
  fetchTotalTransactions,
  fetchTransactions,
  resetTransactions
} = useTransactions();

resetTransactions();
setAccountId(props.accountId);

await fetchTotalTransactions();

const from = ref(0);
const to = ref(10);

await fetchTransactions(from.value, to.value);
async function fetchNextPage(pageSize: number) {
  if (to.value < total.value) {
    from.value = to.value;
    to.value = from.value + pageSize;
    await fetchTransactions(from.value, to.value);
  }
}
</script>

<style scoped></style>
