import { useState } from 'react';
import { sendMessage } from '../services/api';
import type { Message } from '../types/chat';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendUserMessage = async (content: string) => {
    const userMessage: Message = { role: 'user', content };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const assistantContent = await sendMessage([...messages, userMessage]);
      const assistantMessage: Message = {
        role: 'assistant',
        content: assistantContent
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      setError(err.message || 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, isLoading, error, sendUserMessage };
}
