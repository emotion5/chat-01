export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  id: string;
  content: Array<{
    type: string;
    text: string;
  }>;
  role: 'assistant';
}
