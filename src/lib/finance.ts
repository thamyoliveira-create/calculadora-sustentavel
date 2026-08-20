import { Transaction, Account, Category, Budget, Goal, Debt, Investment, AssetLiability, Bill, CreditCard } from './types';
import { monthKey, monthKeyOffset, addMonths, startOfMonth } from './format';

/** Sum of amounts for transactions of a type within a month key (YYYY-MM). */
export function sumByMonth(
  transactions: Transaction[],
  type: Transaction['type'],
  key: string,
): number {
  return transactions
    .filter((t) => t.type === type && monthKey(t.date) === key)
    .reduce((acc, t) => acc + Number(t.amount), 0);
}

/** Account balance = initial_balance + income - expense + transfers in - transfers out. */
export function accountBalance(accountId: string, transactions: Transaction[], accounts: Account[]): number {
  const acc = accounts.find((a) => a.id === accountId);
  if (!acc) return 0;
  let bal = Number(acc.initial_balance);
  for (const t of transactions) {
    if (t.account_id === accountId) {
      if (t.type === 'income') bal += Number(t.amount);
      else if (t.type === 'expense') bal -= Number(t.amount);
      else if (t.type === 'transfer') bal -= Number(t.amount);
    }
    if (t.type === 'transfer' && t.destination_account_id === accountId) {
      bal += Number(t.amount);
    }
  }
  return bal;
}

export function consolidatedBalance(transactions: Transaction[], accounts: Account[]): number {
  return accounts.reduce((sum, a) => sum + accountBalance(a.id, transactions, accounts), 0);
}

export interface MonthSummary {
  monthKey: string;
  income: number;
  expense: number;
  balance: number;
  savingsRate: number;
}

export function monthSummary(transactions: Transaction[], key: string): MonthSummary {
  const income = sumByMonth(transactions, 'income', key);
  const expense = sumByMonth(transactions, 'expense', key);
  const balance = income - expense;
  const savingsRate = income > 0 ? (balance / income) * 100 : 0;
  return { monthKey: key, income, expense, balance, savingsRate };
}

export interface CategoryTotal {
  categoryId: string;
  name: string;
  color: string;
  icon: string;
  total: number;
  percent: number;
  count: number;
}

export function spendingByCategory(
  transactions: Transaction[],
  categories: Category[],
  key: string,
): CategoryTotal[] {
  const totals = new Map<string, { total: number; count: number }>();
  const monthTx = transactions.filter(
    (t) => t.type === 'expense' && monthKey(t.date) === key,
  );
  for (const t of monthTx) {
    const catId = t.category_id ?? 'uncategorized';
    const cur = totals.get(catId) ?? { total: 0, count: 0 };
    cur.total += Number(t.amount);
    cur.count += 1;
    totals.set(catId, cur);
  }
  const grandTotal = [...totals.values()].reduce((a, v) => a + v.total, 0);
  const result: CategoryTotal[] = [];
  for (const [catId, v] of totals.entries()) {
    const cat = categories.find((c) => c.id === catId);
    result.push({
      categoryId: catId,
      name: cat?.name ?? 'Outros',
      color: cat?.color ?? '#64748b',
      icon: cat?.icon ?? 'Tag',
      total: v.total,
      percent: grandTotal > 0 ? (v.total / grandTotal) * 100 : 0,
      count: v.count,
    });
  }
  return result.sort((a, b) => b.total - a.total);
}

/** Last N months of income/expense/balance ending at monthOffset (0 = current). */
export function monthlySeries(
  transactions: Transaction[],
  months: number,
  endOffset = 0,
): MonthSummary[] {
  const out: MonthSummary[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const key = monthKeyOffset(endOffset + i - (months - 1) + (months - 1 - (months - 1)));
    // simpler: compute key for offset (endOffset - i)
    out.push(monthSummary(transactions, monthKeyOffset(endOffset - i)));
  }
  // The above loop is messy; rebuild cleanly:
  out.length = 0;
  for (let i = months - 1; i >= 0; i--) {
    out.push(monthSummary(transactions, monthKeyOffset(endOffset - i)));
  }
  return out;
}

