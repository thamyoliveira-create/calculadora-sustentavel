import { Transaction, Category, Account, Budget, Goal, Debt, Investment, AssetLiability, Bill, CreditCard } from './types';
import {
  monthSummary, spendingByCategory, monthOverMonth, monthKey, monthKeyOffset,
  budgetStatuses, goalProgress, recommendedMonthlySaving, totalDebt, totalInvested,
  cardInvoice, cardUsedLimit, forecastEndOfMonth, consolidatedBalance,
} from './finance';
import { formatBRL, formatPercent, monthLabel, shortMonthLabel } from './format';
import { CATEGORY_KEYWORDS } from './defaultCategories';

export interface Insight {
  kind: 'spending-increase' | 'budget-alert' | 'subscription' | 'installment' | 'forecast' | 'category-share' | 'saving-tip' | 'anomaly';
  title: string;
  body: string;
}

/** Generate deterministic insights from real user data. */
export function generateInsights(opts: {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  goals: Goal[];
  debts: Debt[];
  bills: Bill[];
  accounts: Account[];
  cards: CreditCard[];
}): Insight[] {
  const { transactions, categories, budgets, goals, debts, bills, accounts, cards } = opts;
  const insights: Insight[] = [];
  const currentKey = monthKeyOffset(0);
  const prevKey = monthKeyOffset(-1);
  const current = monthSummary(transactions, currentKey);
  const prev = monthSummary(transactions, prevKey);

  // 1. Spending increases per category vs last month
  const currentCats = spendingByCategory(transactions, categories, currentKey);
  const prevCats = spendingByCategory(transactions, categories, prevKey);
  for (const c of currentCats.slice(0, 6)) {
    const prevC = prevCats.find((p) => p.categoryId === c.categoryId);
    if (!prevC || prevC.total === 0) continue;
    const pct = (c.total - prevC.total) / prevC.total;
    if (pct >= 0.15) {
      insights.push({
        kind: 'spending-increase',
        title: `Gastos com ${c.name} aumentaram`,
        body: `Seus gastos com ${c.name} passaram de ${formatBRL(prevC.total)} para ${formatBRL(c.total)} neste mês (+${formatPercent(pct * 100, 0)} em relação a ${monthLabel(prevKey).split(' ')[0]}).`,
      });
    }
  }

  // 2. Budget alerts
  const budgets2 = budgetStatuses(budgets, transactions, categories, currentKey);
  for (const b of budgets2) {
    if (b.percent >= 80) {
      const catName = categories.find((c) => c.id === b.budget.category_id)?.name ?? 'Orçamento geral';
      if (b.percent >= 100) {
        insights.push({
          kind: 'budget-alert',
          title: `Orçamento de ${catName} ultrapassado`,
          body: `Você já gastou ${formatBRL(b.spent)} do orçamento de ${formatBRL(b.budget.month_limit)} para ${catName} (${formatPercent(b.percent, 0)}).`,
        });
      } else {
        insights.push({
          kind: 'budget-alert',
          title: `Orçamento de ${catName} próximo do limite`,
          body: `Você utilizou ${formatPercent(b.percent, 0)} do orçamento de ${catName} (${formatBRL(b.spent)} de ${formatBRL(b.budget.month_limit)}).`,
        });
      }
    }
  }

  // 3. Subscriptions total (recurring expenses)
  const subs = transactions.filter(
    (t) => t.recurring && t.type === 'expense' && monthKey(t.date) === currentKey,
  );
  if (subs.length > 0) {
    const total = subs.reduce((a, t) => a + Number(t.amount), 0);
    insights.push({
      kind: 'subscription',
      title: `${subs.length} assinaturas recorrentes neste mês`,
      body: `Você possui ${subs.length} despesas recorrentes que totalizam ${formatBRL(total)} por mês — equivalente a ${formatBRL(total * 12)} por ano.`,
    });
  }

  // 4. Installments this month
  const installments = transactions.filter(
    (t) => t.type === 'expense' && t.installments_total > 1 && monthKey(t.date) === currentKey,
  );
  if (installments.length > 0) {
    const total = installments.reduce((a, t) => a + Number(t.amount), 0);
    insights.push({
      kind: 'installment',
      title: `Compras parceladas neste mês`,
      body: `${formatBRL(total)} das despesas deste mês correspondem a parcelas de compras parceladas (${installments.length} parcelas).`,
    });
  }

  // 5. Forecast end-of-month
  if (accounts.length > 0 || bills.length > 0) {
    const fc = forecastEndOfMonth(transactions, accounts, bills, []);
    if (Number.isFinite(fc.projectedBalance)) {
      insights.push({
        kind: 'forecast',
        title: `Saldo estimado no fim do mês`,
        body: `Considerando saldo atual de ${formatBRL(fc.currentBalance)}, receitas previstas de ${formatBRL(fc.expectedIncome)} e despesas previstas de ${formatBRL(fc.expectedExpense)}, seu saldo estimado no final do mês é de aproximadamente ${formatBRL(fc.projectedBalance)}. (Estimativa)`,
      });
    }
  }

  // 6. Savings rate
  if (current.income > 0) {
    insights.push({
      kind: 'category-share',
      title: `Taxa de economia de ${formatPercent(current.savingsRate)}`,
      body: `Em ${monthLabel(currentKey).split(' ')[0]} você recebeu ${formatBRL(current.income)}, gastou ${formatBRL(current.expense)} e economizou ${formatBRL(current.balance)} (${formatPercent(current.savingsRate)} da renda).`,
    });
  }

  // 7. Top category share
  if (currentCats.length > 0) {
    const top = currentCats[0];
    insights.push({
      kind: 'category-share',
      title: `Maior categoria: ${top.name}`,
      body: `${top.name} representa ${formatPercent(top.percent)} das suas despesas deste mês (${formatBRL(top.total)}).`,
    });
  }

  // 8. Goal progress tip
  for (const g of goals.slice(0, 1)) {
    const rec = recommendedMonthlySaving(g);
    if (rec !== null && rec > 0) {
      insights.push({
        kind: 'saving-tip',
        title: `Meta: ${g.name}`,
        body: `Para atingir ${g.name} até ${g.deadline ? monthLabel(g.deadline) : 'o prazo'}, você precisa guardar aproximadamente ${formatBRL(rec)} por mês.`,
      });
    }
  }

  return insights;
}

