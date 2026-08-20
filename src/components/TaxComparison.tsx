import { useState } from 'react';
import { Globe2, ChevronDown, ChevronUp, Info } from 'lucide-react';
import {
  TAX_COUNTRIES,
  BRAZIL_TAX_DAYS_MESSAGE,
  TAX_OVERALL_MESSAGE,
} from '@/lib/taxData';

export default function TaxComparison() {
  const [expanded, setExpanded] = useState<string | null>('Brasil');

  // Sort by tax burden descending
  const sorted = [...TAX_COUNTRIES].sort((a, b) => b.taxBurdenPct - a.taxBurdenPct);
  const maxBurden = Math.max(...sorted.map((c) => c.taxBurdenPct));
  const brazil = TAX_COUNTRIES.find((c) => c.country === 'Brasil');

  return (
    <section className="card mt-6">
      <div className="flex items-center gap-2 text-slate-900">
        <Globe2 className="h-5 w-5 text-indigo-600" />
        <h2 className="text-lg font-bold">
          Quanto o brasileiro paga de imposto?
        </h2>
      </div>
      <p className="mt-1 text-sm text-slate-500">
        Compare a carga tributária do Brasil com a de outros países e entenda
        quanto do seu trabalho vai para impostos.
      </p>

      {/* Tax burden ranking chart */}
      <div className="mt-5 space-y-2.5">
        {sorted.map((c) => {
          const isOpen = expanded === c.country;
          const isBrazil = c.country === 'Brasil';
          const widthPct = (c.taxBurdenPct / maxBurden) * 100;
          return (
            <div key={c.country}>
              <button
                onClick={() => setExpanded(isOpen ? null : c.country)}
                className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition ${
                  isBrazil
                    ? 'border-emerald-200 bg-emerald-50/40'
                    : 'border-slate-100 bg-slate-50/40 hover:bg-slate-100'
                }`}
              >
                <span className="text-xl">{c.flag}</span>
                <span className="flex-1">
                  <span className="block text-sm font-bold text-slate-800">
                    {c.country}
                    {isBrazil && (
                      <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        Você está aqui
                      </span>
                    )}
                  </span>
                  <span className="mt-1 block h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <span
                      className="block h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${widthPct}%`,
                        backgroundColor: isBrazil ? '#059669' : '#94a3b8',
                      }}
                    />
                  </span>
                </span>
                <span className="flex-none text-right">
                  <span className="block text-sm font-extrabold text-slate-900">
                    {c.taxBurdenPct.toFixed(1)}%
                  </span>
                  <span className="block text-[10px] text-slate-400">do PIB</span>
                </span>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 flex-none text-slate-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 flex-none text-slate-400" />
                )}
              </button>

              {isOpen && (
                <div className="animate-fade-in-up mt-1 rounded-xl border border-slate-100 bg-white p-4">
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    <Metric
                      label="Carga tributária"
                      value={`${c.taxBurdenPct.toFixed(1)}%`}
                      hint="do PIB"
                    />
                    <Metric
                      label="Salário mínimo"
                      value={`US$ ${c.minWageUSD.toLocaleString('en-US')}`}
                      hint="por mês (PPP)"
                    />
                    <Metric
                      label="Dias para pagar impostos"
                      value={`${Math.round(
                        (c.taxBurdenPct / 100) * 365,
                      )} dias`}
                      hint="por ano"
                    />
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {c.note}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Brazil highlight */}
      {brazil && (
        <div className="mt-5 rounded-2xl bg-gradient-to-br from-indigo-600 to-emerald-600 p-5 text-white">
          <p className="text-sm leading-relaxed">{BRAZIL_TAX_DAYS_MESSAGE}</p>
        </div>
      )}

      {/* Overall message */}
      <div className="mt-4 rounded-2xl bg-slate-50/80 p-4">
        <p className="text-sm leading-relaxed text-slate-700">
          {TAX_OVERALL_MESSAGE}
        </p>
      </div>

      <div className="mt-3 flex items-start gap-2">
        <Info className="mt-0.5 h-4 w-4 flex-none text-slate-400" />
        <p className="text-[11px] leading-relaxed text-slate-400">
          Dados aproximados baseados em estimativas de OCDE / Banco Mundial.
          Valores educativos para feira escolar — não representam precisão
          contábil e podem variar ano a ano.
        </p>
      </div>
    </section>
  );
}

function Metric({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-lg bg-slate-50 p-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-0.5 text-base font-bold text-slate-900">{value}</p>
      <p className="text-[10px] text-slate-400">{hint}</p>
    </div>
  );
}
