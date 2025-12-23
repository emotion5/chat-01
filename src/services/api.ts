import type { Message, ChatResponse } from '../types/chat';

export async function sendMessage(messages: Message[]): Promise<string> {
  const apiUrl = import.meta.env.DEV
    ? 'http://localhost:3001/api/chat'
    : '/api/chat';

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error || `API Error: ${response.status}`;
    throw new Error(errorMessage);
  }

  const data: ChatResponse = await response.json();
  return data.content[0]?.text || '';
}
