import { useEffect, useState } from 'react';
import { Users, TrendingUp, TrendingDown, Minus, Loader2 } from 'lucide-react';
import { FairAverage, fetchFairAverage } from '@/lib/fairData';
import { CalculationResult } from '@/lib/calculations';
import { CATEGORY_LABELS, CategoryId } from '@/lib/questions';
import { formatBRL, formatNumber } from '@/lib/format';

interface FairAverageComparisonProps {
  result: CalculationResult;
}

export default function FairAverageComparison({
  result,
}: FairAverageComparisonProps) {
  const [avg, setAvg] = useState<FairAverage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchFairAverage()
      .then((data) => {
        if (!cancelled) setAvg(data);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <section className="card mt-6">
        <div className="flex items-center gap-2 text-slate-900">
          <Users className="h-5 w-5 text-emerald-600" />
          <h2 className="text-lg font-bold">Você vs. a feira</h2>
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          Carregando média dos participantes...
        </div>
      </section>
    );
  }

  if (error || !avg || avg.totalParticipants === 0) {
    return (
      <section className="card mt-6">
        <div className="flex items-center gap-2 text-slate-900">
          <Users className="h-5 w-5 text-emerald-600" />
          <h2 className="text-lg font-bold">Você vs. a feira</h2>
        </div>
        <p className="mt-4 text-sm text-slate-500">
          {error
            ? 'Não foi possível carregar a média dos participantes no momento.'
            : 'Ainda não há participantes suficientes para comparar. Volde depois para ver como você se compara com a média da feira!'}
        </p>
      </section>
    );
  }

  const scoreDiff = result.finalScore - avg.averageScore;
  const savingsDiff = result.annualSavingsDefault - avg.averageSavings;
  const energyDiff = result.annualEnergy - avg.averageEnergy;
  const supermarketDiff = result.annualSupermarket - avg.averageSupermarket;

  const cats = Object.keys(CATEGORY_LABELS) as CategoryId[];

  return (
    <section className="card mt-6">
      <div className="flex items-center gap-2 text-forest-950">
        <Users className="h-5 w-5 text-forest-950" />
        <h2 className="text-lg font-bold">Você vs. a feira</h2>
      </div>
      <p className="mt-1 text-sm text-slate-500">
        Comparação com a média de{' '}
        <span className="font-bold text-slate-700">
          {formatNumber(avg.totalParticipants)}
        </span>{' '}
        participantes até agora.
      </p>

      {/* Overall comparison */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <CompareCard
          label="Sua pontuação"
          yourValue={`${result.finalScore}/100`}
          avgValue={`${formatNumber(avg.averageScore, 1)}/100`}
          diff={scoreDiff}
          diffSuffix="pts"
          higherIsBetter
        />
        <CompareCard
          label="Economia anual"
          yourValue={formatBRL(result.annualSavingsDefault)}
          avgValue={formatBRL(avg.averageSavings)}
          diff={savingsDiff}
          higherIsBetter
        />
        <CompareCard
          label="Gasto anual com energia"
          yourValue={formatBRL(result.annualEnergy)}
          avgValue={formatBRL(avg.averageEnergy)}
          diff={energyDiff}
          higherIsBetter={false}
        />
        <CompareCard
          label="Gasto anual com supermercado"
          yourValue={formatBRL(result.annualSupermarket)}
          avgValue={formatBRL(avg.averageSupermarket)}
          diff={supermarketDiff}
          higherIsBetter={false}
        />
      </div>

      {/* Category-by-category comparison */}
      <div className="mt-6">
        <h3 className="text-sm font-bold text-slate-700">
          Por categoria (sua pontuação vs. média da feira)
        </h3>
        <div className="mt-3 space-y-3">
          {cats.map((cat) => {
            const yourPct = result.categoryScores[cat]?.percent ?? 0;
            const avgPct = avg.averageCategoryScores[cat] ?? 0;
            const diff = yourPct - avgPct;
            return (
              <CategoryCompareBar
                key={cat}
                label={CATEGORY_LABELS[cat]}
                yourPct={yourPct}
                avgPct={avgPct}
                diff={diff}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CompareCard({
  label,
  yourValue,
  avgValue,
  diff,
  diffSuffix,
  higherIsBetter,
}: {
  label: string;
  yourValue: string;
  avgValue: string;
  diff: number;
  diffSuffix?: string;
  higherIsBetter: boolean;
}) {
  const isBetter =
    higherIsBetter ? diff > 0 : diff < 0;
  const isWorse =
    higherIsBetter ? diff < 0 : diff > 0;
  const isSame = Math.abs(diff) < 0.01;

  const Icon = isSame ? Minus : isBetter ? TrendingUp : TrendingDown;
  const colorClass = isSame
    ? 'text-slate-400 bg-slate-50'
    : isBetter
      ? 'text-emerald-600 bg-emerald-50'
      : 'text-rose-600 bg-rose-50';

  const sign = diff > 0 ? '+' : '';
  const diffStr = diffSuffix
    ? `${sign}${formatNumber(diff, 1)} ${diffSuffix}`
    : `${sign}${formatBRL(diff)}`;

  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/40 p-4">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <div className="mt-2 flex items-baseline justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-slate-400">Você</p>
          <p className="text-lg font-bold text-slate-900">{yourValue}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wide text-slate-400">Média da feira</p>
          <p className="text-sm font-semibold text-slate-600">{avgValue}</p>
        </div>
      </div>
      <div
        className={`mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${colorClass}`}
      >
        <Icon className="h-3 w-3" />
        {isSame ? 'Na média' : diffStr}
      </div>
    </div>
  );
}

function CategoryCompareBar({
  label,
  yourPct,
  avgPct,
  diff,
}: {
  label: string;
  yourPct: number;
  avgPct: number;
  diff: number;
}) {
  const isBetter = diff > 0;
  const isSame = Math.abs(diff) < 0.5;

  return (
    <div className="rounded-xl bg-slate-50/60 p-3">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-semibold text-slate-700">{label}</span>
        <span
          className={`text-xs font-bold ${
            isSame
              ? 'text-slate-400'
              : isBetter
                ? 'text-emerald-600'
                : 'text-rose-600'
          }`}
        >
          {isSame
            ? 'Na média'
            : `${isBetter ? '+' : ''}${formatNumber(diff, 1)}pts`}
        </span>
      </div>
      <div className="space-y-1.5">
        <BarRow label="Você" pct={yourPct} color="bg-emerald-500" />
        <BarRow label="Média" pct={avgPct} color="bg-slate-400" />
      </div>
    </div>
  );
}

function BarRow({
  label,
  pct,
  color,
}: {
  label: string;
  pct: number;
  color: string;
}) {
  const p = Math.max(0, Math.min(100, pct));
  return (
    <div className="flex items-center gap-2">
      <span className="w-12 flex-none text-[10px] text-slate-400">{label}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${p}%` }}
        />
      </div>
      <span className="w-8 flex-none text-right text-[10px] font-bold text-slate-600">
        {Math.round(p)}%
      </span>
    </div>
  );
}
