import { Loader2, Sparkles } from 'lucide-react';
import type { KeyboardEvent } from 'react';

interface SearchFormProps {
  value: string;
  isLoading: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export function SearchForm({ value, isLoading, onChange, onSubmit }: SearchFormProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onSubmit();
    }
  };

  return (
    <form
      className="rounded-3xl border border-neutral-800 bg-neutral-900 p-4 shadow-xl shadow-black/30 sm:p-6"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <label htmlFor="tutor-input" className="mb-2 block text-sm font-semibold text-neutral-200">
        Введи тему або умову задачі
      </label>
      <textarea
        id="tutor-input"
        rows={3}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Наприклад: закон Ома або задача про швидкість автомобіля"
        className="w-full resize-none rounded-2xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-base text-neutral-100 placeholder:text-neutral-500 transition-all duration-200 focus:border-neutral-500 focus:bg-neutral-950 focus:outline-none focus:ring-4 focus:ring-neutral-800"
      />
      <div className="mt-4 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-neutral-500">Enter — надіслати, Shift + Enter — новий рядок</p>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-neutral-100 px-6 py-3 text-base font-semibold text-neutral-950 shadow-lg shadow-black/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-neutral-300 hover:shadow-xl active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          ) : (
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          )}
          {isLoading ? 'Думаю...' : 'Допомогти з фізикою'}
        </button>
      </div>
    </form>
  );
}
