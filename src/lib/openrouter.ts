const OPENROUTER_CHAT_URL = 'https://openrouter.ai/api/v1/chat/completions';

export type ModelTestResult = { status: 'ok' } | { status: 'failed'; message: string };

const describeHttpError = (status: number): string => {
  if (status === 401 || status === 403) return 'Ключ не підходить. Перевір, чи правильно він скопійований.';
  if (status === 402) return 'На акаунті немає коштів або ліміт для цієї моделі вичерпано.';
  if (status === 404) return 'Модель зараз недоступна або її назву змінено.';
  if (status === 429) return 'Забагато запитів. Спробуй трохи пізніше.';
  return `Сервіс відповів помилкою (код ${status}).`;
};

const hasChatReply = (data: unknown): boolean => {
  if (typeof data !== 'object' || data === null || !('choices' in data)) return false;
  const choices = (data as { choices: unknown }).choices;
  if (!Array.isArray(choices) || choices.length === 0) return false;
  return typeof choices[0] === 'object' && choices[0] !== null && 'message' in choices[0];
};

export async function testModel(apiKey: string, modelId: string): Promise<ModelTestResult> {
  let response: Response;
  try {
    response = await fetch(OPENROUTER_CHAT_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelId,
        messages: [{ role: 'user', content: 'Відповідь одним словом: ти працюєш?' }],
        max_tokens: 32,
      }),
    });
  } catch {
    return { status: 'failed', message: 'Немає зв\'язку з сервісом. Перевір інтернет-з\'єднання.' };
  }

  if (!response.ok) {
    return { status: 'failed', message: describeHttpError(response.status) };
  }

  const data: unknown = await response.json().catch(() => null);
  if (!hasChatReply(data)) {
    return { status: 'failed', message: 'Модель не повернула відповіді. Спробуй іншу модель.' };
  }

  return { status: 'ok' };
}
