import { useState } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import {
  Answers,
} from '@/lib/calculations';
import {
  CATEGORY_LABELS,
  Question,
  QUESTIONS,
  TOTAL_QUESTIONS,
} from '@/lib/questions';
import { CATEGORY_ICONS } from './categoryIcons';

interface QuizScreenProps {
  answers: Answers;
  onAnswer: (questionId: number, value: number | string) => void;
  onComplete: () => void;
  onBackToStart: () => void;
}

export default function QuizScreen({
  answers,
  onAnswer,
  onComplete,
  onBackToStart,
}: QuizScreenProps) {
  const [current, setCurrent] = useState(0);
  const question = QUESTIONS[current];
  const isLast = current === TOTAL_QUESTIONS - 1;
  const progress = Math.round(((current + 1) / TOTAL_QUESTIONS) * 100);

  const isAnswered = isQuestionAnswered(question, answers[question.id]);

  function next() {
    if (!isAnswered) return;
    if (isLast) {
      onComplete();
    } else {
      setCurrent((c) => Math.min(c + 1, TOTAL_QUESTIONS - 1));
    }
  }

  function prev() {
    if (current === 0) {
      onBackToStart();
    } else {
      setCurrent((c) => Math.max(c - 1, 0));
    }
  }

  const Icon = CATEGORY_ICONS[question.category];

  return (
    <div className="min-h-screen bg-[#F8F8F7] text-forest-950">
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col justify-between px-5 py-8 sm:py-12">
        {/* Header: category + progress */}
        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-forest-950">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-forest-50 border border-forest-900/15 shadow-2xs">
                <Icon className="h-4 w-4 text-forest-950" />
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-[.18em] text-forest-900">
                {CATEGORY_LABELS[question.category]}
              </span>
            </div>
            <span className="text-xs font-bold text-stone-500">
              Etapa {current + 1} de {TOTAL_QUESTIONS}
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-2 w-full overflow-hidden rounded-full bg-stone-200">
            <div
              className="h-full rounded-full bg-forest-950 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question card */}
        <div key={question.id} className="animate-fade-in-up card flex-1 flex flex-col justify-between">
          <div>
            <span className="inline-block rounded-full bg-stone-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[.15em] text-stone-600 border border-stone-200">
              Pergunta {question.id}
            </span>
            <h2 className="mt-3.5 text-balance text-xl font-bold leading-snug text-forest-950 sm:text-2xl">
              {question.prompt}
            </h2>

            <div className="mt-6">
              {question.type === 'numeric' ? (
                <NumericInput
                  question={question}
                  value={answers[question.id] as number | undefined}
                  onChange={(v) => onAnswer(question.id, v)}
                />
              ) : (
                <ChoiceInput
                  question={question}
                  value={answers[question.id] as string | undefined}
                  onChange={(v) => onAnswer(question.id, v)}
                />
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-6">
          <div className="flex items-center justify-between gap-3">
            <button onClick={prev} className="btn-secondary">
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </button>

            <button
              onClick={next}
              disabled={!isAnswered}
              className="btn-primary"
            >
              {isLast ? (
                <>
                  Ver meu Resultado
                  <Check className="h-4 w-4" />
                </>
              ) : (
                <>
                  Próxima
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>

          {!isAnswered && (
            <p className="mt-3 text-center text-xs text-stone-400">
              Selecione uma resposta acima para avançar.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function isQuestionAnswered(
  q: Question,
  value: number | string | undefined,
): boolean {
  if (value === undefined || value === null || value === '') return false;
  if (typeof value === 'number') return value >= (q.min ?? 0);
  return String(value).trim().length > 0;
}

function ChoiceInput({
  question,
  value,
  onChange,
}: {
  question: Question;
  value: string | undefined;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      {question.options?.map((opt) => {
        const selected = value === opt.label;
        return (
          <button
            key={opt.label}
            onClick={() => onChange(opt.label)}
            className={`choice-option ${selected ? 'choice-option-selected' : ''}`}
          >
            <span
              className={`flex h-5 w-5 flex-none items-center justify-center rounded-full border transition ${
                selected
                  ? 'border-forest-950 bg-forest-950 text-white'
                  : 'border-stone-300 bg-white'
              }`}
            >
              {selected && <Check className="h-3 w-3" strokeWidth={3} />}
            </span>
            <span className="text-sm sm:text-base">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function NumericInput({
  question,
  value,
  onChange,
}: {
  question: Question;
  value: number | undefined;
  onChange: (v: number) => void;
}) {
  const min = question.min ?? 0;
  const max = question.max ?? 9999;

  function clamp(v: number) {
    if (Number.isNaN(v)) return min;
    return Math.max(min, Math.min(max, v));
  }

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="flex items-end gap-3">
        <input
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          step={question.step ?? 1}
          value={value ?? ''}
          onChange={(e) => onChange(clamp(parseInt(e.target.value, 10)))}
          placeholder="0"
          className="w-36 rounded-xl border-2 border-stone-200 bg-white px-4 py-3 text-center text-3xl font-black text-forest-950 outline-none transition focus:border-forest-950 focus:ring-2 focus:ring-forest-950/10"
        />
        {question.unit && (
          <span className="pb-3 text-sm font-bold text-stone-500">
            {question.unit}
          </span>
        )}
      </div>

      {/* Quick stepper for small ranges (e.g. people in the house) */}
      {max - min <= 12 && (
        <div className="flex items-center gap-3">
          <button
            onClick={() => onChange(clamp((value ?? min) - 1))}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 bg-stone-100 text-lg font-bold text-stone-700 transition hover:bg-stone-200 active:scale-95"
          >
            −
          </button>
          <span className="min-w-[3ch] text-center text-2xl font-black text-forest-950">
            {value ?? '–'}
          </span>
          <button
            onClick={() => onChange(clamp((value ?? min) + 1))}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 bg-stone-100 text-lg font-bold text-stone-700 transition hover:bg-stone-200 active:scale-95"
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}


