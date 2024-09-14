import { ref, computed, type Ref } from 'vue';
import { defineStore } from 'pinia';

import type { Database } from '@/types/supabase';

export const useAccountsStore = defineStore('accounts', () => {
  const accounts: Ref<Database['public']['Tables']['accounts']['Row'][]> = ref([]);

  return { accounts };
});
