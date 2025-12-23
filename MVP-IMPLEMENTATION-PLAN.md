# Claude API 챗봇 MVP 구현 계획

## 프로젝트 개요

**목표**: Claude API를 활용한 1:1 대화형 챗봇 MVP 개발
**디자인**: 모노톤 Glass-morphism 스타일, 최소한의 레이아웃
**배포**: Vercel (프론트엔드 + Serverless Functions)

---

## 기술 스택

- **프론트엔드**: React 18 + TypeScript + Vite
- **스타일링**: CSS Modules + CSS Variables (Glass-morphism)
- **백엔드**: Vercel Serverless Functions (api/ 폴더)
- **API**: Anthropic Claude API (@anthropic-ai/sdk)
- **상태 관리**: React Hooks (useState, useEffect)
- **아이콘**: react-icons (선택 사항)

---

## 최소 파일 구조 (MVP)

```
chat-01/
├── api/
│   └── chat.ts                    # Vercel Serverless Function
├── src/
│   ├── components/
│   │   └── Chat/
│   │       ├── ChatList.tsx       # 메시지 목록
│   │       ├── ChatBubble.tsx     # 개별 메시지 말풍선
│   │       ├── InputForm.tsx      # 입력창 + 전송 버튼
│   │       └── Chat.module.css    # 채팅 스타일
│   ├── hooks/
│   │   └── useChat.ts             # 채팅 로직 (상태 + API 호출)
│   ├── services/
│   │   └── api.ts                 # API 호출 함수
│   ├── styles/
│   │   ├── global.css             # Reset + 기본 설정
│   │   └── variables.css          # CSS 변수 (Glass-morphism)
│   ├── types/
│   │   └── chat.ts                # TypeScript 인터페이스
│   ├── App.tsx                    # 메인 컨테이너
│   └── main.tsx                   # React 진입점
├── .env.local                     # 로컬 개발용 환경변수 (Git 제외)
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── vercel.json                    # Vercel 배포 설정
```

---

## 구현 단계

### Phase 1: 프로젝트 초기화

1. **Vite 프로젝트 생성**
   ```bash
   npm create vite@latest chat-01 -- --template react-ts
   cd chat-01
   npm install
   ```

2. **의존성 설치**
   ```bash
   npm install @anthropic-ai/sdk
   npm install -D @vercel/node
   ```

3. **불필요한 파일 제거**
   - `src/App.css` 삭제
   - `src/index.css` → `src/styles/global.css`로 이동
   - 기본 보일러플레이트 정리

4. **폴더 구조 생성**
   ```bash
   mkdir -p src/{components/Chat,hooks,services,styles,types} api
   ```

---

### Phase 2: 백엔드 API 구현 (Serverless Function)

**핵심 파일**: `api/chat.ts`

```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';
import Anthropic from '@anthropic-ai/sdk';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // CORS 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const anthropic = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY, // 서버 환경변수
    });

    const { messages } = req.body;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages,
    });

    res.status(200).json(response);
  } catch (error: any) {
    console.error('API Error:', error);
    res.status(500).json({
      error: error.message || 'Internal server error'
    });
  }
}
```

**환경변수 설정**:
- 로컬: `.env.local` 파일 생성
  ```
  CLAUDE_API_KEY=sk-ant-api03-xxxxx
  ```
- Vercel: Dashboard → Settings → Environment Variables에서 설정

---

### Phase 3: TypeScript 타입 정의

**파일**: `src/types/chat.ts`

```typescript
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
```

---

### Phase 4: API 서비스 레이어

**파일**: `src/services/api.ts`

```typescript
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
```

---

### Phase 5: 커스텀 훅 (비즈니스 로직)

**파일**: `src/hooks/useChat.ts`

```typescript
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
```

---

### Phase 6: Glass-morphism 스타일 시스템

**파일**: `src/styles/variables.css`

```css
:root {
  /* Glass-morphism Core */
  --glass-bg: rgba(255, 255, 255, 0.05);
  --glass-border: rgba(255, 255, 255, 0.1);
  --glass-shadow: rgba(0, 0, 0, 0.3);
  --blur-md: blur(16px);

  /* Monotone Palette (Dark Mode) */
  --bg-primary: #0a0a0a;
  --bg-secondary: #1a1a1a;
  --text-primary: #e5e5e5;
  --text-secondary: #a3a3a3;
  --text-muted: #6b6b6b;

  /* Accent */
  --accent-blue: #4a9eff;
  --accent-glow: rgba(74, 158, 255, 0.15);

  /* Spacing */
  --space-sm: 0.75rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;

  /* Border Radius */
  --radius-md: 12px;
  --radius-lg: 16px;

  /* Typography */
  --font-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-size-base: 1rem;
}
```

