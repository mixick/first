import { ImagePlus, Loader2, Sparkles, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';

interface SearchFormProps {
  value: string;
  isLoading: boolean;
  onChange: (value: string) => void;
  onSubmit: (image: File | null) => void;
}

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function SearchForm({ value, isLoading, onChange, onSubmit }: SearchFormProps) {
  const [image, setImage] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!image) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(image);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onSubmit(image);
    }
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null;
    event.target.value = '';
    setImageError(null);
    if (!selected) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(selected.type)) {
      setImageError('Завантаж фото у форматі JPG, PNG або WebP.');
      return;
    }
    if (selected.size > MAX_IMAGE_SIZE_BYTES) {
      setImageError('Розмір фото має бути не більше 10 МБ.');
      return;
    }

    setImage(selected);
  };

  return (
    <form
      className="rounded-3xl border border-neutral-800 bg-neutral-900 p-4 shadow-xl shadow-black/30 sm:p-6"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(image);
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
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label
          htmlFor="tutor-image"
          className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border border-neutral-700 px-3 py-2 text-sm font-medium text-neutral-300 transition-colors hover:border-neutral-500 hover:bg-neutral-800 ${
            isLoading ? 'pointer-events-none opacity-50' : ''
          }`}
        >
          <ImagePlus className="h-4 w-4" aria-hidden="true" />
          Додати фото задачі
        </label>
        <input
          id="tutor-image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageChange}
          disabled={isLoading}
          className="sr-only"
        />
        <p className="text-xs text-neutral-500">JPG, PNG або WebP, до 10 МБ</p>
      </div>
      {imageError && (
        <p role="alert" className="mt-3 text-sm text-neutral-300">
          {imageError}
        </p>
      )}
      {image && previewUrl && (
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-950 p-3">
          <img src={previewUrl} alt="Попередній перегляд фото задачі" className="h-16 w-16 rounded-xl object-cover" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-neutral-200">{image.name}</p>
            <p className="text-xs text-neutral-500">Фото буде надіслано вибраній AI-моделі через OpenRouter.</p>
          </div>
          <button
            type="button"
            onClick={() => setImage(null)}
            disabled={isLoading}
            aria-label="Видалити фото"
            className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-neutral-100 disabled:opacity-50"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}
      <div className="mt-4 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-neutral-500">Enter — надіслати, Shift + Enter — новий рядок</p>
        <button
          type="submit"
          disabled={isLoading || (!value.trim() && !image)}
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
