import { useMemo, useState, useEffect } from 'react';
import {
  RotateCcw,
  Lightbulb,
  Calculator,
  SlidersHorizontal,
  Zap,
  ShoppingCart,
  Sparkles,
  Building2,
  Clock,
  Globe2,
  Users,
  Leaf,
  Trees,
  CheckCircle2,
  Circle,
  Trophy,
  Target,
} from 'lucide-react';
import {
  Answers,
  CalculationResult,
  recommendations,
  simulate,
  SUSTAINABLE_CHALLENGE_TASKS,
} from '@/lib/calculations';
import { formatBRL, formatNumber } from '@/lib/format';
import {
  CategoryBarChart,
  SpendingComparisonChart,
  AccumulatedSavingsChart,
} from './Charts';
import HowWeCalculateModal from './HowWeCalculateModal';
import CorporateComparison from './CorporateComparison';
import WorkHoursComparison from './WorkHoursComparison';
import TaxComparison from './TaxComparison';
import FairAverageComparison from './FairAverageComparison';
import ShareResult from './ShareResult';

interface ResultsScreenProps {
  answers: Answers;
  result: CalculationResult;
  onRestart: () => void;
}

const CLASSIFICATION_STYLES: Record<string, string> = {
  'alto-impacto': 'text-rose-600 bg-rose-50 border-rose-100',
  transicao: 'text-amber-600 bg-amber-50 border-amber-100',
  consciente: 'text-teal-600 bg-teal-50 border-teal-100',
  sustentavel: 'text-emerald-600 bg-emerald-50 border-emerald-100',
  'muito-sustentavel': 'text-emerald-700 bg-emerald-100 border-emerald-200',
};

