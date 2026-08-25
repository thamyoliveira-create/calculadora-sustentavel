import { useState } from 'react';
import {
  Zap,
  Droplets,
  Recycle,
  Factory,
  Apple,
  Package,
  Building2,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { CORPORATE_REFERENCES, CORPORATE_OVERALL_MESSAGE } from '@/lib/corporateData';

const ICONS: Record<string, LucideIcon> = {
  Zap,
  Droplets,
  Recycle,
  Factory,
  Apple,
  Package,
};

export default function CorporateComparison() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section className="card mt-6">
      <div className="flex items-center gap-2 text-forest-950">
        <Building2 className="h-5 w-5 text-forest-950" />
        <h2 className="text-lg font-bold">
          E as grandes empresas?
        </h2>
      </div>
      <p className="mt-1 text-xs text-stone-500">
        Compare seu consumo individual com o de grandes empresas e da indústria.
        Nem sempre o consumidor é o principal responsável pelo excesso de gastos
        e de recursos.
      </p>

      <div className="mt-5 space-y-3">
        {CORPORATE_REFERENCES.map((ref) => {
          const Icon = ICONS[ref.icon] ?? Info;
          const isOpen = expanded === ref.category;
          return (
            <div
              key={ref.category}
              className="overflow-hidden rounded-2xl border border-slate-100"
            >
              <button
                onClick={() => setExpanded(isOpen ? null : ref.category)}
                className="flex w-full items-center gap-3 bg-slate-50/60 px-4 py-3 text-left transition hover:bg-slate-100"
              >
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-sky-100 text-sky-600">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="flex-1 text-sm font-bold text-slate-800">
                  {ref.category}
                </span>
                <span className="hidden text-xs font-semibold text-sky-700 sm:block">
                  {ref.ratioLabel}
                </span>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 flex-none text-slate-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 flex-none text-slate-400" />
                )}
              </button>

              {isOpen && (
                <div className="animate-fade-in-up px-4 py-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl bg-emerald-50/60 p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                        Você (individual)
                      </p>
                      <p className="mt-1 text-sm font-medium text-slate-700">
                        {ref.individualAverage}
                      </p>
                    </div>
                    <div className="rounded-xl bg-sky-50/60 p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-sky-700">
                        Grande empresa / indústria
                      </p>
                      <p className="mt-1 text-sm font-medium text-slate-700">
                        {ref.corporateAverage}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 rounded-xl bg-amber-50/50 p-3">
                    <p className="text-sm text-slate-700">
                      <span className="font-semibold text-amber-700">
                        Razão aproximada:{' '}
                      </span>
                      {ref.ratioLabel}
                    </p>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {ref.explanation}
                  </p>

                  <p className="mt-2 text-[11px] italic text-slate-400">
                    {ref.source}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-5 rounded-xl bg-stone-900 p-5 text-stone-100 border border-stone-800">
        <p className="text-xs sm:text-sm leading-relaxed">{CORPORATE_OVERALL_MESSAGE}</p>
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-stone-400">
        Nota educativa: Estes comparativos servem para contextualizar que, embora a ação individual seja importante, a regulação da grande indústria é indispensável.
      </p>
    </section>
  );
}
