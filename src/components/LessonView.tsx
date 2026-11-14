import { BookOpen, Lightbulb, Sigma } from 'lucide-react';
import { FollowUpSection } from '@/components/FollowUpSection';
import { PracticeQuestion } from '@/components/PracticeQuestion';
import { StepSolver } from '@/components/StepSolver';
import type { Lesson } from '@/types/lesson';

interface LessonViewProps {
  lesson: Lesson;
}

export function LessonView({ lesson }: LessonViewProps) {
  return (
    <article className="space-y-5">
      <header className="animate-fade-in-up rounded-3xl border border-neutral-700 bg-neutral-800 p-6 text-neutral-50 shadow-xl shadow-black/30 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-neutral-400">Тема</p>
        <h2 className="mt-1 text-2xl font-bold leading-tight sm:text-3xl">{lesson.title}</h2>
        <p className="mt-3 text-base leading-relaxed text-neutral-300">{lesson.summary}</p>
      </header>

      <section
        className="animate-fade-in-up rounded-3xl border border-neutral-800 bg-neutral-900 p-6 shadow-sm sm:p-8"
        style={{ animationDelay: '80ms' }}
      >
        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-neutral-100">
          <BookOpen className="h-5 w-5 text-neutral-300" aria-hidden="true" />
          Простими словами
        </h3>
        <div className="space-y-3 text-base leading-relaxed text-neutral-300">
          {lesson.explanation.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section
        className="animate-fade-in-up rounded-3xl border border-neutral-800 bg-neutral-900 p-6 shadow-sm sm:p-8"
        style={{ animationDelay: '160ms' }}
      >
        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-neutral-100">
          <Sigma className="h-5 w-5 text-neutral-300" aria-hidden="true" />
          Потрібні формули
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {lesson.formulas.map((formula) => (
            <div
              key={formula.name}
              className="rounded-2xl border border-neutral-700 bg-neutral-800 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-neutral-500 hover:shadow-md"
            >
              <p className="text-sm font-semibold text-neutral-300">{formula.name}</p>
              <p className="my-1.5 text-2xl font-bold text-neutral-100">{formula.expression}</p>
              <p className="text-sm leading-snug text-neutral-400">{formula.meaning}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        className="animate-fade-in-up rounded-3xl border border-neutral-800 bg-neutral-900 p-6 sm:p-8"
        style={{ animationDelay: '240ms' }}
      >
        <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-neutral-100">
          <Lightbulb className="h-5 w-5 text-neutral-300" aria-hidden="true" />
          Приклад з життя
        </h3>
        <p className="text-base leading-relaxed text-neutral-300">{lesson.dailyExample}</p>
      </section>

      <div className="animate-fade-in-up" style={{ animationDelay: '320ms' }}>
        <StepSolver problem={lesson.problem} steps={lesson.steps} />
      </div>

      <div className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
        <PracticeQuestion practice={lesson.practice} />
      </div>

      <div className="animate-fade-in-up" style={{ animationDelay: '480ms' }}>
        <FollowUpSection lesson={lesson} />
      </div>
    </article>
  );
}
