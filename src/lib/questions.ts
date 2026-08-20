export type CategoryId =
  | 'energia'
  | 'agua'
  | 'transporte'
  | 'alimentacao'
  | 'compras'
  | 'residuos';

export type QuestionType = 'numeric' | 'choice' | 'scale';

export interface ChoiceOption {
  label: string;
  /** Internal monetary/numeric value (for energy bill, supermarket, etc.) */
  value?: number;
  /** Sustainability points (0-10) — undefined when the question does not score */
  points?: number;
}

export interface Question {
  id: number;
  category: CategoryId;
  type: QuestionType;
  /** Short label used for category display */
  categoryLabel: string;
  prompt: string;
  /** For choice questions */
  options?: ChoiceOption[];
  /** For numeric questions */
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  /** Whether this question contributes to the sustainability score */
  scored: boolean;
}

export const CATEGORY_LABELS: Record<CategoryId, string> = {
  energia: 'Energia',
  agua: 'Água',
  transporte: 'Transporte',
  alimentacao: 'Alimentação',
  compras: 'Compras e Consumo',
  residuos: 'Resíduos',
};

export const CATEGORY_SHORT_LABELS: Record<CategoryId, string> = {
  energia: 'Energia',
  agua: 'Água',
  transporte: 'Transporte',
  alimentacao: 'Alimentação',
  compras: 'Compras',
  residuos: 'Resíduos',
};

