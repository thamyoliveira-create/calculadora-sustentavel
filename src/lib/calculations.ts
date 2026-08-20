import {
  CategoryId,
  MAX_POINTS_BY_CATEGORY,
  MAX_TOTAL_POINTS,
  Question,
  QUESTIONS,
} from './questions';

/** Raw answers keyed by question id. Values:
 * - numeric questions: the number
 * - choice questions: the option label (string)
 */
export type Answers = Record<number, number | string>;

export interface CategoryScore {
  category: CategoryId;
  label: string;
  obtained: number;
  max: number;
  percent: number;
}

export interface CalculationResult {
  /** Overall sustainability percentage, 0-100, rounded to integer. */
  finalScore: number;
  classification: Classification;
  classificationMessage: string;
  categoryScores: Record<CategoryId, CategoryScore>;
  /** Annual energy spending (BRL). */
  annualEnergy: number;
  /** Simulated energy savings at 10% (BRL/year). */
  energySavings10: number;
  /** Annual supermarket spending (BRL). */
  annualSupermarket: number;
  /** Simulated supermarket savings at 5% (BRL/year). */
  supermarketSavings5: number;
  /** Annual possible savings = energy savings (10%) + supermarket savings (5%). */
  annualSavingsDefault: number;
  /** Five-year savings (no interest/inflation). */
  fiveYearSavingsDefault: number;
  /** Estimated km traveled per month (km/day * 22). */
  monthlyKm: number;
  /** Estimated annual CO2 savings in kg. */
  annualCo2Kg: number;
  /** Equivalent trees planted/saved per year. */
  treesEquivalent: number;
}

export type Classification =
  | 'alto-impacto'
  | 'transicao'
  | 'consciente'
  | 'sustentavel'
  | 'muito-sustentavel';

export const CLASSIFICATION_INFO: Record<
  Classification,
  { label: string; message: string }
> = {
  'alto-impacto': {
    label: 'Consumo de alto impacto',
    message:
      'Existem várias oportunidades para reduzir desperdícios e gastos no seu cotidiano.',
  },
  transicao: {
    label: 'Consumo em transição',
    message:
      'Você já possui alguns hábitos sustentáveis, mas ainda existem mudanças que podem gerar economia.',
  },
  consciente: {
    label: 'Consumo consciente',
    message:
      'Grande parte das suas escolhas favorece a redução de desperdícios.',
  },
  sustentavel: {
    label: 'Consumo sustentável',
    message:
      'Seus hábitos apresentam um bom equilíbrio entre consumo, economia e uso de recursos.',
  },
  'muito-sustentavel': {
    label: 'Consumo muito sustentável',
    message:
      'Você apresenta hábitos de consumo bastante conscientes.',
  },
};

export function classify(score: number): Classification {
  if (score <= 30) return 'alto-impacto';
  if (score <= 50) return 'transicao';
  if (score <= 70) return 'consciente';
  if (score <= 85) return 'sustentavel';
  return 'muito-sustentavel';
}

function pointsForAnswer(q: Question, answer: string | number | undefined): number {
  if (!q.scored || !q.options || answer === undefined) return 0;
  const opt = q.options.find((o) => o.label === answer);
  return opt?.points ?? 0;
}