/** Detect anomalies: categories whose current-month spend is far above the 3-month average. */
export function detectAnomalies(opts: {
  transactions: Transaction[];
  categories: Category[];
}): { categoryName: string; current: number; average: number; diffPct: number }[] {
  const { transactions, categories } = opts;
  const currentKey = monthKeyOffset(0);
  const currentCats = spendingByCategory(transactions, categories, currentKey);
  const out: { categoryName: string; current: number; average: number; diffPct: number }[] = [];

  for (const c of currentCats) {
    const prevTotals: number[] = [];
    for (let i = 1; i <= 3; i++) {
      const k = monthKeyOffset(-i);
      const txs = transactions.filter((t) => t.type === 'expense' && monthKey(t.date) === k && t.category_id === c.categoryId);
      prevTotals.push(txs.reduce((a, t) => a + Number(t.amount), 0));
    }
    const nonZero = prevTotals.filter((v) => v > 0);
    if (nonZero.length === 0) continue;
    const avg = nonZero.reduce((a, b) => a + b, 0) / nonZero.length;
    if (avg <= 0) continue;
    const diffPct = ((c.current - avg) / avg) * 100;
    if (diffPct >= 50 && c.current >= 50) {
      out.push({ categoryName: c.name, current: c.current, average: avg, diffPct });
    }
  }
  return out.sort((a, b) => b.diffPct - a.diffPct);
}

interface ChatContext {
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
  cards: CreditCard[];
  budgets: Budget[];
  goals: Goal[];
  debts: Debt[];
  investments: Investment[];
  assetsLiabilities: AssetLiability[];
  bills: Bill[];
}

