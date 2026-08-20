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
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/60 via-white to-white">
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-5 py-8 sm:py-12">
        {/* Header: category + progress */}
        <div className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-700">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100">
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-sm font-semibold">
                {CATEGORY_LABELS[question.category]}
              </span>
            </div>
            <span className="text-sm font-medium text-slate-400">
              {current + 1} / {TOTAL_QUESTIONS}
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="animate-grow-width h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-[width] duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question card */}
        <div key={question.id} className="animate-fade-in-up card flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Pergunta {question.id}
          </p>
          <h2 className="mt-2 text-balance text-2xl font-bold leading-snug text-slate-900 sm:text-3xl">
            {question.prompt}
          </h2>

          <div className="mt-8">
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

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between gap-3">
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
                Ver resultado
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
          <p className="mt-4 text-center text-xs text-slate-400">
            Selecione uma resposta para continuar.
          </p>
        )}
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
    <div className="flex flex-col gap-3">
      {question.options?.map((opt) => {
        const selected = value === opt.label;
        return (
          <button
            key={opt.label}
            onClick={() => onChange(opt.label)}
            className={`choice-option ${selected ? 'choice-option-selected' : ''}`}
          >
            <span
              className={`flex h-6 w-6 flex-none items-center justify-center rounded-full border-2 transition ${
                selected
                  ? 'border-emerald-500 bg-emerald-500 text-white'
                  : 'border-slate-300 bg-white'
              }`}
            >
              {selected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
            </span>
            <span className="font-medium">{opt.label}</span>
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
          className="w-40 rounded-2xl border-2 border-slate-100 bg-white px-5 py-4 text-center text-3xl font-bold text-slate-900 outline-none transition focus:border-emerald-500"
        />
        {question.unit && (
          <span className="pb-4 text-base font-medium text-slate-500">
            {question.unit}
          </span>
        )}
      </div>

      {/* Quick stepper for small ranges (e.g. people in the house) */}
      {max - min <= 12 && (
        <div className="flex items-center gap-3">
          <button
            onClick={() => onChange(clamp((value ?? min) - 1))}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xl font-bold text-slate-600 transition hover:bg-slate-200"
          >
            −
          </button>
          <span className="min-w-[3ch] text-center text-2xl font-bold text-emerald-700">
            {value ?? '–'}
          </span>
          <button
            onClick={() => onChange(clamp((value ?? min) + 1))}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xl font-bold text-slate-600 transition hover:bg-slate-200"
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}


