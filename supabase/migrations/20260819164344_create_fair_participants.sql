/*
# Create fair_participants table (anonymous collective results)

1. Purpose
- Stores anonymous, aggregated data from each completed questionnaire at a school sustainability fair.
- No personal identification is collected (no name, CPF, email, phone, address, location).

2. New Tables
- `fair_participants`
  - `id` (uuid, primary key)
  - `final_score` (integer, 0-100, sustainability percentage)
  - `category_scores` (jsonb, per-category percentages: energia, agua, transporte, alimentacao, compras, residuos)
  - `transport_mode` (text, the main transport mode chosen by the visitor)
  - `recycles` (text, the answer about separating recyclables: Sempre / Às vezes / Nunca)
  - `compares_prices` (text, the answer about comparing prices: Sempre / Às vezes / Nunca)
  - `pays_more_sustainable` (text, the answer about paying more for sustainable product: Sim / Depende do preço / Não)
  - `annual_savings` (numeric, simulated annual savings in BRL)
  - `created_at` (timestamptz, default now())

3. Security
- Enable RLS on `fair_participants`.
- This is a no-auth public/shared app: visitors submit anonymously and the fair dashboard reads aggregate data.
- Allow anon + authenticated to INSERT (visitor submits their result).
- Allow anon + authenticated to SELECT (fair dashboard reads aggregate totals).
- UPDATE and DELETE are not needed and are denied by default (no policies).

4. Notes
- All values are anonymous; no user_id is stored.
- No individual rows are shown in the dashboard — only aggregate counts/averages.
- Column types are chosen to make SQL aggregations (avg, count) straightforward.
*/

CREATE TABLE IF NOT EXISTS fair_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  final_score integer NOT NULL CHECK (final_score >= 0 AND final_score <= 100),
  category_scores jsonb NOT NULL DEFAULT '{}'::jsonb,
  transport_mode text,
  recycles text,
  compares_prices text,
  pays_more_sustainable text,
  annual_savings numeric(12,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE fair_participants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_participants" ON fair_participants;
CREATE POLICY "anon_insert_participants"
  ON fair_participants FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_participants" ON fair_participants;
CREATE POLICY "anon_select_participants"
  ON fair_participants FOR SELECT
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS fair_participants_created_at_idx ON fair_participants(created_at);