**파일**: `src/styles/global.css`

```css
@import './variables.css';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-base);
  font-size: var(--font-size-base);
  color: var(--text-primary);
  background: var(--bg-primary);
  line-height: 1.6;
}
```

---

### Phase 7: UI 컴포넌트 구현

#### 7.1 ChatBubble (메시지 말풍선)

**파일**: `src/components/Chat/ChatBubble.tsx`

```typescript
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
```

#### 7.2 InputForm (입력창)

**파일**: `src/components/Chat/InputForm.tsx`

```typescript
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
```

#### 7.3 ChatList (메시지 목록)

**파일**: `src/components/Chat/ChatList.tsx`

```typescript
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
```

#### 7.4 Chat 스타일

**파일**: `src/components/Chat/Chat.module.css`

```css
.chatList {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.bubble {
  max-width: 70%;
  padding: var(--space-md);
  border-radius: var(--radius-md);
  background: var(--glass-bg);
  backdrop-filter: var(--blur-md);
  border: 1px solid var(--glass-border);
  box-shadow: 0 8px 32px var(--glass-shadow);
}

.bubble.user {
  align-self: flex-end;
  background: var(--accent-glow);
  border-color: var(--accent-blue);
}

.bubble.assistant {
  align-self: flex-start;
}

.inputForm {
  display: flex;
  gap: var(--space-sm);
  padding: var(--space-lg);
  background: var(--glass-bg);
  backdrop-filter: var(--blur-md);
  border-top: 1px solid var(--glass-border);
}

.input {
  flex: 1;
  padding: var(--space-md);
  background: var(--bg-secondary);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: var(--font-size-base);
}

.input:focus {
  outline: none;
  border-color: var(--accent-blue);
}

button {
  padding: var(--space-md) var(--space-lg);
  background: var(--accent-blue);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-weight: 600;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

---

### Phase 8: 메인 앱 통합

**파일**: `src/App.tsx`

```typescript
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
        <h1>Claude Chat</h1>
      </header>

      <ChatList messages={messages} />

      {error && (
        <div style={{
          padding: '1rem',
          color: '#ff6b6b',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      <InputForm onSend={sendUserMessage} disabled={isLoading} />
    </div>
  );
}

export default App;
```

---

## 로컬 개발 환경 설정

### 1. 환경변수 설정

`.env.local` 파일 생성:
```
CLAUDE_API_KEY=sk-ant-api03-xxxxxxxxxxxxx
```

### 2. Vercel CLI 설치 및 실행

```bash
# Vercel CLI 설치
npm install -g vercel

# 로컬 개발 서버 실행 (Serverless Functions 포함)
vercel dev
```

이렇게 하면:
- `localhost:3000` → Vite 프론트엔드
- `localhost:3000/api/chat` → Serverless Function
- `.env.local`의 환경변수 자동 로드

### 3. 대안: Vite만 사용 (개발 초기)

프론트엔드만 먼저 작업하려면:
```bash
npm run dev
```

단, `/api/chat`은 동작하지 않으므로 더미 데이터로 테스트 필요.

---

## Vercel 배포 프로세스

### Step 1: Vercel 설정 파일 작성

**파일**: `vercel.json`

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "functions": {
    "api/**/*.ts": {
      "runtime": "nodejs20.x"
    }
  }
}
```

### Step 2: Git 저장소 초기화

```bash
# Git 초기화
git init
git add .
git commit -m "Initial commit: Claude chat MVP"

# GitHub 저장소 생성 후
git remote add origin https://github.com/YOUR_USERNAME/chat-01.git
git push -u origin main
```

### Step 3: Vercel 프로젝트 생성

1. **Vercel Dashboard 접속**: https://vercel.com
2. **New Project 클릭**
3. **GitHub 저장소 연결**: `chat-01` 선택
4. **프로젝트 설정**:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### Step 4: 환경변수 설정

Vercel Dashboard → 프로젝트 → Settings → Environment Variables:

- **Variable Name**: `CLAUDE_API_KEY`
- **Value**: `sk-ant-api03-xxxxxxxxxxxxx`
- **Environment**: Production, Preview, Development 모두 체크

**중요**: `VITE_` 접두사를 붙이지 마세요! (서버 전용 변수)

### Step 5: 배포 트리거

```bash
# 코드 수정 후
git add .
git commit -m "Update feature"
git push

# → Vercel이 자동으로 배포 시작
```

### Step 6: 배포 확인

1. **Vercel Dashboard**에서 배포 진행 상황 확인
2. **배포 완료 후**:
   - Frontend: `https://your-app.vercel.app`
   - API Endpoint: `https://your-app.vercel.app/api/chat`
3. **Functions 탭**에서 Serverless Function 확인

---

## 배포 후 테스트

### API 엔드포인트 테스트

```bash
curl https://your-app.vercel.app/api/chat \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Hello Claude!"}
    ]
  }'
```

### 프론트엔드 테스트

브라우저에서 `https://your-app.vercel.app` 접속 후:
1. 메시지 입력
2. 전송 버튼 클릭
3. Claude 응답 확인

---

## 주요 파일 경로 요약

### 핵심 구현 파일 (수정/생성 필요)

1. **api/chat.ts** - Serverless Function (Claude API 호출)
2. **src/hooks/useChat.ts** - 채팅 로직 (상태 관리 + API 통합)
3. **src/services/api.ts** - API 호출 함수
4. **src/types/chat.ts** - TypeScript 타입 정의
5. **src/styles/variables.css** - Glass-morphism CSS 변수
6. **src/styles/global.css** - 전역 스타일
7. **src/components/Chat/ChatBubble.tsx** - 메시지 말풍선
8. **src/components/Chat/InputForm.tsx** - 입력 폼
9. **src/components/Chat/ChatList.tsx** - 메시지 목록
10. **src/components/Chat/Chat.module.css** - 채팅 컴포넌트 스타일
11. **src/App.tsx** - 메인 앱
12. **vercel.json** - Vercel 배포 설정

### 설정 파일

- **package.json** - 의존성 관리
- **tsconfig.json** - TypeScript 설정
- **vite.config.ts** - Vite 설정
- **.env.local** - 로컬 환경변수 (Git 제외)
- **.gitignore** - Git 무시 목록

---

## MVP 완성 기준

- [ ] 사용자가 메시지를 입력하고 전송 가능
- [ ] Claude API로부터 응답 수신 및 표시
- [ ] Glass-morphism 스타일 적용
- [ ] 로딩 상태 표시
- [ ] 에러 처리
- [ ] 자동 스크롤 (새 메시지 도착 시)
- [ ] Vercel 배포 성공
- [ ] API 키 안전하게 관리 (Serverless Functions)

---

## 추후 확장 가능 기능 (MVP 이후)

1. **Streaming 응답**: 실시간으로 텍스트가 타이핑되는 효과
2. **대화 기록 저장**: localStorage 또는 DB 연동
3. **Markdown 렌더링**: 코드 블록, 볼드 등 포맷팅
4. **다크/라이트 모드 토글**
5. **대화 세션 관리**: 여러 대화 생성/전환
6. **Tauri/Capacitor 전환**: 데스크톱/모바일 앱

---

## 보안 고려사항

1. **API 키 관리**:
   - ✅ Serverless Functions에서만 사용 (서버 환경변수)
   - ✅ 클라이언트 코드에 절대 하드코딩 금지
   - ✅ `.env.local`은 Git에서 제외 (.gitignore)

2. **CORS 설정**:
   - Serverless Function에서 적절한 CORS 헤더 설정
   - 프로덕션에서는 특정 도메인만 허용 고려

3. **Rate Limiting** (향후):
   - 사용자당 요청 제한
   - Vercel Edge Middleware 활용

4. **입력 검증**:
   - 메시지 길이 제한
   - 악성 입력 필터링

---

## 예상 개발 시간

- **Phase 1-2**: 30분 (프로젝트 초기화 + API 구현)
- **Phase 3-5**: 30분 (타입/서비스/훅 구현)
- **Phase 6**: 20분 (스타일 시스템)
- **Phase 7-8**: 1시간 (UI 컴포넌트 + 통합)
- **배포 설정**: 20분 (Vercel 설정 + 환경변수)

**총 예상 시간**: 약 2.5-3시간

---

## 참고 자료

- [Anthropic API Documentation](https://docs.anthropic.com/claude/reference/getting-started-with-the-api)
- [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions)
- [Vite Guide](https://vitejs.dev/guide/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
