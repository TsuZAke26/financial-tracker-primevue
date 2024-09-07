<template>
  <!-- App Navigation Bar -->
  <header class="p-4">
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
          <span v-if="hasSubmenu" class="pi pi-fw pi-angle-down ml-2" />
        </a>
      </template>
    </Menubar>
  </header>

  <!-- Main Content -->
  <main class="mx-4">
    <RouterView />
  </main>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'

import { ref } from 'vue'

import Menubar from 'primevue/menubar'

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
    label: 'About',
    icon: 'pi pi-info-circle',
    route: '/about'
  }
])
</script>
