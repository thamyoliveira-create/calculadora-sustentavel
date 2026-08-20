/*
# Meu Financeiro IA — core schema (multi-user, per-user RLS)

1. Purpose
- Full personal-finance app. Each user has isolated financial data.
- Auth via Supabase (email/password). Every financial table is owner-scoped.

2. New Tables
- profiles: user display name + app settings (currency, date format, month start, theme, onboarding).
- accounts: bank / cash / digital / investment accounts with initial balance.
- categories: income/expense categories with optional parent (subcategories), icon, color.
- credit_cards: card limit, closing/due days. (created BEFORE transactions — referenced by FK)
- bills: payable / receivable scheduled items with status. (paid_transaction_id is a soft uuid link, no FK, to avoid circular dependency with transactions)
- transactions: income / expense / transfer. Supports installments (parent link), cards, recurring flags.
- budgets: overall (category_id null) or per-category monthly limit.
- goals + goal_contributions: savings goals.
- debts + debt_payments: loans with simulator inputs.
- investments: manually-tracked investments.
- assets_liabilities: net-worth items (asset or liability).
- notifications: in-app notification center.
- ai_insights: persisted AI-generated insight cards per month.
- settings: notification toggles + AI preferences.

3. Security
- RLS enabled on every table.
- Owner-scoped policies (auth.uid() = user_id) for select/insert/update/delete.
- profiles.id is the user id itself (auth.uid() = id).
- user_id columns default to auth.uid() so inserts that omit user_id succeed.
- No anon policies — app requires sign-in; anon sees nothing.

4. Notes
- Money columns use numeric(14,2).
- Dates use date (no tz) for transaction/bill dates; timestamptz for audit fields.
- Indexes on user_id + date for time-range queries.
- No foreign keys to auth.users to avoid cascading permission complexity; user_id is a plain uuid checked by RLS.
*/

-- PROFILES
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  currency text NOT NULL DEFAULT 'BRL',
  currency_symbol text NOT NULL DEFAULT 'R$',
  date_format text NOT NULL DEFAULT 'DD/MM/YYYY',
  month_start_day int NOT NULL DEFAULT 1 CHECK (month_start_day BETWEEN 1 AND 28),
  theme text NOT NULL DEFAULT 'auto' CHECK (theme IN ('light','dark','auto')),
  onboarded boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "sel_own_profiles" ON profiles;
CREATE POLICY "sel_own_profiles" ON profiles FOR SELECT TO authenticated USING (auth.uid() = id);
DROP POLICY IF EXISTS "ins_own_profiles" ON profiles;
CREATE POLICY "ins_own_profiles" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "upd_own_profiles" ON profiles;
CREATE POLICY "upd_own_profiles" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "del_own_profiles" ON profiles;
CREATE POLICY "del_own_profiles" ON profiles FOR DELETE TO authenticated USING (auth.uid() = id);

-- ACCOUNTS
CREATE TABLE IF NOT EXISTS accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  name text NOT NULL,
  institution text NOT NULL DEFAULT '',
  type text NOT NULL DEFAULT 'checking' CHECK (type IN ('checking','savings','cash','digital','investment','other')),
  initial_balance numeric(14,2) NOT NULL DEFAULT 0,
  notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS accounts_user_idx ON accounts(user_id);

-- CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  name text NOT NULL,
  parent_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  type text NOT NULL DEFAULT 'expense' CHECK (type IN ('income','expense')),
  icon text NOT NULL DEFAULT 'Tag',
  color text NOT NULL DEFAULT '#64748b',
  is_default boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS categories_user_idx ON categories(user_id);

-- CREDIT CARDS (before transactions)
CREATE TABLE IF NOT EXISTS credit_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  name text NOT NULL,
  bank text NOT NULL DEFAULT '',
  "limit" numeric(14,2) NOT NULL DEFAULT 0,
  closing_day int NOT NULL DEFAULT 1 CHECK (closing_day BETWEEN 1 AND 31),
  due_day int NOT NULL DEFAULT 10 CHECK (due_day BETWEEN 1 AND 31),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE credit_cards ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS credit_cards_user_idx ON credit_cards(user_id);

