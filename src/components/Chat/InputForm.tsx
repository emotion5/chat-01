import { useState, FormEvent } from 'react';
import styles from './Chat.module.css';

interface Props {
  onSend: (message: string) => void;
  disabled: boolean;
}

export function InputForm({ onSend, disabled }: Props) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  return (
    <form className={styles.inputForm} onSubmit={handleSubmit}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="메시지를 입력하세요..."
        disabled={disabled}
        className={styles.input}
      />
      <button type="submit" disabled={disabled || !input.trim()}>
        전송
      </button>
    </form>
  );
}
