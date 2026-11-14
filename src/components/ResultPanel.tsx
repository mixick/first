import { AlertCircle, GraduationCap, Loader2 } from 'lucide-react';
import { LessonView } from '@/components/LessonView';
import { TopicChips } from '@/components/TopicChips';
import type { Lesson } from '@/types/lesson';

export type ResultState =
  | { status: 'empty' }
  | { status: 'loading' }
  | { status: 'success'; lesson: Lesson }
  | { status: 'error'; message: string };

interface ResultPanelProps {
  result: ResultState;
  runId: number;
  onTopicSelect: (topic: string) => void;
}

export function ResultPanel({ result, runId, onTopicSelect }: ResultPanelProps) {
  switch (result.status) {
    case 'empty':
      return (
        <section className="animate-fade-in-up rounded-3xl border border-dashed border-neutral-700 bg-neutral-900 p-6 text-center sm:p-8">
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-800 text-neutral-200 animate-float">
            <GraduationCap className="h-7 w-7" aria-hidden="true" />
          </span>
          <p className="text-lg font-semibold leading-snug text-neutral-100">
            Привіт! Я твій репетитор з фізики. Допоможу розібратися навіть зі складними темами.
          </p>
          <p className="mt-2 text-sm text-neutral-400">Обери тему, щоб почати, або напиши свою:</p>
          <div className="mt-5 flex justify-center">
            <TopicChips onSelect={onTopicSelect} />
          </div>
        </section>
      );
    case 'loading':
      return (
        <section className="animate-fade-in-up flex flex-col items-center gap-3 rounded-3xl border border-neutral-800 bg-neutral-900 p-10 text-center shadow-sm">
          <Loader2 className="h-8 w-8 animate-spin text-neutral-300" aria-hidden="true" />
          <p className="font-semibold text-neutral-200">Готую пояснення крок за кроком...</p>
        </section>
      );
    case 'error':
      return (
        <section
          role="alert"
          className="animate-fade-in-up rounded-3xl border border-neutral-700 bg-neutral-900 p-6 sm:p-8"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-6 w-6 shrink-0 text-neutral-300" aria-hidden="true" />
            <div className="space-y-4">
              <p className="font-medium leading-relaxed text-neutral-200">{result.message}</p>
              <TopicChips onSelect={onTopicSelect} />
            </div>
          </div>
        </section>
      );
    case 'success':
      return <LessonView key={`${result.lesson.id}-${runId}`} lesson={result.lesson} />;
  }
}