/** Deterministic chat responder. Always uses real data; says so when data is missing. */
export function chatAnswer(question: string, ctx: ChatContext): string {
  const q = question.toLowerCase().trim();
  const curKey = monthKeyOffset(0);
  const cur = monthSummary(ctx.transactions, curKey);

  if (ctx.transactions.length === 0) {
    return 'Não há dados suficientes cadastrados para calcular isso. Cadastre algumas movimentações para que eu consiga analisar seus gastos.';
  }

  // "Quanto gastei com X este mês / nos últimos N meses"
  const categoryMatch = matchCategoryInText(q, ctx.categories);
  const monthsMatch = q.match(/(\d+)\s*(últimos\s+)?meses|últimos\s+(\d+)\s+meses/);
  const monthsCount = monthsMatch ? parseInt(monthsMatch[1] ?? monthsMatch[3], 10) : 0;

  if (q.includes('comida') || q.includes('aliment')) {
    return answerCategorySpend(ctx.transactions, ctx.categories, ['Alimentação'], monthsMatch ? monthsCount : 0, q);
  }
  if (q.includes('uber') || (q.includes('transport') && q.includes('quanto'))) {
    return answerCategorySpend(ctx.transactions, ctx.categories, ['Transporte'], monthsMatch ? monthsCount : 0, q);
  }
  if (q.includes('assinatura')) {
    const subs = ctx.transactions.filter((t) => t.recurring && t.type === 'expense' && (monthsMatch ? withinLastMonths(t.date, monthsCount) : monthKey(t.date) === curKey));
    const total = subs.reduce((a, t) => a + Number(t.amount), 0);
    if (subs.length === 0) return 'Não há assinaturas recorrentes cadastradas neste período.';
    const list = subs.slice(0, 8).map((t) => `• ${t.description}: ${formatBRL(t.amount)}`).join('\n');
    return `Você possui ${subs.length} assinaturas recorrentes totalizando ${formatBRL(total)}${monthsMatch ? ` nos últimos ${monthsCount} meses` : ' neste mês'}.\n\n${list}`;
  }
  if (categoryMatch && q.includes('gast')) {
    return answerCategorySpend(ctx.transactions, ctx.categories, [categoryMatch.name], monthsMatch ? monthsCount : 0, q);
  }

  if (q.includes('onde') && q.includes('gast') || q.includes('gastando mais')) {
    const cats = spendingByCategory(ctx.transactions, ctx.categories, curKey);
    if (cats.length === 0) return 'Não há despesas registradas neste mês.';
    const top = cats.slice(0, 5).map((c) => `• ${c.name}: ${formatBRL(c.total)} (${formatPercent(c.percent, 0)})`).join('\n');
    return `Suas maiores categorias de gasto neste mês:\n\n${top}`;
  }

  if (q.includes('mês mais caro') || q.includes('mes mais caro')) {
    const months = new Map<string, number>();
    for (const t of ctx.transactions) {
      if (t.type !== 'expense') continue;
      const k = monthKey(t.date);
      months.set(k, (months.get(k) ?? 0) + Number(t.amount));
    }
    if (months.size === 0) return 'Não há despesas registradas.';
    const sorted = [...months.entries()].sort((a, b) => b[1] - a[1]);
    const [k, v] = sorted[0];
    return `Seu mês mais caro foi ${monthLabel(k)} com ${formatBRL(v)} em despesas.`;
  }

  if (q.includes('guardar') || q.includes('consigo guardar') || q.includes('economiz')) {
    if (cur.income === 0) return 'Não há receitas cadastradas neste mês para calcular a economia.';
    return `Neste mês você recebeu ${formatBRL(cur.income)}, gastou ${formatBRL(cur.expense)} e pode guardar até ${formatBRL(cur.balance)} (economia de ${formatPercent(cur.savingsRate)} da renda).`;
  }

  if (q.includes('reserva') && q.includes('emerg')) {
    if (cur.expense === 0) return 'Não há despesas suficientes cadastradas para estimar sua reserva de emergência.';
    const suggested3 = cur.expense * 3;
    const suggested6 = cur.expense * 6;
    const suggested12 = cur.expense * 12;
    return `Com base no seu custo mensal atual de ${formatBRL(cur.expense)}, uma reserva de emergência seria:\n• 3 meses: ${formatBRL(suggested3)}\n• 6 meses: ${formatBRL(suggested6)}\n• 12 meses: ${formatBRL(suggested12)}`;
  }

  if ((q.includes('economizar') || q.includes('guardar')) && q.includes('meta')) {
    const amountMatch = q.match(/r\$\s*([\d.,]+)/) ?? q.match(/(\d[\d.,]+)\s*(reais|por mês)/);
    const perMonth = amountMatch ? parseMoney(amountMatch[1]) : 0;
    if (perMonth <= 0 || ctx.goals.length === 0) {
      if (ctx.goals.length === 0) return 'Você ainda não cadastrou metas. Crie uma meta para que eu possa calcular o tempo necessário.';
      return 'Não consegui identificar o valor mensal na sua pergunta. Tente algo como "Se eu economizar R$ 300 por mês, quando consigo atingir minha meta?"';
    }
    const g = ctx.goals[0];
    const remaining = Math.max(0, g.target_amount - g.accumulated);
    const months = Math.ceil(remaining / perMonth);
    return `Para atingir a meta "${g.name}" faltam ${formatBRL(remaining)}. Economizando ${formatBRL(perMonth)} por mês, você atingirá em aproximadamente ${months} meses.`;
  }

  if (q.includes('parcel') && q.includes('mês que vem')) {
    const nextKey = monthKeyOffset(1);
    const parcels = ctx.transactions.filter((t) => t.type === 'expense' && t.installments_total > 1 && monthKey(t.date) === nextKey);
    const total = parcels.reduce((a, t) => a + Number(t.amount), 0);
    if (parcels.length === 0) return 'Não há parcelas previstas para o próximo mês.';
    return `No próximo mês você terá ${parcels.length} parcelas totalizando ${formatBRL(total)}.`;
  }

  if (q.includes('comparar') || q.includes('compar')) {
    const prevKey = monthKeyOffset(-1);
    const prev = monthSummary(ctx.transactions, prevKey);
    return `Comparação de despesas:\n• ${monthLabel(prevKey).split(' ')[0]}: ${formatBRL(prev.expense)}\n• ${monthLabel(curKey).split(' ')[0]}: ${formatBRL(cur.expense)}\nDiferença: ${formatBRL(cur.expense - prev.expense)} (${formatPercent(((cur.expense - prev.expense) / (prev.expense || 1)) * 100, 1)}).`;
  }

  if (q.includes('despesa') && q.includes('aument')) {
    const cats = spendingByCategory(ctx.transactions, ctx.categories, curKey);
    const prevCats = spendingByCategory(ctx.transactions, ctx.categories, monthKeyOffset(-1));
    const increased = cats
      .map((c) => {
        const p = prevCats.find((x) => x.categoryId === c.categoryId);
        if (!p || p.total === 0) return null;
        const pct = ((c.total - p.total) / p.total) * 100;
        return pct > 0 ? { name: c.name, pct, diff: c.total - p.total } : null;
      })
      .filter(Boolean)
      .sort((a, b) => b!.pct - a!.pct);
    if (increased.length === 0) return 'Nenhuma categoria teve aumento de gastos em relação ao mês anterior.';
    const list = increased.slice(0, 5).map((c) => `• ${c!.name}: +${formatBRL(c!.diff)} (+${formatPercent(c!.pct, 0)})`).join('\n');
    return `Categorias com aumento em relação ao mês anterior:\n\n${list}`;
  }

  if (q.includes('reduz') || q.includes('posso reduzir') || q.includes('o que posso')) {
    const cats = spendingByCategory(ctx.transactions, ctx.categories, curKey);
    if (cats.length === 0) return 'Não há despesas registradas neste mês.';
    const top = cats[0];
    const avg = top.total * 0.3;
    return `Sua maior categoria de gasto este mês é ${top.name} (${formatBRL(top.total)}). Reduzir 30% dessa categoria liberaria aproximadamente ${formatBRL(avg)} neste mês.`;
  }

  return 'Não consegui entender sua pergunta. Tente perguntar sobre gastos por categoria, saldo, assinaturas, parcelas, metas ou comparações entre meses.';
}