export const QUESTIONS: Question[] = [
  // ENERGIA
  {
    id: 1,
    category: 'energia',
    categoryLabel: 'Energia',
    type: 'numeric',
    prompt: 'Quantas pessoas moram na sua casa?',
    min: 1,
    max: 10,
    step: 1,
    unit: 'pessoas',
    scored: false,
  },
  {
    id: 2,
    category: 'energia',
    categoryLabel: 'Energia',
    type: 'choice',
    prompt: 'Qual é aproximadamente o valor mensal da conta de energia?',
    scored: false,
    options: [
      { label: 'Até R$ 100', value: 80 },
      { label: 'R$ 101 a R$ 200', value: 150 },
      { label: 'R$ 201 a R$ 300', value: 250 },
      { label: 'R$ 301 a R$ 500', value: 400 },
      { label: 'Mais de R$ 500', value: 600 },
    ],
  },
  {
    id: 3,
    category: 'energia',
    categoryLabel: 'Energia',
    type: 'choice',
    prompt: 'Você costuma apagar as luzes ao sair dos ambientes?',
    scored: true,
    options: [
      { label: 'Sempre', points: 10 },
      { label: 'Às vezes', points: 5 },
      { label: 'Raramente', points: 0 },
    ],
  },
  {
    id: 4,
    category: 'energia',
    categoryLabel: 'Energia',
    type: 'choice',
    prompt: 'Na sua casa, a maioria das lâmpadas é LED?',
    scored: true,
    options: [
      { label: 'Sim', points: 10 },
      { label: 'Algumas', points: 5 },
      { label: 'Não', points: 0 },
    ],
  },
  // ÁGUA
  {
    id: 5,
    category: 'agua',
    categoryLabel: 'Água',
    type: 'choice',
    prompt: 'Quanto tempo dura aproximadamente o seu banho?',
    scored: true,
    options: [
      { label: 'Até 5 minutos', points: 10 },
      { label: 'Entre 6 e 10 minutos', points: 7 },
      { label: 'Entre 11 e 15 minutos', points: 3 },
      { label: 'Mais de 15 minutos', points: 0 },
    ],
  },
  {
    id: 6,
    category: 'agua',
    categoryLabel: 'Água',
    type: 'choice',
    prompt: 'Você fecha a torneira enquanto escova os dentes?',
    scored: true,
    options: [
      { label: 'Sempre', points: 10 },
      { label: 'Às vezes', points: 5 },
      { label: 'Nunca', points: 0 },
    ],
  },
  {
    id: 7,
    category: 'agua',
    categoryLabel: 'Água',
    type: 'choice',
    prompt: 'Você reutiliza água em alguma atividade doméstica?',
    scored: true,
    options: [
      { label: 'Frequentemente', points: 10 },
      { label: 'Às vezes', points: 5 },
      { label: 'Nunca', points: 0 },
    ],
  },
  // TRANSPORTE
  {
    id: 8,
    category: 'transporte',
    categoryLabel: 'Transporte',
    type: 'choice',
    prompt: 'Qual meio de transporte você mais utiliza?',
    scored: true,
    options: [
      { label: 'Caminhada', points: 10 },
      { label: 'Bicicleta', points: 10 },
      { label: 'Transporte público', points: 8 },
      { label: 'Carro compartilhado', points: 6 },
      { label: 'Motocicleta', points: 4 },
      { label: 'Carro sozinho', points: 2 },
      { label: 'Transporte por aplicativo', points: 2 },
    ],
  },
  {
    id: 9,
    category: 'transporte',
    categoryLabel: 'Transporte',
    type: 'numeric',
    prompt: 'Quantos quilômetros aproximadamente você percorre por dia?',
    min: 0,
    max: 500,
    step: 1,
    unit: 'km',
    scored: false,
  },
  // ALIMENTAÇÃO
  {
    id: 10,
    category: 'alimentacao',
    categoryLabel: 'Alimentação',
    type: 'choice',
    prompt:
      'Com que frequência alimentos acabam sendo jogados fora na sua casa?',
    scored: true,
    options: [
      { label: 'Quase nunca', points: 10 },
      { label: '1 vez por semana', points: 7 },
      { label: '2 a 3 vezes por semana', points: 3 },
      { label: 'Quase todos os dias', points: 0 },
    ],
  },
  {
    id: 11,
    category: 'alimentacao',
    categoryLabel: 'Alimentação',
    type: 'choice',
    prompt: 'Você costuma planejar as compras antes de ir ao mercado?',
    scored: true,
    options: [
      { label: 'Sempre', points: 10 },
      { label: 'Às vezes', points: 5 },
      { label: 'Nunca', points: 0 },
    ],
  },
  {
    id: 12,
    category: 'alimentacao',
    categoryLabel: 'Alimentação',
    type: 'choice',
    prompt:
      'Quanto aproximadamente sua família gasta por mês com supermercado?',
    scored: false,
    options: [
      { label: 'Até R$ 500', value: 400 },
      { label: 'R$ 501 a R$ 1.000', value: 750 },
      { label: 'R$ 1.001 a R$ 1.500', value: 1250 },
      { label: 'R$ 1.501 a R$ 2.500', value: 2000 },
      { label: 'Mais de R$ 2.500', value: 3000 },
    ],
  },
  // COMPRAS E CONSUMO
  {
    id: 13,
    category: 'compras',
    categoryLabel: 'Compras e Consumo',
    type: 'choice',
    prompt:
      'Com que frequência você compra roupas, acessórios ou outros produtos sem ter planejado?',
    scored: true,
    options: [
      { label: 'Quase nunca', points: 10 },
      { label: 'Algumas vezes', points: 5 },
      { label: 'Frequentemente', points: 0 },
    ],
  },
  {
    id: 14,
    category: 'compras',
    categoryLabel: 'Compras e Consumo',
    type: 'choice',
    prompt: 'Quando compra um produto, você considera sua durabilidade?',
    scored: true,
    options: [
      { label: 'Sempre', points: 10 },
      { label: 'Às vezes', points: 5 },
      { label: 'Nunca', points: 0 },
    ],
  },
  {
    id: 15,
    category: 'compras',
    categoryLabel: 'Compras e Consumo',
    type: 'choice',
    prompt: 'Você compara preços antes de comprar?',
    scored: true,
    options: [
      { label: 'Sempre', points: 10 },
      { label: 'Às vezes', points: 5 },
      { label: 'Nunca', points: 0 },
    ],
  },
  {
    id: 16,
    category: 'compras',
    categoryLabel: 'Compras e Consumo',
    type: 'choice',
    prompt:
      'Você pagaria um pouco mais por um produto que comprovadamente tivesse menor impacto ambiental?',
    scored: false,
    options: [
      { label: 'Sim' },
      { label: 'Depende do preço' },
      { label: 'Não' },
    ],
  },
  // RESÍDUOS
  {
    id: 17,
    category: 'residuos',
    categoryLabel: 'Resíduos',
    type: 'choice',
    prompt: 'Você separa materiais recicláveis?',
    scored: true,
    options: [
      { label: 'Sempre', points: 10 },
      { label: 'Às vezes', points: 5 },
      { label: 'Nunca', points: 0 },
    ],
  },
  {
    id: 18,
    category: 'residuos',
    categoryLabel: 'Resíduos',
    type: 'choice',
    prompt:
      'Você costuma reutilizar embalagens, sacolas ou recipientes?',
    scored: true,
    options: [
      { label: 'Frequentemente', points: 10 },
      { label: 'Às vezes', points: 5 },
      { label: 'Nunca', points: 0 },
    ],
  },
];

export const TOTAL_QUESTIONS = QUESTIONS.length;

/** Maximum possible points per category (sum of best option points among scored questions). */
export function maxPointsByCategory(): Record<CategoryId, number> {
  const map: Record<CategoryId, number> = {
    energia: 0,
    agua: 0,
    transporte: 0,
    alimentacao: 0,
    compras: 0,
    residuos: 0,
  };
  for (const q of QUESTIONS) {
    if (!q.scored || !q.options) continue;
    const best = Math.max(...q.options.map((o) => o.points ?? 0));
    map[q.category] += best;
  }
  return map;
}

export const MAX_POINTS_BY_CATEGORY = maxPointsByCategory();
export const MAX_TOTAL_POINTS = Object.values(MAX_POINTS_BY_CATEGORY).reduce(
  (a, b) => a + b,
  0,
);
