import { Atom, Info, Settings } from 'lucide-react';

interface AppHeaderProps {
  onOpenSettings: () => void;
}

export function AppHeader({ onOpenSettings }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-neutral-800 bg-neutral-950/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100 text-neutral-950 shadow-md shadow-black/30 transition-transform duration-300 hover:rotate-12">
            <Atom className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-lg font-bold tracking-tight text-neutral-100">Репетитор з фізики</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="hidden items-center gap-1.5 rounded-full border border-neutral-700 bg-neutral-900 px-3 py-1 text-xs font-semibold text-neutral-300 sm:inline-flex"
            title="Відповіді беруться з перевіреної бібліотеки тем"
          >
            <Info className="h-3.5 w-3.5" aria-hidden="true" />
            Демо-режим
          </span>
          <button
            type="button"
            onClick={onOpenSettings}
            aria-label="Налаштування"
            className="rounded-xl p-2 text-neutral-300 transition-all duration-200 hover:rotate-45 hover:bg-neutral-800"
          >
            <Settings className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