export function calculate(answers: Answers): CalculationResult {
  // Per-category scores
  const categoryScores = {} as Record<CategoryId, CategoryScore>;
  for (const cat of Object.keys(MAX_POINTS_BY_CATEGORY) as CategoryId[]) {
    categoryScores[cat] = {
      category: cat,
      label: '',
      obtained: 0,
      max: MAX_POINTS_BY_CATEGORY[cat],
      percent: 0,
    };
  }

  let totalObtained = 0;
  for (const q of QUESTIONS) {
    if (!q.scored) continue;
    const pts = pointsForAnswer(q, answers[q.id]);
    categoryScores[q.category].obtained += pts;
    totalObtained += pts;
  }

  for (const cat of Object.keys(categoryScores) as CategoryId[]) {
    const cs = categoryScores[cat];
    cs.percent =
      cs.max > 0 ? Math.round((cs.obtained / cs.max) * 100) : 0;
  }

  const finalScore =
    MAX_TOTAL_POINTS > 0
      ? Math.round((totalObtained / MAX_TOTAL_POINTS) * 100)
      : 0;

  const classification = classify(finalScore);

  // Monetary values
  // Q2 — monthly energy bill (option.value)
  const energyMonthly = numericChoiceValue(answers[2], 0);
  const annualEnergy = energyMonthly * 12;
  const energySavings10 = annualEnergy * 0.1;

  // Q12 — monthly supermarket (option.value)
  const supermarketMonthly = numericChoiceValue(answers[12], 0);
  const annualSupermarket = supermarketMonthly * 12;
  const supermarketSavings5 = annualSupermarket * 0.05;

  const annualSavingsDefault = energySavings10 + supermarketSavings5;
  const fiveYearSavingsDefault = annualSavingsDefault * 5;

  // Environmental impact estimation
  // ~0.10 kg CO2 per BRL saved in energy + ~0.15 kg CO2 per BRL saved in food waste prevention
  const annualCo2Kg = Math.round(
    energySavings10 * 0.1 + supermarketSavings5 * 0.15,
  );
  // ~15 kg CO2 absorbed per tree per year
  const treesEquivalent = Math.max(1, Math.round(annualCo2Kg / 15));

  // Q9 — km/day
  const kmPerDay = typeof answers[9] === 'number' ? answers[9] : 0;
  const monthlyKm = kmPerDay * 22;

  return {
    finalScore,
    classification,
    classificationMessage: CLASSIFICATION_INFO[classification].message,
    categoryScores,
    annualEnergy,
    energySavings10,
    annualSupermarket,
    supermarketSavings5,
    annualSavingsDefault,
    fiveYearSavingsDefault,
    monthlyKm,
    annualCo2Kg,
    treesEquivalent,
  };
}

/** Resolve the stored numeric `value` from a choice answer (by label). */
function numericChoiceValue(
  answer: number | string | undefined,
  fallback: number,
): number {
  if (answer === undefined) return fallback;
  if (typeof answer === 'number') return answer;
  const q = QUESTIONS.find((qq) =>
    qq.options?.some((o) => o.label === answer),
  );
  const opt = q?.options?.find((o) => o.label === answer);
  const v = opt?.value;
  return typeof v === 'number' ? v : fallback;
}

/** Monthly monetary value used by the simulator (energy + supermarket). */
export function monthlyValues(answers: Answers): {
  energyMonthly: number;
  supermarketMonthly: number;
} {
  return {
    energyMonthly: numericChoiceValue(answers[2], 0),
    supermarketMonthly: numericChoiceValue(answers[12], 0),
  };
}

/** Recompute simulator outputs for given reduction percentages. */
export function simulate(
  answers: Answers,
  energyReductionPct: number,
  supermarketReductionPct: number,
): {
  monthlySavings: number;
  annualSavings: number;
  fiveYearSavings: number;
  annualEnergyReduced: number;
  annualSupermarketReduced: number;
  annualCo2Saved: number;
  treesSaved: number;
} {
  const { energyMonthly, supermarketMonthly } = monthlyValues(answers);
  const annualEnergy = energyMonthly * 12;
  const annualSupermarket = supermarketMonthly * 12;
  const energySavings = annualEnergy * (energyReductionPct / 100);
  const supermarketSavings = annualSupermarket * (supermarketReductionPct / 100);
  const annualSavings = energySavings + supermarketSavings;

  const annualCo2Saved = Math.round(
    energySavings * 0.1 + supermarketSavings * 0.15,
  );
  const treesSaved = Math.max(1, Math.round(annualCo2Saved / 15));

  return {
    monthlySavings: annualSavings / 12,
    annualSavings,
    fiveYearSavings: annualSavings * 5,
    annualEnergyReduced: annualEnergy - energySavings,
    annualSupermarketReduced: annualSupermarket - supermarketSavings,
    annualCo2Saved,
    treesSaved,
  };
}

