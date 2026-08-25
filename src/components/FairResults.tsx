import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Users,
  Leaf,
  PiggyBank,
  Bike,
  Recycle,
  Search,
  Heart,
} from 'lucide-react';
import {
  FairAggregate,
  fetchFairAggregate,
} from '@/lib/fairData';
import { formatBRL, formatNumber } from '@/lib/format';
import { PercentBars } from './Charts';

interface FairResultsProps {
  onBack: () => void;
}

export default function FairResults({ onBack }: FairResultsProps) {
  const [data, setData] = useState<FairAggregate | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchFairAggregate()
      .then((agg) => {
        if (!cancelled) {
          setData(agg);
          setError(null);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e?.message ?? 'Não foi possível carregar os resultados.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F8F7] text-forest-950">
      <div className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
        <button onClick={onBack} className="btn-ghost mb-6 -ml-3">
          <ArrowLeft className="h-4 w-4" />
          Voltar ao início
        </button>

        <h1 className="text-3xl font-extrabold tracking-tight text-forest-950 sm:text-4xl">
          Resultados Coletivos da Feira
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-stone-500">
          Dados anônimos consolidados durante o evento escolar.
        </p>

        {loading && (
          <div className="card mt-8 text-center text-sm text-slate-500">
            Carregando resultados...
          </div>
        )}

        {error && (
          <div className="card mt-8 border-rose-100 bg-rose-50 text-sm text-rose-700">
            {error}
          </div>
        )}

        {!loading && !error && data && (
          <>
            {/* Headline numbers */}
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <BigStat
                icon={<Users className="h-5 w-5 text-emerald-600" />}
                label="Participantes"
                value={formatNumber(data.totalParticipants)}
              />
              <BigStat
                icon={<Leaf className="h-5 w-5 text-teal-600" />}
                label="Pontuação média"
                value={`${formatNumber(data.averageScore, 1)} / 100`}
              />
              <BigStat
                icon={<PiggyBank className="h-5 w-5 text-emerald-600" />}
                label="Economia média anual"
                value={formatBRL(data.averageSavings)}
              />
            </div>

            {/* Transport */}
            <section className="card mt-6">
              <div className="flex items-center gap-2 text-slate-900">
                <Bike className="h-5 w-5 text-sky-600" />
                <h2 className="text-lg font-bold">
                  Meio de transporte mais utilizado
                </h2>
              </div>
              <div className="mt-5">
                <PercentBars
                  color="#0ea5e9"
                  items={Object.entries(data.transportBreakdown).map(
                    ([label, value]) => ({ label, value }),
                  )}
                />
              </div>
            </section>

            {/* Habits */}
            <section className="card mt-6">
              <h2 className="text-lg font-bold text-slate-900">
                Hábitos de consumo
              </h2>
              <div className="mt-5 space-y-4">
                <HabitRow
                  icon={<Recycle className="h-5 w-5 text-emerald-600" />}
                  label="Sempre separa recicláveis"
                  value={data.recyclesAlwaysPct}
                  color="#10b981"
                />
                <HabitRow
                  icon={<Search className="h-5 w-5 text-amber-600" />}
                  label="Sempre compara preços"
                  value={data.comparesPricesAlwaysPct}
                  color="#f59e0b"
                />
                <HabitRow
                  icon={<Heart className="h-5 w-5 text-rose-600" />}
                  label="Pagar mais por produto sustentável"
                  value={data.paysMoreSimPct}
                  color="#ef4444"
                />
                <HabitRow
                  icon={<Heart className="h-5 w-5 text-violet-600" />}
                  label='Respondeu "Depende do preço"'
                  value={data.paysMoreDependsPct}
                  color="#8b5cf6"
                />
              </div>
            </section>

            {data.totalParticipants === 0 && (
              <div className="card mt-6 text-center text-sm text-slate-500">
                Ainda não há respostas registradas. Quando os visitantes
                concluírem o questionário, os resultados coletivos aparecerão
                aqui.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function BigStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="card flex flex-col gap-2 !p-5">
      <div className="flex items-center gap-2 text-slate-500">
        {icon}
        <span className="text-xs font-medium leading-tight">{label}</span>
      </div>
      <span className="text-2xl font-bold text-slate-900">{value}</span>
    </div>
  );
}

function HabitRow({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm font-medium text-slate-700">
        <span className="flex items-center gap-2">
          {icon}
          {label}
        </span>
        <span className="font-bold text-slate-900">{pct.toFixed(0)}%</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="animate-grow-width h-full rounded-full transition-[width] duration-700 ease-out"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
