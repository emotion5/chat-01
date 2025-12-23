import { useChat } from './hooks/useChat';
import { ChatList } from './components/Chat/ChatList';
import { InputForm } from './components/Chat/InputForm';
import './styles/global.css';

function App() {
  const { messages, isLoading, error, sendUserMessage } = useChat();

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <header style={{
        padding: '1rem',
        borderBottom: '1px solid var(--glass-border)',
        background: 'var(--glass-bg)',
        backdropFilter: 'var(--blur-md)'
      }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '600' }}>Claude Chat</h1>
      </header>

      <ChatList messages={messages} />

      {error && (
        <div style={{
          padding: '1rem',
          color: '#ff6b6b',
          textAlign: 'center',
          background: 'rgba(255, 107, 107, 0.1)'
        }}>
          {error}
        </div>
      )}

      <InputForm onSend={sendUserMessage} disabled={isLoading} />
    </div>
  );
}

export default App;
