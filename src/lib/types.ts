export interface Profile {
  id: string;
  name: string;
  currency: string;
  currency_symbol: string;
  date_format: string;
  month_start_day: number;
  theme: 'light' | 'dark' | 'auto';
  onboarded: boolean;
  created_at: string;
  updated_at: string;
}

export type AccountType =
  | 'checking'
  | 'savings'
  | 'cash'
  | 'digital'
  | 'investment'
  | 'other';

export interface Account {
  id: string;
  user_id: string;
  name: string;
  institution: string;
  type: AccountType;
  initial_balance: number;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  parent_id: string | null;
  type: 'income' | 'expense';
  icon: string;
  color: string;
  is_default: boolean;
  sort_order: number;
  created_at: string;
}

export type TransactionType = 'income' | 'expense' | 'transfer';

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  description: string;
  amount: number;
  date: string;
  category_id: string | null;
  subcategory_id: string | null;
  account_id: string | null;
  destination_account_id: string | null;
  card_id: string | null;
  payment_method: string;
  installments_total: number;
  installment_number: number;
  parent_transaction_id: string | null;
  recurring: boolean;
  frequency: string;
  establishment: string;
  observation: string;
  is_demo: boolean;
  bill_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreditCard {
  id: string;
  user_id: string;
  name: string;
  bank: string;
  limit: number;
  closing_day: number;
  due_day: number;
  created_at: string;
  updated_at: string;
}

export interface Budget {
  id: string;
  user_id: string;
  category_id: string | null;
  month_limit: number;
  created_at: string;
  updated_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  accumulated: number;
  deadline: string | null;
  created_at: string;
  updated_at: string;
}

export interface GoalContribution {
  id: string;
  user_id: string;
  goal_id: string;
  amount: number;
  date: string;
  created_at: string;
}

export interface Debt {
  id: string;
  user_id: string;
  name: string;
  institution: string;
  original_amount: number;
  balance: number;
  interest_rate: number;
  installment_amount: number;
  remaining_installments: number;
  due_day: number;
  created_at: string;
  updated_at: string;
}

export interface DebtPayment {
  id: string;
  user_id: string;
  debt_id: string;
  amount: number;
  date: string;
  created_at: string;
}

export interface Investment {
  id: string;
  user_id: string;
  name: string;
  institution: string;
  quantity: number;
  invested_amount: number;
  current_amount: number;
  date: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface AssetLiability {
  id: string;
  user_id: string;
  name: string;
  kind: 'asset' | 'liability';
  type: string;
  value: number;
  created_at: string;
  updated_at: string;
}

export type BillDirection = 'payable' | 'receivable';
export type BillStatus = 'pending' | 'paid' | 'overdue';

export interface Bill {
  id: string;
  user_id: string;
  direction: BillDirection;
  description: string;
  amount: number;
  due_date: string;
  category_id: string | null;
  account_id: string | null;
  status: BillStatus;
  paid_transaction_id: string | null;
  recurring: boolean;
  frequency: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  created_at: string;
}

export interface AiInsight {
  id: string;
  user_id: string;
  kind: string;
  title: string;
  body: string;
  month: string;
  created_at: string;
}

export interface Settings {
  id: string;
  user_id: string;
  notify_bills: boolean;
  notify_card_closing: boolean;
  notify_budget: boolean;
  notify_installments: boolean;
  notify_goals: boolean;
  ai_preferences: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}
