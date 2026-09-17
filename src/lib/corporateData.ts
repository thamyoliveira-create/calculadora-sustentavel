/**
 * Dados de referência educativos sobre consumo de grandes empresas e indústria
 * no Brasil. Valores aproximados baseados em médias públicas de relatórios de
 * sustentabilidade e dados estatísticos. O objetivo é contextualizar o consumo
 * individual frente ao consumo corporativo/industrial.
 *
 * Estes números são estimativas educativas para fins de comparação em feira
 * escolar — não representam valores exatos de uma empresa específica.
 */

export interface CorporateReference {
  category: string;
  icon: string;
  /** O que o indivíduo consome em média (unidade/ano) */
  individualAverage: string;
  /** O que uma grande empresa/indústria consome em média (unidade/ano) */
  corporateAverage: string;
  /** Razão aproximada corporativo/individual */
  ratioLabel: string;
  /** Explicação curta */
  explanation: string;
  /** Fonte educativa */
  source: string;
}

export const CORPORATE_REFERENCES: CorporateReference[] = [
  {
    category: 'Energia elétrica',
    icon: 'Zap',
    individualAverage: '~1.500 kWh/mês por residência',
    corporateAverage: 'Uma única indústria de grande porte pode consumir 5 a 50 GWh/mês',
    ratioLabel: '~3.000 a 33.000x mais',
    explanation:
      'O consumo mensal de uma única fábrica de grande porte equivale ao consumo de milhares de residências. A eficiência energética industrial tem impacto muito maior que ações individuais.',
    source: 'EPE — Empresa de Pesquisa Energética, Anuário Estatístico de Energia Elétrica; ANEEL, dados de consumo por classe.',
  },
  {
    category: 'Água',
    icon: 'Droplets',
    individualAverage: '~150 litros/dia por pessoa',
    corporateAverage: 'Uma indústria pode usar de 1 a 10 milhões de litros/dia',
    ratioLabel: '~7.000 a 66.000x mais',
    explanation:
      'O consumo diário de uma indústria de médio porte equivale ao consumo de dezenas de milhares de pessoas. O reúso industrial tem potencial de economia muito superior ao residencial.',
    source: 'ANA — Agência Nacional de Águas e Saneamento Básico, Conjuntura dos Recursos Hídricos no Brasil (uso industrial).',
  },
  {
    category: 'Resíduos sólidos',
    icon: 'Recycle',
    individualAverage: '~1 kg/dia por pessoa',
    corporateAverage: 'Uma indústria pode gerar de 5 a 100 toneladas/dia',
    ratioLabel: '~5.000 a 100.000x mais',
    explanation:
      'A maior parte dos resíduos industriais vem de processos produtivos, não do descarte individual. A logística reversa e a redução na fonte corporativa têm impacto dominante.',
    source: 'ABRELPE, Panorama dos Resíduos Sólidos no Brasil (resíduos urbanos x industriais).',
  },
  {
    category: 'Emissões de CO₂',
    icon: 'Factory',
    individualAverage: '~1,8 toneladas/ano por brasileiro',
    corporateAverage: 'Uma empresa de grande porte pode emitir de 50 a 500 mil toneladas/ano',
    ratioLabel: '~28.000 a 278.000x mais',
    explanation:
      'Cerca de 70% das emissões globais de gases de efeito estufa vêm de atividades industriais e de energia em larga escala, não de ações individuais.',
    source: 'SEEG — Sistema de Estimativa de Emissões de Gases de Efeito Estufa (Observatório do Clima); IPCC, Sixth Assessment Report.',
  },
  {
    category: 'Desperdício de alimentos',
    icon: 'Apple',
    individualAverage: '~120 kg/ano por pessoa',
    corporateAverage: 'A cadeia agroindustrial desperdiça ~30% da produção',
    ratioLabel: 'Perda em escala de milhões de toneladas',
    explanation:
      'Grande parte do desperdício alimentar acontece na produção, transporte e armazenagem industrial — não apenas no consumidor final. A melhoria logística das empresas tem impacto massivo.',
    source: 'FAO, The State of Food and Agriculture (Food Loss and Waste); Embrapa, estudos sobre perdas na cadeia agroindustrial.',
  },
  {
    category: 'Plástico',
    icon: 'Package',
    individualAverage: '~40 kg/ano por pessoa',
    corporateAverage: 'Empresas produzem ~400 milhões de toneladas/ano globalmente',
    ratioLabel: 'Produção em escala global',
    explanation:
      'A produção de plástico é quase totalmente corporativa. A redução de embalagens na fonte e o design sustentável das empresas têm impacto muito maior que o descarte individual.',
    source: 'OCDE, Global Plastics Outlook; Geyer, Jambeck & Law (2017), "Production, use, and fate of all plastics ever made", Science Advances.',
  },
];

export const CORPORATE_OVERALL_MESSAGE =
  'As mudanças individuais importam e criam consciência, mas o volume de consumo e desperdício das grandes empresas e da indústria é proporcionalmente muito maior. Cobrar práticas sustentáveis das empresas — eficiência energética, reúso de água, redução de embalagens e logística reversa — tem potencial de impacto muito superior ao das ações individuais isoladas. A responsabilidade é compartilhada.';
