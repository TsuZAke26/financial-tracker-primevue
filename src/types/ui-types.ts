import type { Database } from './supabase';

export interface AccountSummary {
  id: number;
  name: string;
  accountType: Database['public']['Enums']['account_type'];
  balance: number;
}
