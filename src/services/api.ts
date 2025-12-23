import type { Message, ChatResponse } from '../types/chat';

export async function sendMessage(messages: Message[]): Promise<string> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  const data: ChatResponse = await response.json();
  return data.content[0]?.text || '';
}
