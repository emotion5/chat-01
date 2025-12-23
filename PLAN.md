# 🤖 1:1 AI Chatbot Project Plan

## 1. 프로젝트 개요
*   **목표:** Anthropic (Claude) API를 연동한 1:1 대화형 챗봇 개발.
*   **장기 목표:** 다중 에이전트 대화 시스템으로 확장, Tauri(데스크탑)/Capacitor(모바일) 앱 변환.
*   **핵심 철학:** 가독성 높은 코드, 모듈화된 CSS, 확장 가능한 구조.

## 2. 기술 스택 (Tech Stack)
*   **Core:** React (v18+), TypeScript
*   **Build Tool:** Vite
*   **Styling:** CSS Modules (`*.module.css`) + CSS Variables (Global Theme)
*   **Icons:** react-icons
*   **API Client:** @anthropic-ai/sdk
*   **State Management:** React Built-in Hooks (useState, useEffect, useRef)

## 3. 아키텍처 (Architecture)

### Client-Side Only 구조
현재 단계에서는 별도의 백엔드 서버 없이, 클라이언트(브라우저/앱)에서 직접 Claude API를 호출하는 구조를 채택합니다. 이는 추후 Tauri/Capacitor로 네이티브 앱 패키징 시 서버 없이 독립 실행 가능한 앱을 만들기 위함입니다.

```mermaid
[사용자] <-> [React App (Vite)] <-> [Anthropic API (Claude)]
```

*   **보안 주의사항:** 웹 배포 시 API Key 노출 위험이 있으므로, 로컬 실행 또는 빌드된 앱(Electron/Tauri) 형태에서 환경변수(.env)로 키를 주입하는 방식을 사용합니다.

## 4. 폴더 구조 (Directory Structure)

확장성을 고려한 기능 단위 분리를 지향합니다.

```
src/
├── assets/          # 정적 리소스 (이미지, 폰트 등)
├── components/      # UI 컴포넌트 (각 폴더에 .tsx와 .module.css 동봉)
│   ├── Layout/      # 전체 레이아웃 (헤더, 메인 컨테이너)
│   ├── Chat/        # 채팅 관련 컴포넌트
│   │   ├── ChatList.tsx      # 메시지 목록 렌더링
│   │   ├── ChatBubble.tsx    # 개별 메시지 UI
│   │   ├── InputForm.tsx     # 입력창 및 전송 버튼
│   │   └── chat.module.css   # 채팅 관련 스타일
│   └── Common/      # 공통 컴포넌트 (버튼, 로딩 스피너 등)
├── hooks/           # 커스텀 훅
│   └── useChat.ts   # 채팅 로직 분리 (메시지 상태, API 호출)
├── services/        # 외부 서비스 연동
│   └── claudeApi.ts # Anthropic SDK 초기화 및 호출 함수
├── styles/          # 전역 스타일
│   ├── global.css   # Reset 및 기본 설정
│   └── variables.css # 색상, 폰트 크기 등 CSS 변수 정의
├── types/           # TypeScript 타입 정의
│   └── chat.ts      # Message, User 등 인터페이스
├── App.tsx          # 메인 진입점
└── main.tsx         # React 렌더링 루트
```

## 5. 단계별 개발 계획 (Roadmap)

### Phase 1: 프로젝트 셋업
1.  Vite + React + TS 템플릿 생성.
2.  불필요한 보일러플레이트 제거.
3.  `react-icons`, `@anthropic-ai/sdk` 설치.
4.  `variables.css`에 기본 컬러 팔레트 정의 (다크/라이트 모드 대비).

### Phase 2: UI 레이아웃 구현 (CSS Modules)
1.  **Layout 구조:** 헤더와 채팅 영역이 분리된 기본 틀 잡기.
2.  **InputForm:** 텍스트 입력 영역과 전송 버튼 퍼블리싱.
3.  **ChatBubble:** 내 메시지와 AI 메시지를 구분하는 말풍선 스타일링.

### Phase 3: 기능 구현
1.  **API Service:** Claude API 호출을 위한 비동기 함수 작성.
2.  **useChat Hook:** 메시지 배열 관리, 로딩 상태, 에러 처리 로직 구현.
3.  **연동:** UI와 Hook 연결, 실제 데이터 흐름 확인.

### Phase 4: UX 개선 및 확장 준비
1.  자동 스크롤 (새 메시지 도착 시 하단 이동).
2.  Markdown 렌더링 지원 (코드 블럭 등 표시).
3.  Tauri 연동을 위한 사전 점검.
