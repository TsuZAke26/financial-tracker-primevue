<template>
  <div class="relative">
    <!-- App Navigation Bar -->
    <header class="sticky top-0 z-10 w-full">
      <Menubar :model="items">
        <template #item="{ item, props, hasSubmenu }">
          <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
            <a :href="href" v-bind="props.action" @click="navigate">
              <span :class="item.icon" />
              <span class="ml-2">{{ item.label }}</span>
            </a>
          </router-link>
          <a v-else :href="item.url" :target="item.target" v-bind="props.action">
            <span :class="item.icon" />
            <span class="ml-2">{{ item.label }}</span>
            <span v-if="hasSubmenu" class="ml-2 pi pi-fw pi-angle-down" />
          </a>
        </template>
        <template #end><div class="font-semibold">Financial Tracker</div></template>
      </Menubar>
    </header>

    <!-- Main Content -->
    <main class="mx-4 mt-4">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { anonClient } from '@/supabase/clients/anon-client';

import Menubar from 'primevue/menubar';

async function handleSignOut() {
  try {
    const { error: signOutError } = await anonClient.auth.signOut();
    if (signOutError) {
      throw signOutError;
    }
  } catch (error) {
    console.error(error);
  }
}

const items = ref([
  {
    label: 'Home',
    icon: 'pi pi-home',
    route: '/'
  },
  {
    label: 'Settings',
    icon: 'pi pi-cog',
    route: '/settings'
  },
  {
    label: 'Sign Out',
    icon: 'pi pi-sign-out',
    command: handleSignOut
  }
]);
</script>

<style scoped></style>
