import { useEffect, useState } from 'react';
import { AppHeader } from '@/components/AppHeader';
import { ResultPanel } from '@/components/ResultPanel';
import type { ResultState } from '@/components/ResultPanel';
import { SearchForm } from '@/components/SearchForm';
import { SettingsModal } from '@/components/SettingsModal';
import { loadApiKey, loadModelId } from '@/lib/aiSettingsStorage';
import { solveImageTask } from '@/lib/openrouter';
import { findLesson } from '@/lib/tutor';

const THINKING_DELAY_MS = 700;
const EMPTY_INPUT_MESSAGE = 'Напиши тему або умову задачі, і я допоможу розібратися.';
const NOT_FOUND_MESSAGE =
  'Я не знайшов цю тему в демо-бібліотеці. Спробуй описати її простіше, наприклад «закон Ома» чи «тиск», або обери одну з тем нижче.';

export default function App() {
  const [query, setQuery] = useState('');
  const [pendingSubmission, setPendingSubmission] = useState<{ query: string; image: File | null } | null>(null);
  const [result, setResult] = useState<ResultState>({ status: 'empty' });
  const [runId, setRunId] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    if (pendingSubmission === null) return;
    let cancelled = false;

    const timer = window.setTimeout(() => {
      const run = async () => {
        if (pendingSubmission.image) {
          const apiKey = loadApiKey();
          if (!apiKey) {
            setResult({
              status: 'error',
              message: 'Щоб розв’язати задачу з фото, додай OpenRouter API ключ у Налаштуваннях AI.',
            });
          } else {
            const response = await solveImageTask(
              apiKey,
              loadModelId(),
              pendingSubmission.query,
              pendingSubmission.image,
            );
            if (cancelled) return;
            setResult(
              response.status === 'ok'
                ? { status: 'answer', answer: response.answer }
                : { status: 'error', message: response.message },
            );
          }
        } else {
          const lesson = findLesson(pendingSubmission.query);
          setResult(lesson ? { status: 'success', lesson } : { status: 'error', message: NOT_FOUND_MESSAGE });
        }
        if (cancelled) return;
        setRunId((id) => id + 1);
        setPendingSubmission(null);
      };

      void run();
    }, THINKING_DELAY_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [pendingSubmission]);

  const submit = (value: string, image: File | null) => {
    const trimmed = value.trim();
    setQuery(value);

    if (!trimmed && !image) {
      setPendingSubmission(null);
      setResult({ status: 'error', message: EMPTY_INPUT_MESSAGE });
      return;
    }

    setResult({ status: 'loading' });
    setPendingSubmission({ query: trimmed, image });
  };

  const isLoading = result.status === 'loading';

  return (
    <div className="min-h-screen bg-neutral-950 font-sans text-neutral-100">
      <AppHeader onOpenSettings={() => setIsSettingsOpen(true)} />

      <main className="mx-auto max-w-3xl px-4 pb-16 pt-8 sm:pt-12">
        <div className="animate-fade-in-up text-center">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-neutral-50 sm:text-5xl">
            Репетитор з фізики
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-neutral-400 sm:text-lg">
            Розбираємо формули та задачі крок за кроком, щоб ти вмів розв'язувати їх самостійно.
          </p>
        </div>

        <div className="mt-8 space-y-6 sm:mt-10">
          <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <SearchForm
              value={query}
              isLoading={isLoading}
              onChange={setQuery}
              onSubmit={(image) => submit(query, image)}
            />
          </div>

          <ResultPanel result={result} runId={runId} onTopicSelect={(topic) => submit(topic, null)} />
        </div>
      </main>

      {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
    </div>
  );
}
