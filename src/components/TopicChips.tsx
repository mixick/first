import { ArrowRight } from 'lucide-react';
import { TOPIC_SUGGESTIONS } from '@/lib/tutor';

interface TopicChipsProps {
  onSelect: (topic: string) => void;
}

export function TopicChips({ onSelect }: TopicChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {TOPIC_SUGGESTIONS.map((topic) => (
        <button
          key={topic}
          type="button"
          onClick={() => onSelect(topic)}
          className="group inline-flex items-center gap-1.5 rounded-full border border-neutral-700 bg-neutral-900 px-3.5 py-2 text-left text-sm font-medium text-neutral-200 transition-all duration-200 hover:-translate-y-0.5 hover:border-neutral-500 hover:bg-neutral-800 hover:shadow-md"
        >
          {topic}
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}
