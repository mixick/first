import { lessons } from '@/data/lessons';
import type { FollowUp, Lesson } from '@/types/lesson';

const normalize = (text: string) => text.toLowerCase().replace(/ё/g, 'е').trim();

const countKeywordHits = (text: string, keywords: string[]) =>
  keywords.reduce((hits, keyword) => (text.includes(keyword) ? hits + 1 : hits), 0);

export function findLesson(query: string): Lesson | null {
  const text = normalize(query);
  let best: Lesson | null = null;
  let bestScore = 0;

  for (const lesson of lessons) {
    const score = countKeywordHits(text, lesson.keywords);
    if (score > bestScore) {
      best = lesson;
      bestScore = score;
    }
  }

  return best;
}

export function findFollowUp(lesson: Lesson, question: string): FollowUp | null {
  const text = normalize(question);
  let best: FollowUp | null = null;
  let bestScore = 0;

  for (const followUp of lesson.followUps) {
    const score = countKeywordHits(text, followUp.keywords);
    if (score > bestScore) {
      best = followUp;
      bestScore = score;
    }
  }

  return best;
}

export function isCorrectAnswer(input: string, expected: number): boolean {
  const value = Number(input.replace(/\s/g, '').replace(',', '.'));
  if (!Number.isFinite(value)) return false;
  return Math.abs(value - expected) <= Math.abs(expected) * 0.01;
}

export const TOPIC_SUGGESTIONS = lessons.map((lesson) => lesson.title);