function answerCategorySpend(
  transactions: Transaction[],
  categories: Category[],
  categoryNames: string[],
  months: number,
  _q: string,
): string {
  const catIds = categories.filter((c) => categoryNames.includes(c.name)).map((c) => c.id);
  if (months > 0) {
    const txs = transactions.filter((t) => t.type === 'expense' && catIds.includes(t.category_id ?? '') && withinLastMonths(t.date, months));
    const total = txs.reduce((a, t) => a + Number(t.amount), 0);
    if (txs.length === 0) return `Não há despesas registradas com ${categoryNames[0]} nos últimos ${months} meses.`;
    return `Nos últimos ${months} meses você gastou ${formatBRL(total)} com ${categoryNames[0]}, em ${txs.length} transações.`;
  }
  const curKey = monthKeyOffset(0);
  const txs = transactions.filter((t) => t.type === 'expense' && catIds.includes(t.category_id ?? '') && monthKey(t.date) === curKey);
  const total = txs.reduce((a, t) => a + Number(t.amount), 0);
  if (txs.length === 0) return `Não há despesas registradas com ${categoryNames[0]} neste mês.`;
  return `Neste mês você gastou ${formatBRL(total)} com ${categoryNames[0]}, em ${txs.length} transações.`;
}

function withinLastMonths(date: string, months: number): boolean {
  const k = monthKeyOffset(-(months - 1));
  const dk = monthKey(date);
  return dk >= k && dk <= monthKeyOffset(0);
}

