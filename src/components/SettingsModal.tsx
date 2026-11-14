import { Eye, EyeOff, KeyRound, X } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { ModelList } from '@/components/ModelList';
import type { ModelCheckState } from '@/components/ModelList';
import { clearApiKey, loadApiKey, loadModelId, saveApiKey, saveModelId } from '@/lib/aiSettingsStorage';
import { testModel } from '@/lib/openrouter';

interface SettingsModalProps {
  onClose: () => void;
}

type SaveStatus = 'idle' | 'saved' | 'cleared' | 'error';

export function SettingsModal({ onClose }: SettingsModalProps) {
  const [apiKey, setApiKey] = useState(loadApiKey);
  const [hasSavedKey, setHasSavedKey] = useState(() => loadApiKey() !== '');
  const [modelId, setModelId] = useState(loadModelId);
  const [isVisible, setIsVisible] = useState(false);
  const [status, setStatus] = useState<SaveStatus>('idle');
  const [checks, setChecks] = useState<Record<string, ModelCheckState>>({});

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = apiKey.trim();
    const isModelSaved = saveModelId(modelId);

    if (!trimmed) {
      handleClearKey();
      return;
    }

    const isKeySaved = saveApiKey(trimmed);
    setStatus(isKeySaved && isModelSaved ? 'saved' : 'error');
    setHasSavedKey(isKeySaved);
    if (isKeySaved) setApiKey(trimmed);
  };

  const handleClearKey = () => {
    const isCleared = clearApiKey();
    setStatus(isCleared ? 'cleared' : 'error');
    if (isCleared) {
      setApiKey('');
      setHasSavedKey(false);
    }
  };

  const handleCheck = async (checkedModelId: string) => {
    const trimmed = apiKey.trim();
    if (!trimmed) {
      setChecks((previous) => ({
        ...previous,
        [checkedModelId]: { status: 'failed', message: 'Спочатку введи OpenRouter API ключ.' },
      }));
      return;
    }

    setChecks((previous) => ({ ...previous, [checkedModelId]: { status: 'testing' } }));
    const result = await testModel(trimmed, checkedModelId);
    setChecks((previous) => ({ ...previous, [checkedModelId]: result }));
  };

  const statusMessage = {
    idle: null,
    saved: { text: 'Налаштування збережено у цьому браузері.', tone: 'text-neutral-300' },
    cleared: { text: 'Ключ видалено.', tone: 'text-neutral-400' },
    error: { text: 'Не вдалося зберегти налаштування. Перевір налаштування браузера.', tone: 'text-neutral-200' },
  }[status];

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        className="animate-fade-in-up max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl sm:p-8"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-800 text-neutral-200">
              <KeyRound className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 id="settings-title" className="text-xl font-bold text-neutral-100">
              Налаштування AI
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрити"
            className="rounded-xl p-2 text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-neutral-100"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="openrouter-key" className="mb-2 block text-sm font-semibold text-neutral-200">
              OpenRouter API ключ
            </label>
            <div className="relative">
              <input
                id="openrouter-key"
                type={isVisible ? 'text' : 'password'}
                value={apiKey}
                onChange={(event) => {
                  setApiKey(event.target.value);
                  setStatus('idle');
                }}
                autoComplete="off"
                spellCheck={false}
                autoFocus
                placeholder="sk-or-..."
                className="w-full rounded-2xl border border-neutral-700 bg-neutral-950 py-3 pl-4 pr-12 font-mono text-sm text-neutral-100 placeholder:text-neutral-500 transition-all duration-200 focus:border-neutral-500 focus:bg-neutral-950 focus:outline-none focus:ring-4 focus:ring-neutral-800"
              />
              <button
                type="button"
                onClick={() => setIsVisible((visible) => !visible)}
                aria-label={isVisible ? 'Сховати ключ' : 'Показати ключ'}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-neutral-100"
              >
                {isVisible ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-neutral-500">
              Ключ і вибрана модель зберігаються лише у локальному сховищі цього браузера і не передаються на сервер застосунку.
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold text-neutral-200">Модель штучного інтелекту</h3>
            <ModelList
              selectedId={modelId}
              checks={checks}
              onSelect={(id) => {
                setModelId(id);
                setStatus('idle');
              }}
              onCheck={handleCheck}
            />
          </div>

          {statusMessage && (
            <p role="status" className={`animate-fade-in-up text-sm font-medium ${statusMessage.tone}`}>
              {statusMessage.text}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={handleClearKey}
              disabled={!hasSavedKey}
              className="rounded-2xl px-4 py-2.5 font-semibold text-neutral-300 transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Видалити ключ
            </button>
            <button
              type="submit"
              className="rounded-2xl bg-neutral-100 px-6 py-2.5 font-semibold text-neutral-950 shadow-md shadow-black/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-neutral-300"
            >
              Зберегти
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
