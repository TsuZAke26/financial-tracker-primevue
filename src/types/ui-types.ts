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

export const TRANSACTION_CATEGORIES_MAIN = [
  'Personal',
  'Shopping',
  'Food & Drink',
  'Groceries',
  'Home',
  'Pro Services',
  'Health',
  'Entertainment',
  'Bills',
  'Automotive',
  'Travel',
  'Gas',
  'Education',
  'Gifts',
  'Transfer',
  'Deposit',
  'Withdrawal',
  'Fees',
  'Miscellaneous'
];

export interface ReportCategoryData {
  category_main: string;
  category_misc: string | null;
  amount: string;
}
