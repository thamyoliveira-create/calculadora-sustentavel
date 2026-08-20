import { CategoryId, CATEGORY_SHORT_LABELS } from '@/lib/questions';
import { CalculationResult } from '@/lib/calculations';
import { formatBRL } from '@/lib/format';
import { CATEGORY_ICONS } from './categoryIcons';

/** Color per category */
const CATEGORY_COLORS: Record<CategoryId, string> = {
  energia: '#f59e0b',
  agua: '#0ea5e9',
  transporte: '#8b5cf6',
  alimentacao: '#ef4444',
  compras: '#ec4899',
  residuos: '#10b981',
};

const CATEGORY_ORDER: CategoryId[] = [
  'energia',
  'agua',
  'transporte',
  'alimentacao',
  'compras',
  'residuos',
];

export function CategoryBarChart({
  result,
}: {
  result: CalculationResult;
}) {
  return (
    <div className="space-y-4">
      {CATEGORY_ORDER.map((cat) => {
        const cs = result.categoryScores[cat];
        const Icon = CATEGORY_ICONS[cat];
        const color = CATEGORY_COLORS[cat];
        return (
          <div key={cat}>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Icon className="h-4 w-4" style={{ color }} />
                {CATEGORY_SHORT_LABELS[cat]}
              </span>
              <span className="text-sm font-bold text-slate-900">
                {cs.percent}%
              </span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="animate-grow-width h-full rounded-full transition-[width] duration-700 ease-out"
                style={{ width: `${cs.percent}%`, backgroundColor: color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Grouped horizontal bar comparing current vs reduced annual spending. */
export function SpendingComparisonChart({
  annualEnergy,
  annualSupermarket,
  reducedEnergy,
  reducedSupermarket,
}: {
  annualEnergy: number;
  annualSupermarket: number;
  reducedEnergy: number;
  reducedSupermarket: number;
}) {
  const maxVal = Math.max(annualEnergy, annualSupermarket, 1);

  const rows = [
    {
      label: 'Energia',
      current: annualEnergy,
      reduced: reducedEnergy,
      color: '#f59e0b',
    },
    {
      label: 'Supermercado',
      current: annualSupermarket,
      reduced: reducedSupermarket,
      color: '#ef4444',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-5 text-xs font-medium text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm bg-slate-300" /> Atual
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm bg-emerald-500" /> Com redução
        </span>
      </div>
      {rows.map((row) => (
        <div key={row.label}>
          <div className="mb-1.5 flex items-center justify-between text-sm font-semibold text-slate-700">
            <span>{row.label}</span>
          </div>
          <div className="space-y-1.5">
            <Bar
              value={row.current}
              max={maxVal}
              color="#cbd5e1"
              label={formatBRL(row.current)}
            />
            <Bar
              value={row.reduced}
              max={maxVal}
              color={row.color}
              label={formatBRL(row.reduced)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function Bar({
  value,
  max,
  color,
  label,
}: {
  value: number;
  max: number;
  color: string;
  label: string;
}) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="h-7 flex-1 overflow-hidden rounded-lg bg-slate-50">
        <div
          className="animate-grow-width h-full rounded-lg transition-[width] duration-700 ease-out"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="w-28 flex-none text-right text-xs font-semibold text-slate-700">
        {label}
      </span>
    </div>
  );
}

/** Bar chart of accumulated savings across 5 years. */
export function AccumulatedSavingsChart({
  annualSavings,
}: {
  annualSavings: number;
}) {
  const years = [1, 2, 3, 4, 5];
  const data = years.map((y) => ({
    year: y,
    value: annualSavings * y,
  }));
  const maxVal = Math.max(...data.map((d) => d.value), 1);

  // SVG dimensions — responsive via viewBox
  const width = 320;
  const height = 200;
  const padX = 36;
  const padBottom = 32;
  const padTop = 16;
  const innerW = width - padX - 12;
  const innerH = height - padBottom - padTop;
  const barW = innerW / data.length - 12;

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* y-axis gridlines */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const y = padTop + innerH - innerH * t;
          const v = maxVal * t;
          return (
            <g key={t}>
              <line
                x1={padX}
                x2={padX + innerW}
                y1={y}
                y2={y}
                stroke="#f1f5f9"
                strokeWidth={1}
              />
              <text
                x={padX - 6}
                y={y + 3}
                textAnchor="end"
                className="fill-slate-400 text-[8px]"
              >
                {formatBRL(v).replace('R$', '').trim()}
              </text>
            </g>
          );
        })}

        {data.map((d, i) => {
          const h = (d.value / maxVal) * innerH;
          const x = padX + i * (barW + 12);
          const y = padTop + innerH - h;
          return (
            <g key={d.year}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={Math.max(0, h)}
                rx={6}
                className="fill-emerald-500 transition-all duration-500"
              >
                <title>{formatBRL(d.value)}</title>
              </rect>
              <text
                x={x + barW / 2}
                y={y - 4}
                textAnchor="middle"
                className="fill-slate-700 text-[8px] font-semibold"
              >
                {formatBRL(d.value).replace('R$', '').trim()}
              </text>
              <text
                x={x + barW / 2}
                y={height - 12}
                textAnchor="middle"
                className="fill-slate-500 text-[9px] font-medium"
              >
                Ano {d.year}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/** Vertical bar chart (percentages) used in the fair dashboard. */
export function PercentBars({
  items,
  color = '#10b981',
}: {
  items: { label: string; value: number }[];
  color?: string;
}) {
  return (
    <div className="space-y-3">
      {items.map((it) => (
        <div key={it.label}>
          <div className="mb-1 flex items-center justify-between text-xs font-medium text-slate-600">
            <span className="pr-2">{it.label}</span>
            <span className="font-bold text-slate-900">
              {it.value.toFixed(0)}%
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="animate-grow-width h-full rounded-full transition-[width] duration-700 ease-out"
              style={{ width: `${Math.max(0, Math.min(100, it.value))}%`, backgroundColor: color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
