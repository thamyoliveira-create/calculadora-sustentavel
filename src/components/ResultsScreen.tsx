import { useMemo, useState, useEffect } from "react";
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
  Scale,
} from "lucide-react";
import {
  Answers,
  CalculationResult,
  recommendations,
  simulate,
  SUSTAINABLE_CHALLENGE_TASKS,
} from "@/lib/calculations";
import { formatBRL, formatNumber } from "@/lib/format";
import {
  CategoryBarChart,
  SpendingComparisonChart,
  AccumulatedSavingsChart,
} from "./Charts";
import HowWeCalculateModal from "./HowWeCalculateModal";
import CorporateComparison from "./CorporateComparison";
import CriticalThinkingSection from "./CriticalThinkingSection";
import WorkHoursComparison from "./WorkHoursComparison";
import TaxComparison from "./TaxComparison";
import FairAverageComparison from "./FairAverageComparison";
import ShareResult from "./ShareResult";

interface ResultsScreenProps {
  answers: Answers;
  result: CalculationResult;
  onRestart: () => void;
}

const CLASSIFICATION_STYLES: Record<string, string> = {
  "alto-impacto": "text-rose-800 bg-rose-50 border-rose-200",
  transicao: "text-amber-800 bg-amber-50 border-amber-200",
  consciente: "text-teal-900 bg-teal-50 border-teal-200",
  sustentavel: "text-forest-950 bg-emerald-50 border-emerald-300",
  "muito-sustentavel": "text-forest-950 bg-emerald-100/90 border-emerald-300",
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
      const saved = localStorage.getItem("eco_challenge_completed");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("eco_challenge_completed", JSON.stringify(completedTasks));
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
    "text-forest-950 bg-emerald-50 border-emerald-300";

  function resetSimulator() {
    setEnergyPct(10);
    setSupermarketPct(5);
  }

  const navItems = [
    { id: "score", label: "Perfil", icon: <Sparkles className="h-3.5 w-3.5" /> },
    { id: "sistema", label: "Você vs. O Sistema", icon: <Scale className="h-3.5 w-3.5" /> },
    { id: "impacto", label: "Planeta", icon: <Leaf className="h-3.5 w-3.5" /> },
    { id: "desafio", label: "Desafio 7 Dias", icon: <Target className="h-3.5 w-3.5" /> },
    { id: "recomendacoes", label: "Dicas", icon: <Lightbulb className="h-3.5 w-3.5" /> },
    { id: "empresas", label: "Indústrias", icon: <Building2 className="h-3.5 w-3.5" /> },
    { id: "trabalho", label: "Trabalho", icon: <Clock className="h-3.5 w-3.5" /> },
    { id: "impostos", label: "Impostos", icon: <Globe2 className="h-3.5 w-3.5" /> },
    { id: "feira", label: "Feira", icon: <Users className="h-3.5 w-3.5" /> },
    { id: "simulador", label: "Simulador", icon: <SlidersHorizontal className="h-3.5 w-3.5" /> },
    { id: "graficos", label: "Gráficos", icon: <Calculator className="h-3.5 w-3.5" /> },
  ];

  function scrollToSection(id: string) {
    const el = document.getElementById(`section-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  const progressPct = Math.round(
    (completedTasks.length / SUSTAINABLE_CHALLENGE_TASKS.length) * 100,
  );

  return (
    <div className="bg-kraft min-h-screen text-forest-950 pb-16">
      {/* Quick nav */}
      <div className="sticky top-0 z-30 border-b border-forest-950/10 bg-[#F4E9D7]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl gap-1.5 overflow-x-auto px-4 py-2.5 scrollbar-none">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="flex flex-none items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-bold text-stone-700 transition hover:border-stone-400 hover:bg-stone-50 shadow-sm"
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 py-8 sm:py-12">
        {/* TITLE */}
        <div className="text-center">
          <span className="rounded-full bg-stone-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[.18em] text-forest-900 border border-stone-200">
            Relatório de Diagnóstico & Consciência
          </span>
          <h1 className="mt-3.5 text-3xl font-extrabold tracking-tight text-forest-950 sm:text-4xl">
            SEU PERFIL DE CONSUMO
          </h1>
        </div>

        {/* SCORE */}
        <div id="section-score" className="card mt-6 scroll-mt-20 text-center">
          <div className="relative mx-auto flex h-40 w-40 items-center justify-center">
            <ScoreRing score={result.finalScore} />
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-black text-forest-950">
                {result.finalScore}
              </span>
              <span className="text-xs font-bold text-stone-400">de 100</span>
            </div>
          </div>
          <div
            className={`mt-4 inline-flex rounded-full border px-4 py-1.5 text-xs font-extrabold uppercase tracking-[.12em] ${classStyle}`}
          >
            {classificationName(result.classification)}
          </div>
          <p className="mx-auto mt-3.5 max-w-md text-sm text-stone-600 leading-relaxed font-normal">
            {result.classificationMessage}
          </p>
        </div>

        {/* SPENDING SUMMARY */}
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <StatCard
            label="Conta de energia em 1 ano"
            value={formatBRL(result.annualEnergy)}
            icon={<Zap className="h-4 w-4 text-amber-600" />}
          />
          <StatCard
            label="Supermercado em 1 ano"
            value={formatBRL(result.annualSupermarket)}
            icon={<ShoppingCart className="h-4 w-4 text-rose-600" />}
          />
          <StatCard
            label="Deslocamento por mês"
            value={`${formatNumber(result.monthlyKm)} km`}
            icon={<SlidersHorizontal className="h-4 w-4 text-sky-600" />}
          />
        </div>

        {/* ECONOMIA DESTAQUE */}
        <div className="mt-5 rounded-2xl bg-forest-950 p-6 text-center text-white sm:p-8 shadow-sm border border-forest-800/40">
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[.2em] text-gold-300">
            Economia Anual Estimada com Mudança de Hábitos
          </p>
          <p className="mt-2 text-4xl font-extrabold sm:text-5xl text-white">
            {formatBRL(result.annualSavingsDefault)}
          </p>
          <p className="mt-2 text-xs font-medium text-gold-100">
            Em 5 anos acumulados: <span className="font-bold text-white">{formatBRL(result.fiveYearSavingsDefault)}</span>
          </p>
          <p className="mx-auto mt-3.5 max-w-md text-[11px] leading-relaxed text-emerald-100/70 border-t border-forest-800/80 pt-3">
            Valores projetados para fins de aprendizagem e reflexão em feira escolar.
          </p>
        </div>

        {/* CRITICAL THINKING & SYSTEM MODULE */}
        <CriticalThinkingSection result={result} />

        {/* ECOLOGICAL IMPACT CARD */}
        <div id="section-impacto" className="card mt-6 scroll-mt-20 border-forest-900/15 bg-forest-50/30">
          <div className="flex items-center gap-2 text-forest-950">
            <Leaf className="h-5 w-5 text-forest-950" />
            <h2 className="text-lg font-bold">Seu Impacto Positivo no Planeta</h2>
          </div>
          <p className="mt-1 text-xs text-stone-600">
            Ao evitar desperdícios na rotina, você reduz emissões e preserva recursos:
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3.5 rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
              <div className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-forest-50 text-forest-950 border border-forest-900/10">
                <Leaf className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-stone-500">Emissões de CO₂ evitadas</p>
                <p className="text-xl font-black text-forest-950">
                  ~{formatNumber(result.annualCo2Kg)} kg <span className="text-xs font-normal text-stone-500">/ano</span>
                </p>
                <p className="text-[10px] text-stone-400">Menos poluição gerada na matriz elétrica e aterros</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
              <div className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-teal-50 text-teal-900 border border-teal-900/10">
                <Trees className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-stone-500">Equivalente em árvores</p>
                <p className="text-xl font-black text-teal-900">
                  ~{result.treesEquivalent} {result.treesEquivalent === 1 ? "árvore" : "árvores"} <span className="text-xs font-normal text-stone-500">poupadas</span>
                </p>
                <p className="text-[10px] text-stone-400">Capacidade de absorção florestal preservada</p>
              </div>
            </div>
          </div>
        </div>

        {/* 7-DAY CHALLENGE */}
        <section id="section-desafio" className="card mt-6 scroll-mt-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-forest-950">
              <Target className="h-5 w-5 text-forest-950" />
              <h2 className="text-lg font-bold">Desafio 7 Dias: Hábitos Sustentáveis</h2>
            </div>
            {completedTasks.length === SUSTAINABLE_CHALLENGE_TASKS.length && (
              <span className="flex items-center gap-1 rounded-full bg-gold-100 border border-gold-300 px-2.5 py-0.5 text-xs font-bold text-forest-950">
                <Trophy className="h-3.5 w-3.5 text-gold-500" /> Concluído!
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-stone-500">
            Pequenas atitudes diárias que geram economia e transformam a rotina:
          </p>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs font-bold text-stone-600">
              <span>Progresso</span>
              <span>{completedTasks.length} de {SUSTAINABLE_CHALLENGE_TASKS.length} ({progressPct}%)</span>
            </div>
            <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-stone-100 border border-stone-200">
              <div
                className="h-full bg-forest-950 transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {SUSTAINABLE_CHALLENGE_TASKS.map((task) => {
              const isDone = completedTasks.includes(task.id);
              return (
                <button
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition ${
                    isDone
                      ? "border-forest-900/30 bg-forest-50/70 text-forest-950"
                      : "border-stone-200 bg-white hover:bg-stone-50 text-stone-800"
                  }`}
                >
                  <div className="mt-0.5 flex-none">
                    {isDone ? (
                      <CheckCircle2 className="h-4 w-4 text-forest-950" />
                    ) : (
                      <Circle className="h-4 w-4 text-stone-300" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-stone-100 border border-stone-200 px-2 py-0.5 text-[10px] font-bold text-stone-600">
                        Dia {task.day}
                      </span>
                      <span className={`text-xs sm:text-sm font-bold ${isDone ? "line-through text-forest-900" : ""}`}>
                        {task.title}
                      </span>
                    </div>
                    <p className={`mt-0.5 text-xs ${isDone ? "text-forest-800" : "text-stone-500"}`}>
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
          <div className="flex items-center gap-2 text-forest-950">
            <Lightbulb className="h-5 w-5 text-amber-600" />
            <h2 className="text-lg font-bold">Dicas Práticas para o seu Perfil</h2>
          </div>
          {recs.length > 0 ? (
            <ul className="mt-3 space-y-2.5">
              {recs.map((r, i) => (
                <li
                  key={i}
                  className="flex gap-3 rounded-xl border border-amber-200/80 bg-amber-50/50 p-3.5 text-xs sm:text-sm text-stone-700"
                >
                  <span className="flex h-5 w-5 flex-none items-center justify-center rounded-md bg-amber-600 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-xs text-stone-500">
              Você já pratica a maioria dos hábitos sustentáveis. Parabéns!
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
          <div className="flex items-center gap-2 text-forest-950">
            <SlidersHorizontal className="h-5 w-5 text-forest-950" />
            <h2 className="text-lg font-bold">
              Simulador de Redução de Gastos
            </h2>
          </div>
          <p className="mt-1 text-xs text-stone-500">
            Arraste os controles para simular economia de dinheiro e impacto ambiental:
          </p>

          <div className="mt-5 space-y-5">
            <Slider
              icon={<Zap className="h-4 w-4 text-amber-600" />}
              label="Redução na conta de energia"
              value={energyPct}
              onChange={setEnergyPct}
            />
            <Slider
              icon={<ShoppingCart className="h-4 w-4 text-rose-600" />}
              label="Redução no desperdício de alimentos/mercado"
              value={supermarketPct}
              onChange={setSupermarketPct}
            />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <SimStat label="Economia mensal" value={formatBRL(sim.monthlySavings)} />
            <SimStat label="Economia anual" value={formatBRL(sim.annualSavings)} highlight />
            <SimStat label="CO₂ poupado/ano" value={`~${sim.annualCo2Saved} kg`} />
            <SimStat label="Árvores/ano" value={`~${sim.treesSaved} árvores`} />
          </div>

          <button
            onClick={resetSimulator}
            className="btn-secondary mt-5 mx-auto flex text-xs"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Restaurar Valores Padrão
          </button>
        </section>

        {/* CHARTS */}
        <section id="section-graficos" className="card mt-6 scroll-mt-20">
          <div className="flex items-center gap-2 text-forest-950">
            <Sparkles className="h-5 w-5 text-forest-950" />
            <h2 className="text-lg font-bold">Seu perfil por categoria</h2>
          </div>
          <div className="mt-4">
            <CategoryBarChart result={result} />
          </div>
        </section>

        <section className="card mt-6">
          <h2 className="text-lg font-bold text-forest-950">
            Gastos anuais: atual vs. com redução
          </h2>
          <div className="mt-4">
            <SpendingComparisonChart
              annualEnergy={result.annualEnergy}
              annualSupermarket={result.annualSupermarket}
              reducedEnergy={sim.annualEnergyReduced}
              reducedSupermarket={sim.annualSupermarketReduced}
            />
          </div>
        </section>

        <section className="card mt-6">
          <h2 className="text-lg font-bold text-forest-950">
            Economia acumulada em 5 anos
          </h2>
          <p className="mt-1 text-xs text-stone-500">
            Economia anual simulada: {formatBRL(sim.annualSavings)}
          </p>
          <div className="mt-4">
            <AccumulatedSavingsChart annualSavings={sim.annualSavings} />
          </div>
        </section>

        {/* HOW WE CALCULATE + SHARE */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ShareResult result={result} />
          <button onClick={() => setShowHowTo(true)} className="btn-secondary">
            <Calculator className="h-4 w-4 text-stone-600" />
            Como calculamos?
          </button>
        </div>

        {/* RESTART */}
        <div className="mt-8 flex flex-col items-center gap-4">
          <button onClick={onRestart} className="btn-primary">
            <RotateCcw className="h-4 w-4" />
            Fazer Novamente com Outra Pessoa
          </button>
        </div>

        {/* ASSINATURA */}
        <p className="mt-10 text-center text-[11px] font-semibold uppercase tracking-[.12em] text-forest-950/50">
          Criado por Prof.ª Tamiris
        </p>
      </div>

      {showHowTo && <HowWeCalculateModal onClose={() => setShowHowTo(false)} />}
    </div>
  );
}

function classificationName(c: string): string {
  switch (c) {
    case "alto-impacto":
      return "Consumo de alto impacto";
    case "transicao":
      return "Consumo em transição";
    case "consciente":
      return "Consumo consciente";
    case "sustentavel":
      return "Consumo sustentável";
    case "muito-sustentavel":
      return "Consumo muito sustentável";
    default:
      return "";
  }
}

function ScoreRing({ score }: { score: number }) {
  const radius = 64;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;
  return (
    <svg className="h-36 w-36 -rotate-90" viewBox="0 0 160 160">
      <circle
        cx="80"
        cy="80"
        r={radius}
        fill="none"
        stroke="#E7E5E4"
        strokeWidth="9"
      />
      <circle
        cx="80"
        cy="80"
        r={radius}
        fill="none"
        stroke="#032820"
        strokeWidth="9"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
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
    <div className="card flex flex-col justify-between gap-2 !p-4">
      <div className="flex items-center gap-2 text-stone-500">
        {icon}
        <span className="text-xs font-semibold leading-tight">{label}</span>
      </div>
      <span className="text-lg font-black text-forest-950">{value}</span>
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
        <span className="flex items-center gap-2 text-xs sm:text-sm font-bold text-forest-950">
          {icon}
          {label}
        </span>
        <span className="rounded-full bg-forest-50 border border-forest-900/15 px-2.5 py-0.5 text-xs font-black text-forest-950">
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
      className={`rounded-xl p-3 text-center border ${
        highlight
          ? "bg-forest-950 text-white border-forest-800"
          : "bg-stone-50 text-forest-950 border-stone-200"
      }`}
    >
      <p
        className={`text-[10px] font-bold uppercase tracking-[.15em] ${
          highlight ? "text-gold-300" : "text-stone-500"
        }`}
      >
        {label}
      </p>
      <p className="mt-1 text-sm sm:text-base font-black">{value}</p>
    </div>
  );
}
