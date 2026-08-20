import { supabase } from './supabaseClient';
import {
  Account, Category, Transaction, CreditCard, Budget, Goal, GoalContribution,
  Debt, DebtPayment, Investment, AssetLiability, Bill, Notification, AiInsight, Settings, Profile,
} from './types';
import { DEFAULT_CATEGORIES, DefaultCategoryDef } from './defaultCategories';

export async function fetchProfile(): Promise<Profile | null> {
  const { data, error } = await supabase.from('profiles').select('*').maybeSingle();
  if (error) throw error;
  return data as Profile | null;
}

export async function fetchAccounts(): Promise<Account[]> {
  const { data, error } = await supabase.from('accounts').select('*').order('created_at');
  if (error) throw error;
  return (data ?? []) as Account[];
}
export async function upsertAccount(row: Partial<Account> & { id?: string }): Promise<Account> {
  if (row.id) {
    const { data, error } = await supabase.from('accounts').update({ ...row, updated_at: new Date().toISOString() }).eq('id', row.id).select('*').maybeSingle();
    if (error) throw error;
    return data as Account;
  }
  const { data, error } = await supabase.from('accounts').insert(row).select('*').maybeSingle();
  if (error) throw error;
  return data as Account;
}
export async function deleteAccount(id: string): Promise<void> {
  const { error } = await supabase.from('accounts').delete().eq('id', id);
  if (error) throw error;
}

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from('categories').select('*').order('sort_order').order('name');
  if (error) throw error;
  return (data ?? []) as Category[];
}
export async function insertCategory(row: Partial<Category>): Promise<Category> {
  const { data, error } = await supabase.from('categories').insert(row).select('*').maybeSingle();
  if (error) throw error;
  return data as Category;
}
export async function updateCategory(id: string, row: Partial<Category>): Promise<void> {
  const { error } = await supabase.from('categories').update(row).eq('id', id);
  if (error) throw error;
}
export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
}

/** Seed default categories (and their subcategories) for a new user. Idempotent. */
export async function seedDefaultCategories(): Promise<void> {
  const existing = await fetchCategories();
  if (existing.length > 0) return;
  for (const def of DEFAULT_CATEGORIES) {
    const parent: Partial<Category> = {
      name: def.name,
      type: def.type,
      icon: def.icon,
      color: def.color,
      is_default: true,
      sort_order: 0,
    };
    const { data: created, error } = await supabase
      .from('categories')
      .insert(parent)
      .select('*')
      .maybeSingle();
    if (error || !created) continue;
    if (def.subcategories) {
      for (const sub of def.subcategories) {
        await supabase.from('categories').insert({
          name: sub.name,
          type: def.type,
          icon: sub.icon,
          color: def.color,
          parent_id: (created as Category).id,
          is_default: true,
          sort_order: 0,
        });
      }
    }
  }
}

