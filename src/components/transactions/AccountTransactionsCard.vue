<template>
  <Card>
    <template #content>
      <Tabs value="0">
        <TabList>
          <Tab value="0">Summary</Tab>
          <Tab value="1">Transactions</Tab>
          <Tab value="2">Reports</Tab>
        </TabList>
        <TabPanels>
          <TabPanel value="0">
            <div>Account Data</div>
          </TabPanel>
          <TabPanel value="1">
            <TransactionsTab
              :transactions="transactions"
              @fetch-transactions="fetchNextPage($event)"
            />
          </TabPanel>
          <TabPanel value="2">
            <div>Spending Reports</div>
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

import TransactionsTab from './TransactionsTab.vue';

import { useTransactions } from '@/composables/useTransactions';

const props = defineProps({
  accountId: {
    type: Number,
    required: true
  }
});

const { transactions, total, getTotalTransactions, fetchTransactions } = useTransactions();

await getTotalTransactions(props.accountId);

const from = ref(0);
const to = ref(10);
await fetchTransactions(props.accountId, from.value, to.value);
async function fetchNextPage(pageSize: number) {
  if (to.value < total.value) {
    from.value = to.value + 1;
    to.value = from.value + pageSize;
    await fetchTransactions(props.accountId, from.value, to.value);
  }
}
</script>

<style scoped></style>