/** Balance evolution across months (cumulative consolidated balance up to end of each month). */
export function balanceEvolution(
  transactions: Transaction[],
  accounts: Account[],
  months: number,
): { key: string; balance: number }[] {
  const out: { key: string; balance: number }[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const key = monthKeyOffset(-i);
    const [yyyy, mm] = key.split('-').map(Number);
    const upToDate = new Date(yyyy, mm, 0); // last day of that month
    const txUpToDate = transactions.filter((t) => new Date(t.date + 'T00:00:00') <= upToDate);
    out.push({ key, balance: consolidatedBalance(txUpToDate, accounts) });
  }
  return out;
}

/** Daily expense totals within a month key, for the "spending over the month" chart. */
export function dailySpending(transactions: Transaction[], key: string): { day: number; total: number }[] {
  const map = new Map<number, number>();
  for (const t of transactions) {
    if (t.type !== 'expense') continue;
    if (monthKey(t.date) !== key) continue;
    const d = new Date(t.date + 'T00:00:00').getDate();
    map.set(d, (map.get(d) ?? 0) + Number(t.amount));
  }
  return [...map.entries()]
    .map(([day, total]) => ({ day, total }))
    .sort((a, b) => a.day - b.day);
}

export interface BudgetStatus {
  budget: Budget;
  spent: number;
  remaining: number;
  percent: number;
  status: 'ok' | 'warning' | 'danger' | 'over';
}

export function budgetStatuses(
  budgets: Budget[],
  transactions: Transaction[],
  categories: Category[],
  key: string,
): BudgetStatus[] {
  const monthTx = transactions.filter(
    (t) => t.type === 'expense' && monthKey(t.date) === key,
  );
  return budgets.map((b) => {
    const spent = monthTx
      .filter((t) => (b.category_id ? t.category_id === b.category_id : true))
      .reduce((a, t) => a + Number(t.amount), 0);
    const remaining = b.month_limit - spent;
    const percent = b.month_limit > 0 ? (spent / b.month_limit) * 100 : 0;
    let status: BudgetStatus['status'] = 'ok';
    if (percent >= 100) status = 'over';
    else if (percent >= 80) status = 'danger';
    else if (percent >= 60) status = 'warning';
    return { budget: b, spent, remaining, percent, status };
  });
}

/** Credit card current invoice: sum of card expenses whose date is in the current billing cycle. */
export function cardInvoice(card: CreditCard, transactions: Transaction[], refDate = new Date()): number {
  const closingDay = card.closing_day;
  const start = new Date(refDate);
  if (start.getDate() >= closingDay) {
    start.setMonth(start.getMonth() - 1);
  }
  start.setDate(closingDay);
  start.setHours(0, 0, 0, 0);
  const end = addMonths(start, 1);
  return transactions
    .filter(
      (t) =>
        t.card_id === card.id &&
        t.type === 'expense' &&
        new Date(t.date + 'T00:00:00') >= start &&
        new Date(t.date + 'T00:00:00') < end,
    )
    .reduce((a, t) => a + Number(t.amount), 0);
}

export function cardUsedLimit(cardId: string, transactions: Transaction[]): number {
  // All unpaid card expenses (simplified: all expenses on card)
  return transactions
    .filter((t) => t.card_id === cardId && t.type === 'expense')
    .reduce((a, t) => a + Number(t.amount), 0);
}

/** Predicted end-of-month balance = current balance + expected income - expected expenses. */
export interface BalanceForecast {
  currentBalance: number;
  expectedIncome: number;
  expectedExpense: number;
  projectedBalance: number;
}

