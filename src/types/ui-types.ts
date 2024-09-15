import type { Database } from './supabase';

export const ACCOUNT_TYPES: Database['public']['Enums']['account_type'][] = [
  'Checking',
  'Savings',
  'Credit Line'
];

export const ACCOUNT_TYPES_MAX_BALANCE_REQUIRED: Database['public']['Enums']['account_type'][] = [
  'Credit Line'
];

export interface AccountSummary {
  id: number;
  name: string;
  accountType: Database['public']['Enums']['account_type'];
  balance: number;
}