export async function fetchTransactions(): Promise<Transaction[]> {
  const { data, error } = await supabase.from('transactions').select('*').order('date', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Transaction[];
}

export interface NewTransactionInput {
  type: Transaction['type'];
  description: string;
  amount: number;
  date: string;
  category_id?: string | null;
  subcategory_id?: string | null;
  account_id?: string | null;
  destination_account_id?: string | null;
  card_id?: string | null;
  payment_method?: string;
  installments_total?: number;
  recurring?: boolean;
  frequency?: string;
  establishment?: string;
  observation?: string;
  is_demo?: boolean;
  bill_id?: string | null;
}

/** Insert a transaction; if installments > 1, create N future-dated rows. */
export async function insertTransaction(input: NewTransactionInput): Promise<Transaction[]> {
  const total = input.installments_total && input.installments_total > 1 ? input.installments_total : 1;
  const baseAmount = total > 1 ? Number((input.amount / total).toFixed(2)) : input.amount;
  const rows: Partial<Transaction>[] = [];
  for (let i = 0; i < total; i++) {
    const d = new Date(input.date + 'T00:00:00');
    d.setMonth(d.getMonth() + i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    rows.push({
      type: input.type,
      description: input.description,
      amount: baseAmount,
      date: `${yyyy}-${mm}-${dd}`,
      category_id: input.category_id ?? null,
      subcategory_id: input.subcategory_id ?? null,
      account_id: input.account_id ?? null,
      destination_account_id: input.destination_account_id ?? null,
      card_id: input.card_id ?? null,
      payment_method: input.payment_method ?? '',
      installments_total: total,
      installment_number: i + 1,
      recurring: input.recurring ?? false,
      frequency: input.frequency ?? '',
      establishment: input.establishment ?? '',
      observation: input.observation ?? '',
      is_demo: input.is_demo ?? false,
      bill_id: input.bill_id ?? null,
    });
  }
  const { data, error } = await supabase.from('transactions').insert(rows).select('*');
  if (error) throw error;
  return (data ?? []) as Transaction[];
}

export async function updateTransaction(id: string, row: Partial<Transaction>): Promise<void> {
  const { error } = await supabase.from('transactions').update({ ...row, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) throw error;
}
export async function deleteTransaction(id: string): Promise<void> {
  const { error } = await supabase.from('transactions').delete().eq('id', id);
  if (error) throw error;
}
/** Delete a transaction and all its sibling installments (same parent or same description/date/card). */
export async function deleteTransactionSeries(id: string, all: Transaction[]): Promise<void> {
  const tx = all.find((t) => t.id === id);
  if (!tx) return;
  let ids: string[] = [id];
  if (tx.parent_transaction_id) {
    ids = all.filter((t) => t.parent_transaction_id === tx.parent_transaction_id || t.id === tx.parent_transaction_id).map((t) => t.id);
  } else if (tx.installments_total > 1) {
    // This is the parent or first installment; delete by matching description + card + type
    ids = all.filter((t) => t.description === tx.description && t.card_id === tx.card_id && t.type === tx.type && t.installments_total === tx.installments_total).map((t) => t.id);
  }
  const { error } = await supabase.from('transactions').delete().in('id', ids);
  if (error) throw error;
}

export async function fetchCards(): Promise<CreditCard[]> {
  const { data, error } = await supabase.from('credit_cards').select('*').order('created_at');
  if (error) throw error;
  return (data ?? []) as CreditCard[];
}
export async function upsertCard(row: Partial<CreditCard> & { id?: string }): Promise<CreditCard> {
  if (row.id) {
    const { data, error } = await supabase.from('credit_cards').update({ ...row, updated_at: new Date().toISOString() }).eq('id', row.id).select('*').maybeSingle();
    if (error) throw error;
    return data as CreditCard;
  }
  const { data, error } = await supabase.from('credit_cards').insert(row).select('*').maybeSingle();
  if (error) throw error;
  return data as CreditCard;
}
export async function deleteCard(id: string): Promise<void> {
  const { error } = await supabase.from('credit_cards').delete().eq('id', id);
  if (error) throw error;
}

export async function fetchBudgets(): Promise<Budget[]> {
  const { data, error } = await supabase.from('budgets').select('*').order('created_at');
  if (error) throw error;
  return (data ?? []) as Budget[];
}
export async function upsertBudget(row: Partial<Budget> & { id?: string }): Promise<Budget> {
  if (row.id) {
    const { data, error } = await supabase.from('budgets').update({ ...row, updated_at: new Date().toISOString() }).eq('id', row.id).select('*').maybeSingle();
    if (error) throw error;
    return data as Budget;
  }
  const { data, error } = await supabase.from('budgets').insert(row).select('*').maybeSingle();
  if (error) throw error;
  return data as Budget;
}
export async function deleteBudget(id: string): Promise<void> {
  const { error } = await supabase.from('budgets').delete().eq('id', id);
  if (error) throw error;
}

export async function fetchGoals(): Promise<Goal[]> {
  const { data, error } = await supabase.from('goals').select('*').order('created_at');
  if (error) throw error;
  return (data ?? []) as Goal[];
}
export async function upsertGoal(row: Partial<Goal> & { id?: string }): Promise<Goal> {
  if (row.id) {
    const { data, error } = await supabase.from('goals').update({ ...row, updated_at: new Date().toISOString() }).eq('id', row.id).select('*').maybeSingle();
    if (error) throw error;
    return data as Goal;
  }
  const { data, error } = await supabase.from('goals').insert(row).select('*').maybeSingle();
  if (error) throw error;
  return data as Goal;
}
export async function deleteGoal(id: string): Promise<void> {
  const { error } = await supabase.from('goals').delete().eq('id', id);
  if (error) throw error;
}
export async function addGoalContribution(goalId: string, amount: number, date: string): Promise<void> {
  const { error: insErr } = await supabase.from('goal_contributions').insert({ goal_id: goalId, amount, date });
  if (insErr) throw insErr;
  const { data: goal, error: gErr } = await supabase.from('goals').select('accumulated').eq('id', goalId).maybeSingle();
  if (gErr || !goal) return;
  const newAcc = Number(goal.accumulated) + amount;
  await supabase.from('goals').update({ accumulated: newAcc, updated_at: new Date().toISOString() }).eq('id', goalId);
}

export async function fetchDebts(): Promise<Debt[]> {
  const { data, error } = await supabase.from('debts').select('*').order('created_at');
  if (error) throw error;
  return (data ?? []) as Debt[];
}
export async function upsertDebt(row: Partial<Debt> & { id?: string }): Promise<Debt> {
  if (row.id) {
    const { data, error } = await supabase.from('debts').update({ ...row, updated_at: new Date().toISOString() }).eq('id', row.id).select('*').maybeSingle();
    if (error) throw error;
    return data as Debt;
  }
  const { data, error } = await supabase.from('debts').insert(row).select('*').maybeSingle();
  if (error) throw error;
  return data as Debt;
}
export async function deleteDebt(id: string): Promise<void> {
  const { error } = await supabase.from('debts').delete().eq('id', id);
  if (error) throw error;
}
export async function payDebt(debtId: string, amount: number, date: string): Promise<void> {
  const { error: insErr } = await supabase.from('debt_payments').insert({ debt_id: debtId, amount, date });
  if (insErr) throw insErr;
  const { data: debt, error: gErr } = await supabase.from('debts').select('balance, remaining_installments').eq('id', debtId).maybeSingle();
  if (gErr || !debt) return;
  const newBal = Math.max(0, Number(debt.balance) - amount);
  const newRem = Math.max(0, Number(debt.remaining_installments) - 1);
  await supabase.from('debts').update({ balance: newBal, remaining_installments: newRem, updated_at: new Date().toISOString() }).eq('id', debtId);
}

export async function fetchInvestments(): Promise<Investment[]> {
  const { data, error } = await supabase.from('investments').select('*').order('created_at');
  if (error) throw error;
  return (data ?? []) as Investment[];
}
export async function upsertInvestment(row: Partial<Investment> & { id?: string }): Promise<Investment> {
  if (row.id) {
    const { data, error } = await supabase.from('investments').update({ ...row, updated_at: new Date().toISOString() }).eq('id', row.id).select('*').maybeSingle();
    if (error) throw error;
    return data as Investment;
  }
  const { data, error } = await supabase.from('investments').insert(row).select('*').maybeSingle();
  if (error) throw error;
  return data as Investment;
}
export async function deleteInvestment(id: string): Promise<void> {
  const { error } = await supabase.from('investments').delete().eq('id', id);
  if (error) throw error;
}

export async function fetchAssetsLiabilities(): Promise<AssetLiability[]> {
  const { data, error } = await supabase.from('assets_liabilities').select('*').order('kind').order('name');
  if (error) throw error;
  return (data ?? []) as AssetLiability[];
}
export async function upsertAssetLiability(row: Partial<AssetLiability> & { id?: string }): Promise<AssetLiability> {
  if (row.id) {
    const { data, error } = await supabase.from('assets_liabilities').update({ ...row, updated_at: new Date().toISOString() }).eq('id', row.id).select('*').maybeSingle();
    if (error) throw error;
    return data as AssetLiability;
  }
  const { data, error } = await supabase.from('assets_liabilities').insert(row).select('*').maybeSingle();
  if (error) throw error;
  return data as AssetLiability;
}
export async function deleteAssetLiability(id: string): Promise<void> {
  const { error } = await supabase.from('assets_liabilities').delete().eq('id', id);
  if (error) throw error;
}

export async function fetchBills(): Promise<Bill[]> {
  const { data, error } = await supabase.from('bills').select('*').order('due_date');
  if (error) throw error;
  return (data ?? []) as Bill[];
}
export async function upsertBill(row: Partial<Bill> & { id?: string }): Promise<Bill> {
  if (row.id) {
    const { data, error } = await supabase.from('bills').update({ ...row, updated_at: new Date().toISOString() }).eq('id', row.id).select('*').maybeSingle();
    if (error) throw error;
    return data as Bill;
  }
  const { data, error } = await supabase.from('bills').insert(row).select('*').maybeSingle();
  if (error) throw error;
  return data as Bill;
}
export async function deleteBill(id: string): Promise<void> {
  const { error } = await supabase.from('bills').delete().eq('id', id);
  if (error) throw error;
}
export async function markBillPaid(bill: Bill, accountId: string): Promise<Transaction | null> {
  // create a transaction for the bill
  const txInput: NewTransactionInput = {
    type: bill.direction === 'payable' ? 'expense' : 'income',
    description: bill.description,
    amount: Number(bill.amount),
    date: new Date().toISOString().slice(0, 10),
    category_id: bill.category_id,
    account_id: accountId,
    bill_id: bill.id,
  };
  const created = await insertTransaction(txInput);
  const tx = created[0] ?? null;
  await supabase.from('bills').update({ status: 'paid', paid_transaction_id: tx?.id ?? null, updated_at: new Date().toISOString() }).eq('id', bill.id);
  return tx;
}

export async function fetchNotifications(): Promise<Notification[]> {
  const { data, error } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Notification[];
}
export async function markNotificationRead(id: string): Promise<void> {
  const { error } = await supabase.from('notifications').update({ read: true }).eq('id', id);
  if (error) throw error;
}
export async function insertNotification(n: { type: string; title: string; body: string }): Promise<void> {
  await supabase.from('notifications').insert(n);
}

export async function fetchAiInsights(month?: string): Promise<AiInsight[]> {
  let q = supabase.from('ai_insights').select('*').order('created_at', { ascending: false });
  if (month) q = q.eq('month', month);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as AiInsight[];
}
export async function insertAiInsight(insight: { kind: string; title: string; body: string; month: string }): Promise<void> {
  await supabase.from('ai_insights').insert(insight);
}
export async function clearAiInsights(month: string): Promise<void> {
  const { error } = await supabase.from('ai_insights').delete().eq('month', month);
  if (error) throw error;
}

export async function fetchSettings(): Promise<Settings | null> {
  const { data, error } = await supabase.from('settings').select('*').maybeSingle();
  if (error) throw error;
  if (!data) {
    const { data: created, error: insErr } = await supabase.from('settings').insert({}).select('*').maybeSingle();
    if (insErr) throw insErr;
    return created as Settings;
  }
  return data as Settings;
}
export async function updateSettings(id: string, row: Partial<Settings>): Promise<void> {
  const { error } = await supabase.from('settings').update({ ...row, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) throw error;
}

/** Delete ALL of the current user's financial data (used by "excluir todos os dados"). */
export async function deleteAllUserData(): Promise<void> {
  const tables = [
    'transactions', 'accounts', 'categories', 'credit_cards', 'budgets',
    'goal_contributions', 'goals', 'debt_payments', 'debts', 'investments',
    'assets_liabilities', 'bills', 'notifications', 'ai_insights', 'settings',
  ];
  for (const t of tables) {
    await supabase.from(t).delete().neq('id', '00000000-0000-0000-0000-000000000000');
  }
}

export type { DefaultCategoryDef };
