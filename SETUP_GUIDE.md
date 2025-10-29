# Harper - AI 챗봇 웹사이트

## 프로젝트 소개

Harper는 OpenAI API를 활용한 AI 챗봇 웹 애플리케이션입니다. 실시간으로 AI와 대화할 수 있는 인터페이스를 제공합니다.

## 기능

- ✅ 실시간 스트리밍 AI 대화
- ✅ 반응형 디자인 (모바일/데스크탑)
- ✅ 한국어 지원
- ✅ 아름다운 UI/UX
- ✅ OpenAI API 통합 (선택사항)

## 설치 및 실행

### 1. 프로젝트 디렉토리로 이동

```bash
cd clone-chat-gpt-cursor
```

### 2. 의존성 설치 (첫 실행 시)

```bash
npm install
```

### 3. 환경 변수 설정 (선택사항)

OpenAI API를 사용하려면 `.env.local` 파일을 생성하세요:

```bash
# .env.local
OPENAI_API_KEY=your_openai_api_key_here
DEFAULT_MODEL=gpt-4o-mini
```

**참고**: API 키 없이도 데모 모드로 실행할 수 있습니다.

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속하세요.

## 사용 방법

1. 웹사이트에 접속하면 Harper 챗봇이 표시됩니다.
2. 하단의 입력창에 메시지를 입력하고 엔터를 누르거나 "보내기" 버튼을 클릭하세요.
3. AI가 실시간으로 스트리밍 형식으로 답변을 생성합니다.
4. Shift + Enter를 누르면 줄바꿈이 됩니다.

## 기술 스택

- **Next.js 15** - React 프레임워크
- **Tailwind CSS 4** - 스타일링
- **shadcn/ui** - UI 컴포넌트
- **OpenAI API** - AI 모델
- **TypeScript** - 타입 안정성

## 프로젝트 구조

```
clone-chat-gpt-cursor/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts       # 챗봇 API 엔드포인트
│   ├── page.tsx               # 메인 페이지
│   ├── layout.tsx             # 레이아웃
│   └── globals.css            # 전역 스타일
├── components/
│   └── ui/                    # shadcn/ui 컴포넌트
│       ├── button.tsx
│       ├── textarea.tsx
│       └── scroll-area.tsx
├── lib/
│   ├── ai.ts                  # AI 스트리밍 로직
│   └── stream.ts              # 스트림 처리 유틸
└── package.json
```

## 배포

### Vercel 배포

1. GitHub에 프로젝트를 푸시합니다.
2. [Vercel](https://vercel.com)에 가입하고 프로젝트를 import합니다.
3. 환경 변수 설정 (Settings → Environment Variables):
   - `OPENAI_API_KEY`: OpenAI API 키
4. 배포가 자동으로 진행됩니다.

## 문제 해결

### API 키 오류

- API 키를 설정하지 않았으면 데모 모드로 작동합니다.
- 실제 OpenAI 응답을 받으려면 `.env.local` 파일에 API 키를 추가하세요.

### 포트 충돌

```bash
npm run dev -- -p 3001
```

다른 포트로 실행할 수 있습니다.

## 라이선스

MIT




