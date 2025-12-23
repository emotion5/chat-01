import styles from './Chat.module.css';
import type { Message } from '../../types/chat';

interface Props {
  message: Message;
}

export function ChatBubble({ message }: Props) {
  return (
    <div className={`${styles.bubble} ${styles[message.role]}`}>
      <div className={styles.content}>{message.content}</div>
    </div>
  );
}
