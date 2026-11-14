import { CheckCircle2, Lightbulb, PenLine, RotateCcw, XCircle } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { isCorrectAnswer } from '@/lib/tutor';
import type { Practice } from '@/types/lesson';

interface PracticeQuestionProps {
  practice: Practice;
}

type Feedback = 'idle' | 'correct' | 'wrong';

export function PracticeQuestion({ practice }: PracticeQuestionProps) {
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<Feedback>('idle');
  const [showHint, setShowHint] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim()) return;
    setFeedback(isCorrectAnswer(input, practice.answer) ? 'correct' : 'wrong');
  };

  const handleRetry = () => {
    setInput('');
    setFeedback('idle');
    setShowHint(false);
  };

  return (
    <section className="rounded-3xl border border-neutral-800 bg-neutral-900 p-6 shadow-sm sm:p-8">
      <h3 className="mb-2 flex items-center gap-2 text-lg font-bold text-neutral-100">
        <PenLine className="h-5 w-5 text-neutral-300" aria-hidden="true" />
        Спробуй сам
      </h3>
      <p className="mb-4 text-base leading-relaxed text-neutral-300">{practice.question}</p>

      {feedback === 'correct' ? (
        <div className="animate-fade-in-up flex flex-col gap-4 rounded-2xl border border-neutral-700 bg-neutral-800 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 font-semibold text-neutral-100">
            <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
            Правильно! Ти розв'язав задачу самостійно.
          </p>
          <button
            type="button"
            onClick={handleRetry}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-600 bg-neutral-950 px-4 py-2 text-sm font-semibold text-neutral-200 transition-colors hover:bg-neutral-700"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Ще одна задача
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <input
              type="text"
              inputMode="decimal"
              value={input}
              onChange={(event) => {
                setInput(event.target.value);
                setFeedback('idle');
              }}
              placeholder="Твоя відповідь"
              aria-label="Твоя відповідь"
              className="w-full rounded-2xl border border-neutral-700 bg-neutral-950 px-4 py-3 pr-20 text-base text-neutral-100 placeholder:text-neutral-500 transition-all duration-200 focus:border-neutral-500 focus:bg-neutral-950 focus:outline-none focus:ring-4 focus:ring-neutral-800"
            />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-neutral-500">
              {practice.unit}
            </span>
          </div>
          <button
            type="submit"
            disabled={!input.trim()}
            className="rounded-2xl bg-neutral-100 px-5 py-3 font-semibold text-neutral-950 shadow-md shadow-black/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-neutral-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Перевірити
          </button>
        </form>
      )}

      {feedback === 'wrong' && (
        <p
          role="status"
          className="animate-fade-in-up mt-3 flex items-center gap-2 text-sm font-medium text-neutral-400"
        >
          <XCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          Майже! Перевір хід розв'язку і одиниці вимірювання.
        </p>
      )}

      <div className="mt-4">
        {showHint ? (
          <p className="flex items-start gap-2 rounded-2xl bg-neutral-800 p-4 text-sm leading-relaxed text-neutral-300">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" aria-hidden="true" />
            {practice.hint}
          </p>
        ) : (
          <button
            type="button"
            onClick={() => setShowHint(true)}
            className="text-sm font-semibold text-neutral-300 underline-offset-4 transition-colors hover:text-neutral-100 hover:underline"
          >
            Потрібна підказка?
          </button>
        )}
      </div>
    </section>
  );
}
