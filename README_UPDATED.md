# Harper AI 챗봇 웹사이트 준비 완료! 🎉

## 무엇이 준비되었나요?

### ✅ 완성된 기능들
1. **메인 페이지** (`app/page.tsx`) - 이미 완성된 채팅 인터페이스
2. **API 라우트** (`app/api/chat/route.ts`) - 챗봇 API 엔드포인트
3. **AI 통합** (`lib/ai.ts`) - OpenAI API 및 데모 스트림 지원
4. **스트림 처리** (`lib/stream.ts`) - 실시간 스트리밍 응답 처리
5. **한국어 메타데이터** (`app/layout.tsx`) - 업데이트됨

### 🎨 디자인
- 현대적이고 아름다운 UI
- 보라색 그라데이션 배경
- 반응형 디자인 (모바일/데스크탑 지원)
- 실시간 스트리밍 애니메이션

## 빠른 시작

### 1단계: 프로젝트 디렉토리로 이동
```bash
cd clone-chat-gpt-cursor
```

### 2단계: 개발 서버 실행
```bash
npm run dev
```

### 3단계: 브라우저에서 확인
브라우저를 열고 `http://localhost:3000`으로 접속하세요!

## API 키 설정 (선택사항)

OpenAI API를 사용하려면:

1. 프로젝트 루트에 `.env.local` 파일 생성:
```bash
OPENAI_API_KEY=your_api_key_here
DEFAULT_MODEL=gpt-4o-mini
```

2. 실제 OpenAI API 키를 입력하세요.

**참고**: API 키 없이도 데모 모드로 완벽하게 작동합니다!

## 사용 방법

1. 웹사이트 접속
2. 하단의 입력창에 메시지 입력
3. Enter 키를 누르거나 "보내기" 버튼 클릭
4. AI가 실시간으로 답변 생성

**단축키**:
- `Enter`: 메시지 전송
- `Shift + Enter`: 줄바꿈

## 기술 스택

- **Next.js 15** - React 프레임워크
- **Tailwind CSS 4** - 스타일링
- **shadcn/ui** - UI 컴포넌트
- **OpenAI API** - AI 모델
- **TypeScript** - 타입 안전성

## 프로젝트 파일 구조

```
clone-chat-gpt-cursor/
├── app/
│   ├── api/chat/route.ts    # 챗봇 API (✅ 완성)
│   ├── page.tsx              # 메인 페이지 (✅ 완성)
│   ├── layout.tsx            # 레이아웃 (✅ 업데이트됨)
│   └── globals.css           # 스타일
├── components/ui/            # UI 컴포넌트들 (✅ 완성)
├── lib/
│   ├── ai.ts                 # AI 로직 (✅ 완성)
│   └── stream.ts             # 스트림 처리 (✅ 완성)
├── SETUP_GUIDE.md           # 상세 가이드
└── package.json              # 의존성

```

## 주요 기능

### 1. 실시간 스트리밍
AI 응답이 실시간으로 토큰 단위로 표시됩니다.

### 2. 한국어 지원
모든 UI가 한국어로 되어있습니다.

### 3. 반응형 디자인
모바일과 데스크탑에서 모두 잘 작동합니다.

### 4. 아름다운 UI
현대적이고 세련된 디자인을 적용했습니다.

## 배포하기

### Vercel 배포
1. GitHub에 코드 푸시
2. [Vercel](https://vercel.com) 접속
3. 프로젝트 import
4. 환경 변수 설정
5. 배포 완료!

## 문제 해결

**Q: API 키 설정하지 않아도 되나요?**  
A: 네! 데모 모드로 완벽하게 작동합니다.

**Q: 다른 포트로 실행하려면?**  
A: `npm run dev -- -p 3001` 같은 포트 번호를 지정하면 됩니다.

**Q: 빌드는 어떻게 하나요?**  
A: `npm run build` 후 `npm start`로 프로덕션 빌드를 실행할 수 있습니다.

## 다음 단계 (선택사항)

프로젝트를 더 향상시키고 싶다면:
- 파일 업로드 기능 추가
- 대화 이력 저장
- 여러 AI 모델 선택
- 다크모드 추가
- 프로필 커스터마이징

---

**준비 완료!** 이제 `npm run dev`를 실행하고 브라우저에서 확인해보세요! 🚀




