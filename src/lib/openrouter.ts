const OPENROUTER_CHAT_URL = 'https://openrouter.ai/api/v1/chat/completions';

export type ModelTestResult = { status: 'ok' } | { status: 'failed'; message: string };
export type ImageTaskResult = { status: 'ok'; answer: string } | { status: 'failed'; message: string };

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

const getChatReplyText = (data: unknown): string | null => {
  if (!hasChatReply(data)) return null;
  const message = (data as { choices: { message: { content?: unknown } }[] }).choices[0].message;
  const content = message.content;

  if (typeof content === 'string') return content.trim() || null;
  if (!Array.isArray(content)) return null;

  const text = content
    .map((part) =>
      typeof part === 'object' && part !== null && 'text' in part && typeof part.text === 'string'
        ? part.text
        : '',
    )
    .join('')
    .trim();

  return text || null;
};

export async function solveImageTask(
  apiKey: string,
  modelId: string,
  question: string,
  image: File,
): Promise<ImageTaskResult> {
  let imageDataUrl: string;
  try {
    imageDataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') resolve(reader.result);
        else reject(new Error('Не вдалося прочитати фото.'));
      };
      reader.onerror = () => reject(new Error('Не вдалося прочитати фото.'));
      reader.readAsDataURL(image);
    });
  } catch {
    return { status: 'failed', message: 'Не вдалося прочитати фото. Спробуй вибрати його ще раз.' };
  }

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
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: [
                  'Розв’яжи задачу з фізики, зображену на фото.',
                  question.trim() ? `Додаткове запитання учня: ${question.trim()}` : '',
                  'Відповідай українською. Спочатку коротко перепиши умову, якщо її можна прочитати. Потім поясни розв’язання крок за кроком, запиши формули, підстановку чисел, одиниці вимірювання та відповідь. Якщо умову або фото прочитати неможливо, скажи про це й попроси чіткіше фото.',
                ]
                  .filter(Boolean)
                  .join('\n\n'),
              },
              { type: 'image_url', image_url: { url: imageDataUrl } },
            ],
          },
        ],
        max_tokens: 1200,
        temperature: 0.2,
      }),
    });
  } catch {
    return { status: 'failed', message: 'Немає зв’язку з OpenRouter. Перевір інтернет-з’єднання.' };
  }

  if (!response.ok) {
    return { status: 'failed', message: describeHttpError(response.status) };
  }

  const data: unknown = await response.json().catch(() => null);
  const answer = getChatReplyText(data);
  if (!answer) {
    return { status: 'failed', message: 'Модель не повернула розв’язання. Спробуй іншу модель.' };
  }

  return { status: 'ok', answer };
}

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
