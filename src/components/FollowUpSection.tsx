import { ChevronDown, MessageCircle, Send } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { findFollowUp } from '@/lib/tutor';
import type { Lesson } from '@/types/lesson';

interface FollowUpSectionProps {
  lesson: Lesson;
}

interface AnsweredQuestion {
  question: string;
  answer: string | null;
}

export function FollowUpSection({ lesson }: FollowUpSectionProps) {
  const [draft, setDraft] = useState('');
  const [answered, setAnswered] = useState<AnsweredQuestion | null>(null);

  const answerQuestion = (question: string) => {
    const match = findFollowUp(lesson, question);
    setAnswered({ question, answer: match ? match.answer : null });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const question = draft.trim();
    if (!question) return;
    answerQuestion(question);
    setDraft('');
  };

  return (
    <section className="rounded-3xl border border-neutral-800 bg-neutral-900 p-6 shadow-sm sm:p-8">
      <h3 className="mb-2 flex items-center gap-2 text-lg font-bold text-neutral-100">
        <MessageCircle className="h-5 w-5 text-neutral-300" aria-hidden="true" />
        Є додаткові запитання?
      </h3>
      <p className="mb-4 text-sm text-neutral-400">Обери готове питання або запитай своїми словами.</p>

      <div className="mb-5 flex flex-col gap-2">
        {lesson.followUps.map((followUp) => {
          const isOpen = answered?.question === followUp.question;
          return (
            <button
              key={followUp.question}
              type="button"
              onClick={() => answerQuestion(followUp.question)}
              aria-expanded={isOpen}
              className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left font-medium transition-all duration-200 ${
                isOpen
                  ? 'border-neutral-500 bg-neutral-800 text-neutral-100'
                  : 'border-neutral-700 text-neutral-300 hover:-translate-y-0.5 hover:border-neutral-500 hover:bg-neutral-800'
              }`}
            >
              {followUp.question}
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-neutral-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="animate-fade-in-up mb-5 rounded-2xl border border-neutral-700 bg-neutral-800 p-5">
          <p className="mb-2 font-semibold text-neutral-100">{answered.question}</p>
          <p className="leading-relaxed text-neutral-300">
            {answered.answer ??
              'У демо-режимі я не маю відповіді на таке запитання для цієї теми. Спробуй одне з готових питань вище.'}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Напиши своє запитання"
          aria-label="Напиши своє запитання"
          className="flex-1 rounded-2xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-base text-neutral-100 placeholder:text-neutral-500 transition-all duration-200 focus:border-neutral-500 focus:bg-neutral-950 focus:outline-none focus:ring-4 focus:ring-neutral-800"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-neutral-100 px-5 py-3 font-semibold text-neutral-950 shadow-md shadow-black/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-neutral-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
          Запитати
        </button>
      </form>
    </section>
  );
}
