import { Category } from './types';

export interface DefaultCategoryDef {
  name: string;
  type: 'income' | 'expense';
  icon: string;
  color: string;
  subcategories?: { name: string; icon: string }[];
}

export const DEFAULT_CATEGORIES: DefaultCategoryDef[] = [
  {
    name: 'Moradia',
    type: 'expense',
    icon: 'Home',
    color: '#0ea5e9',
    subcategories: [
      { name: 'Aluguel', icon: 'Home' },
      { name: 'Condomínio', icon: 'Building2' },
      { name: 'Energia', icon: 'Zap' },
      { name: 'Água', icon: 'Droplets' },
      { name: 'Gás', icon: 'Flame' },
      { name: 'Internet', icon: 'Wifi' },
      { name: 'Manutenção', icon: 'Wrench' },
    ],
  },
  {
    name: 'Alimentação',
    type: 'expense',
    icon: 'Utensils',
    color: '#f59e0b',
    subcategories: [
      { name: 'Mercado', icon: 'ShoppingCart' },
      { name: 'Restaurante', icon: 'Utensils' },
      { name: 'Delivery', icon: 'Bike' },
      { name: 'Padaria', icon: 'Croissant' },
      { name: 'Lanches', icon: 'Cookie' },
    ],
  },
  {
    name: 'Transporte',
    type: 'expense',
    icon: 'Car',
    color: '#8b5cf6',
    subcategories: [
      { name: 'Combustível', icon: 'Fuel' },
      { name: 'Uber', icon: 'Car' },
      { name: 'Transporte público', icon: 'Bus' },
      { name: 'Estacionamento', icon: 'CircleParking' },
      { name: 'Manutenção', icon: 'Wrench' },
      { name: 'Seguro', icon: 'ShieldCheck' },
    ],
  },
  {
    name: 'Saúde',
    type: 'expense',
    icon: 'HeartPulse',
    color: '#ef4444',
    subcategories: [
      { name: 'Farmácia', icon: 'Pill' },
      { name: 'Médico', icon: 'Stethoscope' },
      { name: 'Dentista', icon: 'Smile' },
      { name: 'Terapia', icon: 'Brain' },
      { name: 'Plano de saúde', icon: 'HeartPulse' },
    ],
  },
  {
    name: 'Educação',
    type: 'expense',
    icon: 'GraduationCap',
    color: '#3b82f6',
  },
  {
    name: 'Lazer',
    type: 'expense',
    icon: 'Gamepad2',
    color: '#ec4899',
    subcategories: [
      { name: 'Cinema', icon: 'Film' },
      { name: 'Restaurantes', icon: 'Utensils' },
      { name: 'Jogos', icon: 'Gamepad2' },
      { name: 'Viagens', icon: 'Plane' },
      { name: 'Passeios', icon: 'Trees' },
    ],
  },
  {
    name: 'Assinaturas',
    type: 'expense',
    icon: 'Repeat',
    color: '#14b8a6',
    subcategories: [
      { name: 'Streaming', icon: 'Play' },
      { name: 'Aplicativos', icon: 'Smartphone' },
      { name: 'Serviços online', icon: 'Globe' },
      { name: 'Academias', icon: 'Dumbbell' },
    ],
  },
  {
    name: 'Compras',
    type: 'expense',
    icon: 'ShoppingBag',
    color: '#f43f5e',
  },
  {
    name: 'Contas',
    type: 'expense',
    icon: 'Receipt',
    color: '#6366f1',
  },
  {
    name: 'Investimentos',
    type: 'expense',
    icon: 'TrendingUp',
    color: '#10b981',
  },
  {
    name: 'Dívidas',
    type: 'expense',
    icon: 'CreditCard',
    color: '#dc2626',
  },
  {
    name: 'Outros',
    type: 'expense',
    icon: 'Tag',
    color: '#64748b',
  },
  {
    name: 'Salário',
    type: 'income',
    icon: 'Wallet',
    color: '#10b981',
  },
  {
    name: 'Freelance',
    type: 'income',
    icon: 'Laptop',
    color: '#0ea5e9',
  },
  {
    name: 'Reembolso',
    type: 'income',
    icon: 'RotateCcw',
    color: '#14b8a6',
  },
  {
    name: 'Outras receitas',
    type: 'income',
    icon: 'Plus',
    color: '#64748b',
  },
];

/** Common category keywords used by the natural-language quick-add parser. */
export const CATEGORY_KEYWORDS: Record<string, string[]> = {
  Alimentação: ['mercado', 'supermercado', 'comida', 'padaria', 'almoço', 'jantar', 'lanche', 'pão', 'delivery', 'ifood', 'restaurante', 'refeição', 'salgado', 'café', 'croissant'],
  Transporte: ['uber', '99', 'taxi', 'combustível', 'gasolina', 'onibus', 'ônibus', 'metro', 'metrô', 'estacionamento', 'pedagio', 'pedágio', 'carro', 'aplicativo'],
  Moradia: ['aluguel', 'condomínio', 'condominio', 'energia', 'luz', 'agua', 'água', 'gas', 'gás', 'internet', 'wifi', 'net'],
  Saúde: ['farmácia', 'farmacia', 'remédio', 'remedio', 'médico', 'medico', 'dentista', 'terapia', 'plano de saúde', 'consulta'],
  Lazer: ['cinema', 'filme', 'netflix', 'jogo', 'viagem', 'passeio', 'ingresso', 'show', 'streaming'],
  Assinaturas: ['assinatura', 'spotify', 'netflix', 'youtube', 'academia', 'gym', 'plano', 'mensalidade'],
  Compras: ['compra', 'roupa', 'tenis', 'tênis', 'loja', 'shopping', 'amazon', 'mercado livre', 'produto', 'shopee'],
  Contas: ['conta', 'fatura', 'boleto', 'imposto', 'taxa', 'iptu', 'ipva'],
  Investimentos: ['investimento', 'tesouro', 'cdb', 'ação', 'acoes', 'fundo', 'etf', 'cripto', 'bitcoin', 'poupança'],
  Dívidas: ['dívida', 'divida', 'emprestimo', 'empréstimo', 'financiamento', 'parcela'],
  Educação: ['curso', 'escola', 'faculdade', 'livro', 'material', 'aula', 'mensalidade escolar'],
};
