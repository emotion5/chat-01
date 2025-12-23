import { useEffect, useRef } from 'react';
import { ChatBubble } from './ChatBubble';
import styles from './Chat.module.css';
import type { Message } from '../../types/chat';

interface Props {
  messages: Message[];
}

export function ChatList({ messages }: Props) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className={styles.chatList}>
      {messages.map((msg, idx) => (
        <ChatBubble key={idx} message={msg} />
      ))}
      <div ref={endRef} />
    </div>
  );
}