export default function ResultsScreen({
  answers,
  result,
  onRestart,
}: ResultsScreenProps) {
  const [energyPct, setEnergyPct] = useState(10);
  const [supermarketPct, setSupermarketPct] = useState(5);
  const [showHowTo, setShowHowTo] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('eco_challenge_completed');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('eco_challenge_completed', JSON.stringify(completedTasks));
    } catch {
      // Ignore localStorage errors
    }
  }, [completedTasks]);

  function toggleTask(id: string) {
    setCompletedTasks((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  }

  const sim = useMemo(
    () => simulate(answers, energyPct, supermarketPct),
    [answers, energyPct, supermarketPct],
  );

  const recs = useMemo(() => recommendations(answers, 3), [answers]);

  const classStyle =
    CLASSIFICATION_STYLES[result.classification] ??
    'text-emerald-600 bg-emerald-50 border-emerald-100';

  function resetSimulator() {
    setEnergyPct(10);
    setSupermarketPct(5);
  }

  const navItems = [
    { id: 'score', label: 'Perfil', icon: <Sparkles className="h-3.5 w-3.5" /> },
    { id: 'impacto', label: 'Planeta', icon: <Leaf className="h-3.5 w-3.5" /> },
    { id: 'desafio', label: 'Desafio', icon: <Target className="h-3.5 w-3.5" /> },
    { id: 'recomendacoes', label: 'Dicas', icon: <Lightbulb className="h-3.5 w-3.5" /> },
    { id: 'empresas', label: 'Empresas', icon: <Building2 className="h-3.5 w-3.5" /> },
    { id: 'trabalho', label: 'Trabalho', icon: <Clock className="h-3.5 w-3.5" /> },
    { id: 'impostos', label: 'Impostos', icon: <Globe2 className="h-3.5 w-3.5" /> },
    { id: 'feira', label: 'Feira', icon: <Users className="h-3.5 w-3.5" /> },
    { id: 'simulador', label: 'Simulador', icon: <SlidersHorizontal className="h-3.5 w-3.5" /> },
    { id: 'graficos', label: 'Gráficos', icon: <Calculator className="h-3.5 w-3.5" /> },
  ];

  function scrollToSection(id: string) {
    const el = document.getElementById(`section-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  const progressPct = Math.round(
    (completedTasks.length / SUSTAINABLE_CHALLENGE_TASKS.length) * 100,
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-white to-white">
      {/* Quick nav */}
      <div className="sticky top-0 z-30 border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl gap-1 overflow-x-auto px-3 py-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="flex flex-none items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-700"
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
        {/* TITLE */}
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
            Resultado
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            SEU PERFIL DE CONSUMO
          </h1>
        </div>

        {/* SCORE */}
        <div id="section-score" className="card mt-8 scroll-mt-20 text-center">
          <div className="relative mx-auto flex h-44 w-44 items-center justify-center">
            <ScoreRing score={result.finalScore} />
            <div className="absolute flex flex-col items-center">
              <span className="text-5xl font-extrabold text-slate-900">
                {result.finalScore}
              </span>
              <span className="text-sm font-medium text-slate-400">/ 100</span>
            </div>
          </div>
          <div
            className={`mt-5 inline-flex rounded-full border px-5 py-2 text-sm font-bold ${classStyle}`}
          >
            {classificationName(result.classification)}
          </div>
          <p className="mx-auto mt-4 max-w-md text-base text-slate-600">
            {result.classificationMessage}
          </p>
        </div>

        {/* SPENDING SUMMARY */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Gasto com energia em 1 ano"
            value={formatBRL(result.annualEnergy)}
            icon={<Zap className="h-5 w-5 text-amber-500" />}
          />
          <StatCard
            label="Gasto com supermercado em 1 ano"
            value={formatBRL(result.annualSupermarket)}
            icon={<ShoppingCart className="h-5 w-5 text-rose-500" />}
          />
          <StatCard
            label="Deslocamento por mês"
            value={`${formatNumber(result.monthlyKm)} km`}
            icon={<SlidersHorizontal className="h-5 w-5 text-sky-500" />}
          />
        </div>

        {/* ECONOMIA DESTAQUE */}
        <div className="mt-6 overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-600 p-1 shadow-xl shadow-emerald-600/20">
          <div className="rounded-[22px] bg-gradient-to-br from-emerald-600 to-teal-600 px-6 py-8 text-center text-white sm:px-10">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-100">
              Economia anual possível
            </p>
            <p className="mt-2 text-4xl font-extrabold sm:text-5xl">
              {formatBRL(result.annualSavingsDefault)}
            </p>
            <p className="mt-3 text-sm text-emerald-100">
              Em 5 anos: <span className="font-bold text-white">{formatBRL(result.fiveYearSavingsDefault)}</span>
            </p>
            <p className="mx-auto mt-4 max-w-md text-[11px] leading-relaxed text-emerald-100/80">
              Os valores apresentados são simulações educativas baseadas nas
              respostas fornecidas e não representam uma previsão exata.
            </p>
          </div>
        </div>

        {/* ECOLOGICAL IMPACT CARD */}
        <div id="section-impacto" className="card mt-6 scroll-mt-20 border-emerald-100 bg-gradient-to-br from-emerald-50/60 via-white to-teal-50/40">
          <div className="flex items-center gap-2 text-slate-900">
            <Leaf className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-bold">Seu Impacto Positivo no Planeta</h2>
          </div>
          <p className="mt-1 text-sm text-slate-600">
            Ao reduzir desperdícios e otimizar energia e compras, você gera um benefício ambiental direto:
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-4 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
              <div className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <Leaf className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Emissões de CO₂ evitadas</p>
                <p className="text-2xl font-black text-emerald-700">
                  ~{formatNumber(result.annualCo2Kg)} kg <span className="text-sm font-semibold text-slate-500">/ano</span>
                </p>
                <p className="text-[11px] text-slate-400">Menos poluição gerada na matriz elétrica e aterros</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
              <div className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
                <Trees className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Equivalente em árvores</p>
                <p className="text-2xl font-black text-teal-700">
                  ~{result.treesEquivalent} {result.treesEquivalent === 1 ? 'árvore' : 'árvores'} <span className="text-sm font-semibold text-slate-500">poupadas</span>
                </p>
                <p className="text-[11px] text-slate-400">Capacidade de absorção de carbono preservada</p>
              </div>
            </div>
          </div>
        </div>

        {/* 7-DAY CHALLENGE */}
        <section id="section-desafio" className="card mt-6 scroll-mt-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-900">
              <Target className="h-5 w-5 text-emerald-600" />
              <h2 className="text-lg font-bold">Desafio 7 Dias: Hábitos Sustentáveis</h2>
            </div>
            {completedTasks.length === SUSTAINABLE_CHALLENGE_TASKS.length && (
              <span className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                <Trophy className="h-3.5 w-3.5" /> Campeão!
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Pequenas atitudes diárias que transformam seu bolso e o meio ambiente. Marque o que for realizando:
          </p>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs font-semibold text-slate-600">
              <span>Progresso do Desafio</span>
              <span>{completedTasks.length} de {SUSTAINABLE_CHALLENGE_TASKS.length} ({progressPct}%)</span>
            </div>
            <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          <div className="mt-5 space-y-2.5">
            {SUSTAINABLE_CHALLENGE_TASKS.map((task) => {
              const isDone = completedTasks.includes(task.id);
              return (
                <button
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`flex w-full items-start gap-3 rounded-2xl border p-3.5 text-left transition ${
                    isDone
                      ? 'border-emerald-200 bg-emerald-50/70 text-emerald-950'
                      : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div className="mt-0.5 flex-none">
                    {isDone ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <Circle className="h-5 w-5 text-slate-300" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-white px-2 py-0.5 text-[11px] font-bold text-slate-600 shadow-sm">
                        Dia {task.day}
                      </span>
                      <span className={`text-sm font-bold ${isDone ? 'line-through text-emerald-800' : ''}`}>
                        {task.title}
                      </span>
                    </div>
                    <p className={`mt-1 text-xs ${isDone ? 'text-emerald-700' : 'text-slate-500'}`}>
                      {task.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* RECOMMENDATIONS */}
        <section id="section-recomendacoes" className="card mt-6 scroll-mt-20">
          <div className="flex items-center gap-2 text-slate-900">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            <h2 className="text-lg font-bold">O que você poderia testar?</h2>
          </div>
          {recs.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {recs.map((r, i) => (
                <li
                  key={i}
                  className="flex gap-3 rounded-2xl bg-amber-50/60 p-4 text-sm text-slate-700"
                >
                  <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-slate-500">
              Você já pratica a maioria dos hábitos sustentáveis. Continue
              assim!
            </p>
          )}
        </section>

        {/* CORPORATE COMPARISON */}
        <div id="section-empresas" className="scroll-mt-20">
          <CorporateComparison />
        </div>

        {/* WORK HOURS */}
        <div id="section-trabalho" className="scroll-mt-20">
          <WorkHoursComparison
            annualEnergy={result.annualEnergy}
            annualSupermarket={result.annualSupermarket}
            annualSavings={result.annualSavingsDefault}
          />
        </div>

        {/* TAX COMPARISON */}
        <div id="section-impostos" className="scroll-mt-20">
          <TaxComparison />
        </div>

        {/* FAIR AVERAGE COMPARISON */}
        <div id="section-feira" className="scroll-mt-20">
          <FairAverageComparison result={result} />
        </div>

        {/* SIMULATOR */}
        <section id="section-simulador" className="card mt-6 scroll-mt-20">
          <div className="flex items-center gap-2 text-slate-900">
            <SlidersHorizontal className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-bold">
              E se você mudasse alguns hábitos?
            </h2>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Arraste os controles e veja como pequenas mudanças geram economia e poupam o planeta.
          </p>

          <div className="mt-6 space-y-6">
            <Slider
              icon={<Zap className="h-4 w-4 text-amber-500" />}
              label="Redução no gasto de energia"
              value={energyPct}
              onChange={setEnergyPct}
            />
            <Slider
              icon={<ShoppingCart className="h-4 w-4 text-rose-500" />}
              label="Redução no gasto com supermercado / desperdícios"
              value={supermarketPct}
              onChange={setSupermarketPct}
            />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <SimStat label="Economia mensal" value={formatBRL(sim.monthlySavings)} />
            <SimStat label="Economia anual" value={formatBRL(sim.annualSavings)} highlight />
            <SimStat label="CO₂ poupado/ano" value={`~${sim.annualCo2Saved} kg`} />
            <SimStat label="Árvores/ano" value={`~${sim.treesSaved} árvores`} />
          </div>

          <button
            onClick={resetSimulator}
            className="btn-secondary mt-6 mx-auto flex"
          >
            <RotateCcw className="h-4 w-4" />
            Restaurar cenário inicial
          </button>
        </section>

        {/* CHARTS */}
        <section id="section-graficos" className="card mt-6 scroll-mt-20">
          <div className="flex items-center gap-2 text-slate-900">
            <Sparkles className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-bold">Seu perfil por categoria</h2>
          </div>
          <div className="mt-5">
            <CategoryBarChart result={result} />
          </div>
        </section>

        <section className="card mt-6">
          <h2 className="text-lg font-bold text-slate-900">
            Gastos anuais: atual vs. com redução
          </h2>
          <div className="mt-5">
            <SpendingComparisonChart
              annualEnergy={result.annualEnergy}
              annualSupermarket={result.annualSupermarket}
              reducedEnergy={sim.annualEnergyReduced}
              reducedSupermarket={sim.annualSupermarketReduced}
            />
          </div>
        </section>

        <section className="card mt-6">
          <h2 className="text-lg font-bold text-slate-900">
            Economia acumulada em 5 anos
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Economia anual atual: {formatBRL(sim.annualSavings)}
          </p>
          <div className="mt-5">
            <AccumulatedSavingsChart annualSavings={sim.annualSavings} />
          </div>
        </section>

        {/* HOW WE CALCULATE + SHARE */}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <ShareResult result={result} />
          <button onClick={() => setShowHowTo(true)} className="btn-secondary">
            <Calculator className="h-4 w-4" />
            Como calculamos?
          </button>
        </div>

        {/* RESTART */}
        <div className="mt-10 flex flex-col items-center gap-4 pb-6">
          <button onClick={onRestart} className="btn-primary">
            <RotateCcw className="h-4 w-4" />
            Desafie outra pessoa — fazer novamente
          </button>
        </div>
      </div>

      {showHowTo && <HowWeCalculateModal onClose={() => setShowHowTo(false)} />}

    </div>
  );
}

function classificationName(c: string): string {
  switch (c) {
    case 'alto-impacto':
      return 'Consumo de alto impacto';
    case 'transicao':
      return 'Consumo em transição';
    case 'consciente':
      return 'Consumo consciente';
    case 'sustentavel':
      return 'Consumo sustentável';
    case 'muito-sustentavel':
      return 'Consumo muito sustentável';
    default:
      return '';
  }
}

function ScoreRing({ score }: { score: number }) {
  const radius = 70;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;
  return (
    <svg className="h-44 w-44 -rotate-90" viewBox="0 0 160 160">
      <circle
        cx="80"
        cy="80"
        r={radius}
        fill="none"
        stroke="#e2e8f0"
        strokeWidth="12"
      />
      <circle
        cx="80"
        cy="80"
        r={radius}
        fill="none"
        stroke="#059669"
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 1s ease-out' }}
      />
    </svg>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="card flex flex-col gap-2 !p-5">
      <div className="flex items-center gap-2 text-slate-500">
        {icon}
        <span className="text-xs font-medium leading-tight">{label}</span>
      </div>
      <span className="text-xl font-bold text-slate-900">{value}</span>
    </div>
  );
}

function Slider({
  icon,
  label,
  value,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          {icon}
          {label}
        </span>
        <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-sm font-bold text-emerald-700">
          {value}%
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={30}
        step={1}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="eco-range"
      />
    </div>
  );
}

function SimStat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-3 text-center ${
        highlight ? 'bg-emerald-600 text-white' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <p
        className={`text-[11px] font-medium ${
          highlight ? 'text-emerald-100' : 'text-slate-500'
        }`}
      >
        {label}
      </p>
      <p className="mt-1 text-base font-bold">{value}</p>
    </div>
  );
}

