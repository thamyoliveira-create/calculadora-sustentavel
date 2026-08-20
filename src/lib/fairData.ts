import { Answers, CalculationResult } from './calculations';
import { CategoryId, CATEGORY_LABELS } from './questions';
import { supabase } from './supabaseClient';

export interface FairParticipantRow {
  id: string;
  final_score: number;
  category_scores: Record<string, number>;
  transport_mode: string | null;
  recycles: string | null;
  compares_prices: string | null;
  pays_more_sustainable: string | null;
  annual_savings: number;
  annual_energy: number;
  annual_supermarket: number;
  created_at: string;
}

export interface FairAggregate {
  totalParticipants: number;
  averageScore: number;
  averageSavings: number;
  transportBreakdown: Record<string, number>;
  recyclesAlwaysPct: number;
  comparesPricesAlwaysPct: number;
  paysMoreSimPct: number;
  paysMoreDependsPct: number;
}

/** Submit anonymous results for one completed questionnaire. */
export async function submitParticipant(
  answers: Answers,
  result: CalculationResult,
): Promise<void> {
  const categoryScores: Record<string, number> = {};
  for (const cat of Object.keys(result.categoryScores) as CategoryId[]) {
    categoryScores[cat] = result.categoryScores[cat].percent;
  }

  const transportMode = typeof answers[8] === 'string' ? answers[8] : null;
  const recycles = typeof answers[17] === 'string' ? answers[17] : null;
  const comparesPrices = typeof answers[15] === 'string' ? answers[15] : null;
  const paysMore =
    typeof answers[16] === 'string' ? answers[16] : null;

  const { error } = await supabase.from('fair_participants').insert({
    final_score: result.finalScore,
    category_scores: categoryScores,
    transport_mode: transportMode,
    recycles,
    compares_prices: comparesPrices,
    pays_more_sustainable: paysMore,
    annual_savings: Number(result.annualSavingsDefault.toFixed(2)),
    annual_energy: Number(result.annualEnergy.toFixed(2)),
    annual_supermarket: Number(result.annualSupermarket.toFixed(2)),
  });
  if (error) throw error;
}

/** Fetch the aggregate fair results (computed here from all anonymous rows). */
export async function fetchFairAggregate(): Promise<FairAggregate> {
  const { data, error } = await supabase
    .from('fair_participants')
    .select(
      'final_score, transport_mode, recycles, compares_prices, pays_more_sustainable, annual_savings',
    );
  if (error) throw error;
  const rows = (data ?? []) as Pick<
    FairParticipantRow,
    | 'final_score'
    | 'transport_mode'
    | 'recycles'
    | 'compares_prices'
    | 'pays_more_sustainable'
    | 'annual_savings'
  >[];

  const n = rows.length;
  const sum = (sel: (r: (typeof rows)[number]) => number) =>
    rows.reduce((a, r) => a + sel(r), 0);

  const transportModes = [
    'Caminhada',
    'Bicicleta',
    'Transporte público',
    'Carro compartilhado',
    'Carro sozinho',
    'Motocicleta',
    'Transporte por aplicativo',
  ];
  const transportBreakdown: Record<string, number> = {};
  for (const mode of transportModes) {
    const count = rows.filter((r) => r.transport_mode === mode).length;
    transportBreakdown[mode] = n > 0 ? (count / n) * 100 : 0;
  }

  const countAnswer = (
    field: 'recycles' | 'compares_prices' | 'pays_more_sustainable',
    value: string,
  ) => rows.filter((r) => (r as unknown as Record<string, string | null>)[field] === value).length;

  return {
    totalParticipants: n,
    averageScore: n > 0 ? Math.round((sum((r) => r.final_score) / n) * 10) / 10 : 0,
    averageSavings:
      n > 0
        ? Math.round((sum((r) => Number(r.annual_savings)) / n) * 100) / 100
        : 0,
    transportBreakdown,
    recyclesAlwaysPct:
      n > 0 ? (countAnswer('recycles', 'Sempre') / n) * 100 : 0,
    comparesPricesAlwaysPct:
      n > 0 ? (countAnswer('compares_prices', 'Sempre') / n) * 100 : 0,
    paysMoreSimPct:
      n > 0 ? (countAnswer('pays_more_sustainable', 'Sim') / n) * 100 : 0,
    paysMoreDependsPct:
      n > 0
        ? (countAnswer('pays_more_sustainable', 'Depende do preço') / n) * 100
        : 0,
  };
}

export interface FairAverage {
  totalParticipants: number;
  averageScore: number;
  averageSavings: number;
  averageEnergy: number;
  averageSupermarket: number;
  averageCategoryScores: Record<string, number>;
}

/** Fetch averages for comparison with the individual participant's result. */
export async function fetchFairAverage(): Promise<FairAverage> {
  const { data, error } = await supabase
    .from('fair_participants')
    .select(
      'final_score, category_scores, annual_savings, annual_energy, annual_supermarket',
    );
  if (error) throw error;
  const rows = (data ?? []) as Pick<
    FairParticipantRow,
    'final_score' | 'category_scores' | 'annual_savings' | 'annual_energy' | 'annual_supermarket'
  >[];

  const n = rows.length;
  const sum = (sel: (r: (typeof rows)[number]) => number) =>
    rows.reduce((a, r) => a + sel(r), 0);

  const cats = Object.keys(CATEGORY_LABELS) as CategoryId[];
  const averageCategoryScores: Record<string, number> = {};
  for (const cat of cats) {
    const vals = rows
      .map((r) => (r.category_scores?.[cat] as number | undefined) ?? 0)
      .filter((v) => typeof v === 'number');
    averageCategoryScores[cat] =
      vals.length > 0
        ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10
        : 0;
  }

  return {
    totalParticipants: n,
    averageScore: n > 0 ? Math.round((sum((r) => r.final_score) / n) * 10) / 10 : 0,
    averageSavings:
      n > 0
        ? Math.round((sum((r) => Number(r.annual_savings)) / n) * 100) / 100
        : 0,
    averageEnergy:
      n > 0
        ? Math.round((sum((r) => Number(r.annual_energy ?? 0)) / n) * 100) / 100
        : 0,
    averageSupermarket:
      n > 0
        ? Math.round((sum((r) => Number(r.annual_supermarket ?? 0)) / n) * 100) / 100
        : 0,
    averageCategoryScores,
  };
}

/** Category label helper exported for the dashboard. */
export function categoryLabel(cat: CategoryId): string {
  return CATEGORY_LABELS[cat];
}