export function forecastEndOfMonth(
  transactions: Transaction[],
  accounts: Account[],
  bills: Bill[],
  recurring: Transaction[],
): BalanceForecast {
  const currentBalance = consolidatedBalance(transactions, accounts);
  const now = new Date();
  const key = monthKey(now);
  const today = now.getDate();

  // Expected income from receivable bills due this month, not yet paid
  const expectedIncome = bills
    .filter(
      (b) =>
        b.direction === 'receivable' &&
        b.status === 'pending' &&
        monthKey(b.due_date) === key &&
        new Date(b.due_date + 'T00:00:00').getDate() >= today,
    )
    .reduce((a, b) => a + Number(b.amount), 0);

  // Expected expenses: pending payable bills due rest of month + future recurring installments
  const expectedExpense = bills
    .filter(
      (b) =>
        b.direction === 'payable' &&
        b.status === 'pending' &&
        monthKey(b.due_date) === key &&
        new Date(b.due_date + 'T00:00:00').getDate() >= today,
    )
    .reduce((a, b) => a + Number(b.amount), 0);

  return {
    currentBalance,
    expectedIncome,
    expectedExpense,
    projectedBalance: currentBalance + expectedIncome - expectedExpense,
  };
}

export function goalProgress(goal: Goal): { percent: number; remaining: number } {
  const remaining = Math.max(0, goal.target_amount - goal.accumulated);
  const percent = goal.target_amount > 0 ? (goal.accumulated / goal.target_amount) * 100 : 0;
  return { percent, remaining };
}

/** Months remaining until deadline (from now). */
export function monthsUntilDeadline(deadline: string | null): number | null {
  if (!deadline) return null;
  const d = new Date(deadline + 'T00:00:00');
  const now = new Date();
  return Math.max(0, (d.getFullYear() - now.getFullYear()) * 12 + (d.getMonth() - now.getMonth()));
}

/** Recommended monthly saving to reach a goal by its deadline. */
export function recommendedMonthlySaving(goal: Goal): number | null {
  const months = monthsUntilDeadline(goal.deadline);
  if (months === null || months <= 0) return null;
  const remaining = Math.max(0, goal.target_amount - goal.accumulated);
  return remaining / months;
}

export function totalDebt(debts: Debt[]): number {
  return debts.reduce((a, d) => a + Number(d.balance), 0);
}

export function totalMonthlyInstallments(debts: Debt[]): number {
  return debts.reduce((a, d) => a + Number(d.installment_amount) * Math.min(1, d.remaining_installments), 0);
}

export function totalInvested(investments: Investment[]): { invested: number; current: number } {
  return investments.reduce(
    (acc, inv) => ({
      invested: acc.invested + Number(inv.invested_amount),
      current: acc.current + Number(inv.current_amount),
    }),
    { invested: 0, current: 0 },
  );
}

export function netWorth(items: AssetLiability[]): { assets: number; liabilities: number; net: number } {
  const assets = items.filter((i) => i.kind === 'asset').reduce((a, i) => a + Number(i.value), 0);
  const liabilities = items.filter((i) => i.kind === 'liability').reduce((a, i) => a + Number(i.value), 0);
  return { assets, liabilities, net: assets - liabilities };
}

/** Health score 0-100 based on transparent criteria. */
export interface HealthScore {
  score: number;
  factors: { label: string; value: string; impact: 'positive' | 'neutral' | 'negative' }[];
}

