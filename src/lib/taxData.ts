/**
 * Dados de referência educativos sobre carga tributária (impostos como % do PIB)
 * e custo de vida para comparação entre países.
 *
 * Fontes aproximadas: OCDE / Banco Mundial / institutos de pesquisa tributária.
 * Valores são estimativas educativas para feira escolar — não representam
 * precisão contábil e podem variar ano a ano.
 */

export interface TaxCountry {
  country: string;
  flag: string;
  /** Carga tributária como % do PIB */
  taxBurdenPct: number;
  /** Salário mínimo mensal aproximado em USD (PPP) */
  minWageUSD: number;
  /** Horas típicas trabalhadas por mês */
  monthlyHours: number;
  /** Observação educativa */
  note: string;
}

export const TAX_COUNTRIES: TaxCountry[] = [
  {
    country: 'Brasil',
    flag: '🇧🇷',
    taxBurdenPct: 33.5,
    minWageUSD: 280,
    monthlyHours: 220,
    note:
      'O brasileiro trabalha em média 4 meses e meio só para pagar impostos no ano. A carga tributária brasileira é uma das mais altas do mundo proporcionalmente à renda.',
  },
  {
    country: 'Estados Unidos',
    flag: '🇺🇸',
    taxBurdenPct: 27.7,
    minWageUSD: 1257,
    monthlyHours: 173,
    note:
      'Carga tributária menor que a brasileira, com salário mínimo significativamente maior. Menos dias de trabalho para pagar impostos.',
  },
  {
    country: 'Alemanha',
    flag: '🇩🇪',
    taxBurdenPct: 38.5,
    minWageUSD: 2100,
    monthlyHours: 160,
    note:
      'Carga tributária alta, mas com retorno visível em serviços públicos (saúde, educação, transporte). Salário mínimo elevado.',
  },
  {
    country: 'Noruega',
    flag: '🇳🇴',
    taxBurdenPct: 42.0,
    minWageUSD: 3000,
    monthlyHours: 160,
    note:
      'Uma das cargas mais altas do mundo, mas com um dos maiores retornos sociais e salários mínimos. Alto IDH.',
  },
  {
    country: 'México',
    flag: '🇲🇽',
    taxBurdenPct: 17.9,
    minWageUSD: 375,
    monthlyHours: 240,
    note:
      'Carga tributária baixa, porém com salários baixos e cobertura social limitada.',
  },
  {
    country: 'Chile',
    flag: '🇨🇱',
    taxBurdenPct: 22.2,
    minWageUSD: 570,
    monthlyHours: 180,
    note:
      'Carga tributária moderada com salário mínimo intermediário na América Latina.',
  },
  {
    country: 'Japão',
    flag: '🇯🇵',
    taxBurdenPct: 34.1,
    minWageUSD: 1450,
    monthlyHours: 160,
    note:
      'Carga tributária parecida com a brasileira, porém com salário mínimo muito superior e forte infraestrutura pública.',
  },
  {
    country: 'Suécia',
    flag: '🇸🇪',
    taxBurdenPct: 43.0,
    minWageUSD: 2500,
    monthlyHours: 160,
    note:
      'Carga altíssima, mas com excelente retorno social: educação e saúde gratuitas, previdência robusta.',
  },
];

export const BRAZIL_TAX_DAYS_MESSAGE =
  'No Brasil, a carga tributária é de aproximadamente 33,5% do PIB. Isso significa que, em média, o brasileiro trabalha cerca de 122 dias por ano (cerca de 4 meses) apenas para pagar impostos. Em países com carga similar (como Japão e Alemanha), o salário mínimo e o retorno em serviços públicos costumam ser significativamente maiores.';

export const TAX_OVERALL_MESSAGE =
  'O brasileiro paga uma carga tributária comparável à de países desenvolvidos, mas recebe um salário mínimo muito menor e tem um retorno em serviços públicos inferior. Comparar com outros países ajuda a entender que o problema não é apenas quanto se ganha ou se gasta, mas quanto se paga de imposto e o que se recebe em troca.';
