<template>
  <Card class="w-full max-w-sm">
    <template #title>Sign In</template>
    <template #content>
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label for="email">Email</label>
          <InputText id="email" v-model="email" fluid type="email" />
        </div>

        <div class="flex flex-col gap-2">
          <label for="password">Password</label>
          <InputText id="password" v-model="password" fluid type="password" />
        </div>

        <Button :loading="loading" @click="handleSignIn" label="Sign In" />
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { useToast } from 'primevue/usetoast';

import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

import { anonClient } from '@/supabase/clients/anon-client';

const toast = useToast();

const email = ref('');
const password = ref('');
const loading = ref(false);

async function handleSignIn() {
  loading.value = true;
  try {
    const { error } = await anonClient.auth.signInWithPassword({
      email: email.value as string,
      password: password.value as string
    });
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error(error);
    toast.add({
      severity: 'error',
      summary: 'Login Failed',
      detail: 'Incorrect username or password',
      life: 2500
    });
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped></style>