-- BILLS (paid_transaction_id is a soft link without FK to avoid circular dependency)
CREATE TABLE IF NOT EXISTS bills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  direction text NOT NULL CHECK (direction IN ('payable','receivable')),
  description text NOT NULL,
  amount numeric(14,2) NOT NULL DEFAULT 0,
  due_date date NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  account_id uuid REFERENCES accounts(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','overdue')),
  paid_transaction_id uuid,
  recurring boolean NOT NULL DEFAULT false,
  frequency text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS bills_user_due_idx ON bills(user_id, due_date);

-- TRANSACTIONS (after cards + bills)
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  type text NOT NULL CHECK (type IN ('income','expense','transfer')),
  description text NOT NULL,
  amount numeric(14,2) NOT NULL DEFAULT 0,
  date date NOT NULL DEFAULT CURRENT_DATE,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  subcategory_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  account_id uuid REFERENCES accounts(id) ON DELETE SET NULL,
  destination_account_id uuid REFERENCES accounts(id) ON DELETE SET NULL,
  card_id uuid REFERENCES credit_cards(id) ON DELETE SET NULL,
  payment_method text NOT NULL DEFAULT '',
  installments_total int NOT NULL DEFAULT 1,
  installment_number int NOT NULL DEFAULT 1,
  parent_transaction_id uuid REFERENCES transactions(id) ON DELETE CASCADE,
  recurring boolean NOT NULL DEFAULT false,
  frequency text NOT NULL DEFAULT '',
  establishment text NOT NULL DEFAULT '',
  observation text NOT NULL DEFAULT '',
  is_demo boolean NOT NULL DEFAULT false,
  bill_id uuid REFERENCES bills(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS transactions_user_date_idx ON transactions(user_id, date);
CREATE INDEX IF NOT EXISTS transactions_user_type_idx ON transactions(user_id, type);
CREATE INDEX IF NOT EXISTS transactions_parent_idx ON transactions(parent_transaction_id);
CREATE INDEX IF NOT EXISTS transactions_card_idx ON transactions(card_id);

-- BUDGETS
CREATE TABLE IF NOT EXISTS budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  month_limit numeric(14,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS budgets_user_idx ON budgets(user_id);

-- GOALS
CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  name text NOT NULL,
  target_amount numeric(14,2) NOT NULL DEFAULT 0,
  accumulated numeric(14,2) NOT NULL DEFAULT 0,
  deadline date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS goals_user_idx ON goals(user_id);

CREATE TABLE IF NOT EXISTS goal_contributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  goal_id uuid NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  amount numeric(14,2) NOT NULL DEFAULT 0,
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE goal_contributions ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS goal_contributions_goal_idx ON goal_contributions(goal_id);

-- DEBTS
CREATE TABLE IF NOT EXISTS debts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  name text NOT NULL,
  institution text NOT NULL DEFAULT '',
  original_amount numeric(14,2) NOT NULL DEFAULT 0,
  balance numeric(14,2) NOT NULL DEFAULT 0,
  interest_rate numeric(6,2) NOT NULL DEFAULT 0,
  installment_amount numeric(14,2) NOT NULL DEFAULT 0,
  remaining_installments int NOT NULL DEFAULT 0,
  due_day int NOT NULL DEFAULT 1 CHECK (due_day BETWEEN 1 AND 31),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE debts ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS debts_user_idx ON debts(user_id);

CREATE TABLE IF NOT EXISTS debt_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  debt_id uuid NOT NULL REFERENCES debts(id) ON DELETE CASCADE,
  amount numeric(14,2) NOT NULL DEFAULT 0,
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE debt_payments ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS debt_payments_debt_idx ON debt_payments(debt_id);

-- INVESTMENTS
CREATE TABLE IF NOT EXISTS investments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  name text NOT NULL,
  institution text NOT NULL DEFAULT '',
  quantity numeric(18,6) NOT NULL DEFAULT 0,
  invested_amount numeric(14,2) NOT NULL DEFAULT 0,
  current_amount numeric(14,2) NOT NULL DEFAULT 0,
  date date NOT NULL DEFAULT CURRENT_DATE,
  category text NOT NULL DEFAULT 'Outros',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS investments_user_idx ON investments(user_id);

-- ASSETS & LIABILITIES (patrimony)
CREATE TABLE IF NOT EXISTS assets_liabilities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  name text NOT NULL,
  kind text NOT NULL CHECK (kind IN ('asset','liability')),
  type text NOT NULL DEFAULT 'Outros',
  value numeric(14,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE assets_liabilities ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS assets_liabilities_user_idx ON assets_liabilities(user_id);

-- NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  type text NOT NULL DEFAULT 'info',
  title text NOT NULL,
  body text NOT NULL DEFAULT '',
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS notifications_user_idx ON notifications(user_id);

-- AI INSIGHTS
CREATE TABLE IF NOT EXISTS ai_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  kind text NOT NULL DEFAULT 'insight',
  title text NOT NULL,
  body text NOT NULL,
  month date NOT NULL DEFAULT date_trunc('month', CURRENT_DATE),
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS ai_insights_user_month_idx ON ai_insights(user_id, month);

-- SETTINGS
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  notify_bills boolean NOT NULL DEFAULT true,
  notify_card_closing boolean NOT NULL DEFAULT true,
  notify_budget boolean NOT NULL DEFAULT true,
  notify_installments boolean NOT NULL DEFAULT true,
  notify_goals boolean NOT NULL DEFAULT true,
  ai_preferences jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS settings_user_idx ON settings(user_id);

-- Generic owner-scoped CRUD policies for all user_id tables.
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'accounts','categories','transactions','credit_cards','budgets',
    'goals','goal_contributions','debts','debt_payments','investments',
    'assets_liabilities','bills','notifications','ai_insights','settings'
  ] LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', 'sel_own_'||t, t);
    EXECUTE format('CREATE POLICY %I ON %I FOR SELECT TO authenticated USING (auth.uid() = user_id)', 'sel_own_'||t, t);
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', 'ins_own_'||t, t);
    EXECUTE format('CREATE POLICY %I ON %I FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id)', 'ins_own_'||t, t);
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', 'upd_own_'||t, t);
    EXECUTE format('CREATE POLICY %I ON %I FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)', 'upd_own_'||t, t);
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', 'del_own_'||t, t);
    EXECUTE format('CREATE POLICY %I ON %I FOR DELETE TO authenticated USING (auth.uid() = user_id)', 'del_own_'||t, t);
  END LOOP;
END $$;
