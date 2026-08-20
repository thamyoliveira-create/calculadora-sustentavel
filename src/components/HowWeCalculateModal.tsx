import { X } from 'lucide-react';
import { formatBRL } from '@/lib/format';

interface HowWeCalculateModalProps {
  onClose: () => void;
}

export default function HowWeCalculateModal({
  onClose,
}: HowWeCalculateModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label="Fechar"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-2xl font-bold text-slate-900">
          Como calculamos?
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Veja, de forma simples, a matemática por trás dos números deste
          projeto.
        </p>

        <div className="mt-6 space-y-5">
          <Formula
            title="Pontuação sustentável"
            formula="Pontuação obtida ÷ pontuação máxima × 100"
            example="Se você somou 120 pontos e o máximo é 160: 120 ÷ 160 × 100 = 75% — Consumo sustentável."
          />
          <Formula
            title="Gasto anual"
            formula="Gasto mensal × 12"
            example={`Conta de energia de ${formatBRL(200)} por mês: ${formatBRL(200)} × 12 = ${formatBRL(2400)} por ano.`}
          />
          <Formula
            title="Economia anual"
            formula="Gasto anual × percentual de redução"
            example={`Gasto anual de ${formatBRL(2400)} com redução de 10%: ${formatBRL(2400)} × 10% = ${formatBRL(240)} de economia por ano.`}
          />
          <Formula
            title="Economia em cinco anos"
            formula="Economia anual × 5"
            example={`Economia anual de ${formatBRL(240)}: ${formatBRL(240)} × 5 = ${formatBRL(1200)} em 5 anos (sem juros nem inflação).`}
          />
          <Formula
            title="Deslocamento mensal"
            formula="Quilômetros por dia × 22 dias"
            example={`10 km por dia: 10 × 22 = 220 km por mês.`}
          />
        </div>

        <div className="mt-6 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-900">
          Os valores apresentados são simulações educativas baseadas nas
          respostas fornecidas e não representam uma previsão exata.
        </div>
      </div>
    </div>
  );
}

function Formula({
  title,
  formula,
  example,
}: {
  title: string;
  formula: string;
  example: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
      <h3 className="text-sm font-bold text-slate-900">{title}</h3>
      <p className="mt-2 font-mono text-sm font-semibold text-emerald-700">
        {formula}
      </p>
      <p className="mt-2 text-sm text-slate-600">
        <span className="font-semibold text-slate-700">Exemplo: </span>
        {example}
      </p>
    </div>
  );
}