export function financialHealthScore(opts: {
  income: number;
  expense: number;
  debtInstallments: number;
  hasReserve: boolean;
  budgetUsagePercent: number;
  overdueBills: number;
}): HealthScore {
  const factors: HealthScore['factors'] = [];
  let score = 0;

  // 1. Expense/income ratio (max 35)
  const ratio = opts.income > 0 ? opts.expense / opts.income : 1;
  let ratioPts = 0;
  if (ratio <= 0.5) ratioPts = 35;
  else if (ratio <= 0.7) ratioPts = 25;
  else if (ratio <= 0.85) ratioPts = 15;
  else if (ratio <= 1) ratioPts = 5;
  ratioPts = Math.max(0, ratioPts);
  score += ratioPts;
  factors.push({
    label: 'Relação despesa/renda',
    value: `${(ratio * 100).toFixed(0)}%`,
    impact: ratioPts >= 25 ? 'positive' : ratioPts >= 15 ? 'neutral' : 'negative',
  });

  // 2. Savings rate (max 25)
  const savingsRate = opts.income > 0 ? (opts.income - opts.expense) / opts.income : 0;
  let savPts = 0;
  if (savingsRate >= 0.2) savPts = 25;
  else if (savingsRate >= 0.1) savPts = 18;
  else if (savingsRate >= 0.05) savPts = 10;
  else if (savingsRate > 0) savPts = 5;
  score += savPts;
  factors.push({
    label: 'Percentual economizado',
    value: `${(savingsRate * 100).toFixed(1)}%`,
    impact: savPts >= 18 ? 'positive' : savPts >= 10 ? 'neutral' : 'negative',
  });

  // 3. Debt commitment (max 20)
  const debtRatio = opts.income > 0 ? opts.debtInstallments / opts.income : 0;
  let debtPts = 0;
  if (debtRatio <= 0.1) debtPts = 20;
  else if (debtRatio <= 0.2) debtPts = 15;
  else if (debtRatio <= 0.35) debtPts = 8;
  else debtPts = 0;
  score += debtPts;
  factors.push({
    label: 'Comprometimento com dívidas',
    value: `${(debtRatio * 100).toFixed(0)}%`,
    impact: debtPts >= 15 ? 'positive' : debtPts >= 8 ? 'neutral' : 'negative',
  });

  // 4. Reserve (max 10)
  const reservePts = opts.hasReserve ? 10 : 0;
  score += reservePts;
  factors.push({
    label: 'Reserva de emergência',
    value: opts.hasReserve ? 'Possui' : 'Não possui',
    impact: reservePts > 0 ? 'positive' : 'negative',
  });

  // 5. Budget usage (max 5)
  let budPts = 5;
  if (opts.budgetUsagePercent > 100) budPts = 0;
  else if (opts.budgetUsagePercent >= 90) budPts = 2;
  score += budPts;
  factors.push({
    label: 'Uso do orçamento',
    value: `${opts.budgetUsagePercent.toFixed(0)}%`,
    impact: budPts >= 5 ? 'positive' : budPts >= 2 ? 'neutral' : 'negative',
  });

  // 6. Overdue bills (max 5)
  const overduePts = opts.overdueBills === 0 ? 5 : 0;
  score += overduePts;
  factors.push({
    label: 'Contas atrasadas',
    value: String(opts.overdueBills),
    impact: overduePts > 0 ? 'positive' : 'negative',
  });

  return { score: Math.min(100, Math.max(0, Math.round(score))), factors };
}

/** Compare a value to previous month; returns diff + percent. */
export function monthOverMonth(current: number, previous: number): { diff: number; percent: number } {
  const diff = current - previous;
  const percent = previous !== 0 ? ((current - previous) / Math.abs(previous)) * 100 : 0;
  return { diff, percent };
}

/** Build a CSV string from transaction rows. */
export function transactionsToCSV(
  transactions: Transaction[],
  categories: Category[],
  accounts: Account[],
  cards: CreditCard[],
): string {
  const header = [
    'Data', 'Tipo', 'Descrição', 'Valor', 'Categoria', 'Subcategoria',
    'Conta', 'Cartão', 'Forma de pagamento', 'Parcelas', 'Estabelecimento', 'Observação', 'Recorrente',
  ];
  const rows = transactions.map((t) => {
    const cat = categories.find((c) => c.id === t.category_id)?.name ?? '';
    const sub = categories.find((c) => c.id === t.subcategory_id)?.name ?? '';
    const acc = accounts.find((a) => a.id === t.account_id)?.name ?? '';
    const card = cards.find((c) => c.id === t.card_id)?.name ?? '';
    return [
      t.date, t.type, t.description, Number(t.amount).toFixed(2),
      cat, sub, acc, card, t.payment_method,
      t.installments_total > 1 ? `${t.installment_number}/${t.installments_total}` : '',
      t.establishment, t.observation, t.recurring ? 'Sim' : 'Não',
    ];
  });
  return [header, ...rows]
    .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');
}