/** Personalized recommendations based on the lowest-scoring answered questions. */
const RECOMMENDATION_BY_QUESTION: Record<number, string> = {
  3: 'Apagar as luzes ao sair dos ambientes pode reduzir o consumo de energia.',
  4: 'Substituir lâmpadas por modelos LED reduz o gasto mensal de energia.',
  5: 'Reduzir o tempo de banho diminui o consumo de água e o valor da conta.',
  6: 'Fechar a torneira ao escovar os dentes evita dezenas de litros desperdiçados por semana.',
  7: 'Reutilizar água em atividades domésticas ajuda a reduzir o consumo total.',
  8: 'Utilizar alternativas de transporte mais eficientes quando disponíveis reduz gastos e emissões.',
  10: 'Planejar refeições e armazenar melhor os alimentos diminui o desperdício.',
  11: 'Planejar a ida ao mercado antes de comprar evita compras por impulso e desperdício.',
  13: 'Reduzir compras não planejadas ajuda a evitar gastos desnecessários.',
  14: 'Considerar a durabilidade do produto antes da compra prolonga sua vida útil.',
  15: 'Comparar preços antes das compras pode gerar economia ao longo do ano.',
  17: 'Separar materiais recicláveis contribui para a destinação correta do lixo.',
  18: 'Reutilizar embalagens, sacolas e recipientes reduz a geração de resíduos.',
};

export function recommendations(answers: Answers, count = 3): string[] {
  const scored = QUESTIONS.filter((q) => q.scored);
  const ranked = scored
    .map((q) => {
      const pts = pointsForAnswer(q, answers[q.id]);
      const max = Math.max(...(q.options?.map((o) => o.points ?? 0) ?? [10]));
      return { q, pts, ratio: pts / max, answered: answers[q.id] !== undefined };
    })
    .filter((r) => r.answered && r.ratio < 1)
    .sort((a, b) => a.ratio - b.ratio);

  return ranked.slice(0, count).map((r) => RECOMMENDATION_BY_QUESTION[r.q.id]);
}

export interface ChallengeTask {
  id: string;
  day: number;
  title: string;
  description: string;
  category: 'energia' | 'agua' | 'alimentacao' | 'consumo' | 'residuos';
}

export const SUSTAINABLE_CHALLENGE_TASKS: ChallengeTask[] = [
  {
    id: 'day-1',
    day: 1,
    title: 'Apague Aparelhos em Standby',
    description: 'Desconecte da tomada carregadores e aparelhos com luz de standby antes de dormir.',
    category: 'energia',
  },
  {
    id: 'day-2',
    day: 2,
    title: 'Banho Consciente (5 minutos)',
    description: 'Cronometre seu banho em até 5 minutos e feche o registro ao se ensaboar.',
    category: 'agua',
  },
  {
    id: 'day-3',
    day: 3,
    title: 'Dia do Prato Limpo',
    description: 'Sirva apenas o que for consumir e aproveite as sobras do almoço no jantar.',
    category: 'alimentacao',
  },
  {
    id: 'day-4',
    day: 4,
    title: 'Separação Correta de Recicláveis',
    description: 'Lave e separe pelo menos uma embalagem de plástico, papel ou metal para a coleta seletiva.',
    category: 'residuos',
  },
  {
    id: 'day-5',
    day: 5,
    title: 'Ecobag nas Compras',
    description: 'Leve sua própria sacola reutilizável ou mochila ao sair para compras.',
    category: 'consumo',
  },
  {
    id: 'day-6',
    day: 6,
    title: 'Lista de Compras Planejada',
    description: 'Olhe a despensa antes de comprar para evitar itens duplicados e compras impulsivas.',
    category: 'alimentacao',
  },
  {
    id: 'day-7',
    day: 7,
    title: 'Dia do Transporte Sustentável',
    description: 'Faça um trajeto a pé, de bicicleta ou carona compartilhada em vez de ir sozinho de carro.',
    category: 'energia',
  },
];

