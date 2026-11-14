import { Loader2 } from 'lucide-react';
import { AI_MODELS } from '@/lib/aiModels';
import type { ModelTestResult } from '@/lib/openrouter';

export type ModelCheckState = { status: 'testing' } | ModelTestResult;

interface ModelListProps {
  selectedId: string;
  checks: Record<string, ModelCheckState>;
  onSelect: (modelId: string) => void;
  onCheck: (modelId: string) => void;
}

export function ModelList({ selectedId, checks, onSelect, onCheck }: ModelListProps) {
  return (
    <ul role="radiogroup" aria-label="Модель штучного інтелекту" className="space-y-2">
      {AI_MODELS.map((model) => {
        const isSelected = model.id === selectedId;
        const check = checks[model.id];
        const isTesting = check?.status === 'testing';

        return (
          <li
            key={model.id}
            className={`rounded-2xl border p-3 transition-all duration-200 ${
              isSelected ? 'border-neutral-500 bg-neutral-800' : 'border-neutral-700 bg-neutral-900 hover:border-neutral-600'
            }`}
          >
            <div className="flex items-center gap-3">
              <button
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onSelect(model.id)}
                className="flex min-w-0 flex-1 items-center gap-3 text-left"
              >
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                    isSelected ? 'border-neutral-300' : 'border-neutral-600'
                  }`}
                  aria-hidden="true"
                >
                  {isSelected && <span className="h-2 w-2 rounded-full bg-neutral-200" />}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-neutral-100">{model.label}</span>
                  <span className="block truncate font-mono text-xs text-neutral-500">{model.id}</span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => onCheck(model.id)}
                disabled={isTesting}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-xs font-semibold text-neutral-300 transition-all duration-200 hover:border-neutral-500 hover:bg-neutral-800 disabled:cursor-wait disabled:opacity-70"
              >
                {isTesting && <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />}
                {isTesting ? 'Перевіряю...' : 'Перевірити'}
              </button>
            </div>
            {check && check.status === 'ok' && (
              <p role="status" className="animate-fade-in-up mt-2 text-xs font-medium text-neutral-300">
                Модель працює і відповідає.
              </p>
            )}
            {check && check.status === 'failed' && (
              <p role="status" className="animate-fade-in-up mt-2 text-xs font-medium text-neutral-400">
                {check.message}
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}
