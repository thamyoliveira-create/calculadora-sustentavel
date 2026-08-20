/*
# Add annual_energy and annual_supermarket columns to fair_participants

1. Purpose
- Stores the participant's annual energy and supermarket spending so the results screen can compare the individual with the fair average.
- Existing rows get a default of 0 — no data is lost.

2. Modified Tables
- `fair_participants`
  - `annual_energy` (numeric, default 0) — annual energy spending in BRL
  - `annual_supermarket` (numeric, default 0) — annual supermarket spending in BRL

3. Security
- No policy changes — existing INSERT/SELECT policies for anon + authenticated remain unchanged.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fair_participants' AND column_name = 'annual_energy'
  ) THEN
    ALTER TABLE fair_participants ADD COLUMN annual_energy numeric(12,2) NOT NULL DEFAULT 0;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fair_participants' AND column_name = 'annual_supermarket'
  ) THEN
    ALTER TABLE fair_participants ADD COLUMN annual_supermarket numeric(12,2) NOT NULL DEFAULT 0;
  END IF;
END $$;
