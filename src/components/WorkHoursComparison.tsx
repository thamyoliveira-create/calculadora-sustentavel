import { useState } from 'react';
import { Clock, Briefcase, Info } from 'lucide-react';
import { formatBRL } from '@/lib/format';

interface WorkHoursProps {
  annualEnergy: number;
  annualSupermarket: number;
  annualSavings: number;
}

/** Salário mínimo brasileiro 2026 (estimativa educativa). */
const MIN_WAGE_MONTHLY = 1518;
const MONTHLY_HOURS = 220;
const HOURLY_WAGE = MIN_WAGE_MONTHLY / MONTHLY_HOURS;

export default function WorkHoursComparison({
  annualEnergy,
  annualSupermarket,
  annualSavings,
}: WorkHoursProps) {
  const [useCustomWage, setUseCustomWage] = useState(false);
  const [customWage, setCustomWage] = useState<number>(MIN_WAGE_MONTHLY);

  const wage = useCustomWage && customWage > 0 ? customWage : MIN_WAGE_MONTHLY;
  const hourly = wage / MONTHLY_HOURS;

  const totalSpending = annualEnergy + annualSupermarket;

  const items = [
    {
      label: 'Conta de energia (1 ano)',
      value: annualEnergy,
      icon: '⚡',
      color: 'amber',
    },
    {
      label: 'Supermercado (1 ano)',
      value: annualSupermarket,
      icon: '🛒',
      color: 'rose',
    },
    {
      label: 'Total de gastos anuais',
      value: totalSpending,
      icon: '💰',
      color: 'slate',
    },
    {
      label: 'Economia anual possível',
      value: annualSavings,
      icon: '🌱',
      color: 'emerald',
    },
  ];

  return (
    <section className="card mt-6">
      <div className="flex items-center gap-2 text-slate-900">
        <Clock className="h-5 w-5 text-amber-600" />
        <h2 className="text-lg font-bold">
          Quantas horas de trabalho pagam isso?
        </h2>
      </div>
      <p className="mt-1 text-sm text-slate-500">
        Veja por quanto tempo você precisa trabalhar para pagar cada gasto.
        O cálculo usa o salário mínimo brasileiro por padrão.
      </p>

      {/* Wage selector */}
      <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl bg-slate-50/60 p-3">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
          <Briefcase className="h-3.5 w-3.5" />
          Renda mensal base:
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setUseCustomWage(false)}
            className={`rounded-xl px-3 py-1 text-xs font-bold transition ${
              !useCustomWage
                ? 'bg-[#1B4332] text-white shadow-sm'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            Salário mínimo ({formatBRL(MIN_WAGE_MONTHLY)})
          </button>
          <button
            onClick={() => setUseCustomWage(true)}
            className={`rounded-xl px-3 py-1 text-xs font-bold transition ${
              useCustomWage
                ? 'bg-[#1B4332] text-white shadow-sm'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            Informar outra renda
          </button>
        </div>
        {useCustomWage && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">R$</span>
            <input
              type="number"
              min={1}
              value={customWage}
              onChange={(e) => setCustomWage(Math.max(1, Number(e.target.value)))}
              className="w-28 rounded-lg border border-slate-200 px-2 py-1 text-sm outline-none focus:border-emerald-500"
            />
            <span className="text-xs text-slate-400">/mês</span>
          </div>
        )}
      </div>

      {/* Items */}
      <div className="mt-4 space-y-3">
        {items.map((item) => {
          const hours = item.value / hourly;
          const days = hours / 8;
          const months = days / 22;
          const colorClasses: Record<string, string> = {
            amber: 'border-amber-100 bg-amber-50/40',
            rose: 'border-rose-100 bg-rose-50/40',
            slate: 'border-slate-200 bg-slate-50/60',
            emerald: 'border-emerald-100 bg-emerald-50/40',
          };
          return (
            <div
              key={item.label}
              className={`rounded-2xl border p-4 ${colorClasses[item.color] ?? colorClasses.slate}`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {formatBRL(item.value)}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm">
                <span className="text-slate-600">
                  <span className="text-xl font-extrabold text-slate-900">
                    {hours.toFixed(0)}
                  </span>{' '}
                  horas
                </span>
                <span className="text-slate-500">
                  ≈ {days.toFixed(1)} dias de trabalho
                </span>
                {months >= 1 && (
                  <span className="text-slate-500">
                    ≈ {months.toFixed(1)} meses
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Visualization bar: proportion of year worked */}
      <div className="mt-5">
        <p className="mb-2 text-xs font-semibold text-slate-600">
          Proporção do ano trabalhada para pagar o total de gastos (energia + supermercado):
        </p>
        <YearProportionBar
          percent={(totalSpending / (wage * 12)) * 100}
        />
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-xl bg-sky-50/50 p-3">
        <Info className="mt-0.5 h-4 w-4 flex-none text-sky-500" />
        <p className="text-xs leading-relaxed text-slate-500">
          Cálculo: valor do gasto ÷ valor da hora de trabalho. Considerando
          jornada de {MONTHLY_HOURS} horas/mês. Valores educativos para a feira.
        </p>
      </div>
    </section>
  );
}

function YearProportionBar({ percent }: { percent: number }) {
  const p = Math.max(0, Math.min(100, percent));
  const months = (p / 100) * 12;
  return (
    <div>
      <div className="relative h-8 w-full overflow-hidden rounded-lg bg-slate-100">
        <div
          className="h-full rounded-lg bg-gradient-to-r from-amber-500 to-rose-500 transition-all duration-700"
          style={{ width: `${p}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-700">
          {p.toFixed(1)}% do ano — {months.toFixed(1)} meses
        </div>
      </div>
    </div>
  );
}
