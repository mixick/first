import { CheckCircle2, Target } from 'lucide-react';
import { useState } from 'react';
import type { SolutionStep } from '@/types/lesson';

interface StepSolverProps {
  problem: string;
  steps: SolutionStep[];
}

export function StepSolver({ problem, steps }: StepSolverProps) {
  const [shownCount, setShownCount] = useState(0);
  const isFinished = shownCount >= steps.length;
  const progress = (shownCount / steps.length) * 100;

  return (
    <section className="rounded-3xl border border-neutral-800 bg-neutral-900 p-6 shadow-sm sm:p-8">
      <h3 className="mb-2 flex items-center gap-2 text-lg font-bold text-neutral-100">
        <Target className="h-5 w-5 text-neutral-300" aria-hidden="true" />
        Розв'язуємо задачу разом
      </h3>
      <p className="mb-5 rounded-2xl bg-neutral-800 p-4 text-base leading-relaxed text-neutral-200">{problem}</p>

      <div className="mb-5 h-2 overflow-hidden rounded-full bg-neutral-800" aria-hidden="true">
        <div
          className="h-full rounded-full bg-neutral-300 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <ol className="space-y-3">
        {steps.slice(0, shownCount).map((step) => (
          <li
            key={step.title}
            className="animate-fade-in-up flex gap-3 rounded-2xl border border-neutral-800 p-4"
          >
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-neutral-300" aria-hidden="true" />
            <div>
              <p className="font-semibold text-neutral-200">{step.title}</p>
              <p className="mt-1 text-neutral-400">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {isFinished ? (
          <p className="font-semibold text-neutral-300">Готово! Тепер ти знаєш, як розв'язувати такі задачі.</p>
        ) : (
          <button
            type="button"
            onClick={() => setShownCount((count) => count + 1)}
            className="inline-flex items-center justify-center rounded-2xl bg-neutral-100 px-5 py-2.5 font-semibold text-neutral-950 shadow-md shadow-black/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-neutral-300 active:translate-y-0"
          >
            {shownCount === 0 ? 'Показати перший крок' : 'Наступний крок'}
          </button>
        )}
        {!isFinished && shownCount > 0 && (
          <button
            type="button"
            onClick={() => setShownCount(steps.length)}
            className="text-sm font-semibold text-neutral-300 underline-offset-4 transition-colors hover:text-neutral-100 hover:underline"
          >
            Показати весь розв'язок
          </button>
        )}
      </div>
    </section>
  );
}
