import { AI_MODELS, DEFAULT_MODEL_ID } from '@/lib/aiModels';

const API_KEY_STORAGE_KEY = 'physics-tutor.openrouter-api-key';
const MODEL_STORAGE_KEY = 'physics-tutor.ai-model-id';

export function loadApiKey(): string {
  try {
    return window.localStorage.getItem(API_KEY_STORAGE_KEY) ?? '';
  } catch {
    return '';
  }
}

export function saveApiKey(apiKey: string): boolean {
  try {
    window.localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
    return true;
  } catch {
    return false;
  }
}

export function clearApiKey(): boolean {
  try {
    window.localStorage.removeItem(API_KEY_STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

export function loadModelId(): string {
  try {
    const stored = window.localStorage.getItem(MODEL_STORAGE_KEY);
    return AI_MODELS.some((model) => model.id === stored) ? (stored as string) : DEFAULT_MODEL_ID;
  } catch {
    return DEFAULT_MODEL_ID;
  }
}

export function saveModelId(modelId: string): boolean {
  try {
    window.localStorage.setItem(MODEL_STORAGE_KEY, modelId);
    return true;
  } catch {
    return false;
  }
}