function matchCategoryInText(text: string, categories: Category[]): Category | null {
  for (const c of categories) {
    if (text.includes(c.name.toLowerCase())) return c;
  }
  return null;
}

function parseMoney(s: string): number {
  return Number(s.replace(/\./g, '').replace(',', '.')) || 0;
}

/** "Posso comprar?" simulator. */
export interface CanBuyResult {
  classification: 'Baixo impacto' | 'Impacto moderado' | 'Alto impacto';
  reason: string;
  monthlyImpact: number;
  incomeCommittedPct: number;
  projectedBalance: number;
}

export function canBuySimulator(opts: {
  amount: number;
  installments: number;
  currentBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  existingInstallments: number;
}): CanBuyResult {
  const monthly = opts.amount / opts.installments;
  const totalCommitment = opts.existingInstallments + monthly;
  const incomeCommittedPct = opts.monthlyIncome > 0 ? (totalCommitment / opts.monthlyIncome) * 100 : 100;
  const projected = opts.currentBalance + opts.monthlyIncome - opts.monthlyExpense - monthly;

  let classification: CanBuyResult['classification'] = 'Baixo impacto';
  if (incomeCommittedPct > 50 || projected < 0) classification = 'Alto impacto';
  else if (incomeCommittedPct > 30 || projected < opts.monthlyIncome * 0.1) classification = 'Impacto moderado';

  const reasons: string[] = [];
  reasons.push(`Esta compra representa ${formatBRL(monthly)} por mês durante ${opts.installments} ${opts.installments === 1 ? 'mês' : 'meses'}.`);
  reasons.push(`Com ela, seu comprometimento de renda passa para ${formatPercent(incomeCommittedPct)}.`);
  reasons.push(`Seu saldo projetado no próximo mês seria de aproximadamente ${formatBRL(projected)}.`);
  if (classification === 'Alto impacto') {
    reasons.push('Isso pode comprometer seu orçamento e reduzir sua margem de segurança.');
  } else if (classification === 'Impacto moderado') {
    reasons.push('O impacto é relevante, mas não inviabiliza seu orçamento atual.');
  } else {
    reasons.push('O impacto no seu orçamento é pequeno.');
  }

  return {
    classification,
    reason: reasons.join(' '),
    monthlyImpact: monthly,
    incomeCommittedPct,
    projectedBalance: projected,
  };
}

/** Natural-language expense parser for quick add. */
export interface ParsedExpense {
  description: string;
  amount: number;
  categoryName: string | null;
  date: string;
  raw: string;
}

export function parseNaturalExpense(text: string): ParsedExpense {
  const lower = text.toLowerCase();
  // Amount: "48 reais", "r$ 158,90", "158.90"
  let amount = 0;
  const rsMatch = lower.match(/r\$\s*([\d.,]+)/);
  const reaisMatch = lower.match(/([\d.,]+)\s*(reais|real)/);
  const bareMatch = lower.match(/(\d[\d.]*,\d{2}|\d[\d.]*\.\d{2}|\d+)/);
  if (rsMatch) amount = parseMoney(rsMatch[1]);
  else if (reaisMatch) amount = parseMoney(reaisMatch[1]);
  else if (bareMatch) amount = parseMoney(bareMatch[1]);

  // Date
  let date = new Date().toISOString().slice(0, 10);
  if (lower.includes('hoje')) date = new Date().toISOString().slice(0, 10);
  if (lower.includes('ontem')) {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    date = d.toISOString().slice(0, 10);
  }

  // Category
  let categoryName: string | null = null;
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      categoryName = cat;
      break;
    }
  }

  // Description: strip amount + date words
  let description = text
    .replace(/r\$\s*[\d.,]+/gi, '')
    .replace(/[\d.,]+\s*(reais|real)/gi, '')
    .replace(/gastei|gastar|paguei|comprei|compra\s+de|compra/gi, '')
    .replace(/hoje|ontem/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  // If amount was stripped and left nothing useful, try the leftover after the first number
  if (!description) {
    description = text.replace(/[\d.,]+/g, '').replace(/r\$|reais|real|gastei|hoje|ontem/gi, '').trim() || 'Despesa';
  }
  // Capitalize
  description = description.charAt(0).toUpperCase() + description.slice(1);

  return { description: description || 'Despesa', amount, categoryName, date, raw: text };
}
