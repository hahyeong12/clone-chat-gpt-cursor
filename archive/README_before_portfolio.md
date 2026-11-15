# 요구사항

## 프로젝트 목표

Chat GPT와 유사한 채팅 AI Application을 구현하는 것입니다.

## 사용하는 기술 스텍

- UI라이브러리
    -TailwindCSS : https://tailwindcss.com/
    -shadcn/ui : https://ui.shadcn.com/
-AI SDK
    - AI SDK : https://ai-sdk.dev/docs/introduction

## 구현단계

### Step 1. 초기 셋업(Next.js, Tailwind 4, shadcn/ui)
- 의존성 설치
  ```bash
  npm i
  npm i -D tailwindcss @tailwindcss/postcss
  ```
- Tailwind 4 활성화
  - `app/globals.css` 최상단에 추가:
    ```css
    @import "tailwindcss";
    ```
- shadcn/ui 초기화(선택)
  ```bash
  # shadcn/ui CLI 설치
  npx shadcn@latest init
  # Button 등 필요한 컴포넌트 추가
  npx shadcn@latest add button input textarea sheet dialog scrollbar
  ```
- 동작 확인
  - `npm run dev` 실행 후 기본 페이지가 Tailwind 스타일로 렌더링되는지 확인

수용기준
- 홈 화면에서 Tailwind 유틸리티 클래스 적용 확인
- shadcn/ui 버튼/입력 필드 렌더 테스트

---

### Step 2. API 라우트(스트리밍 응답)
- `app/api/chat/route.ts` 생성
  ```ts
  import { NextRequest } from "next/server";

  export const runtime = "edge"; // 스트리밍 지연 단축(선택)

  export async function POST(req: NextRequest) {
    try {
      const body = await req.json();
      // 입력 검증
      if (!Array.isArray(body?.messages) || !body?.model) {
        return new Response(
          JSON.stringify({ error: { code: "BAD_REQUEST", message: "messages, model 필수" } }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // 실제 모델 호출 대신 데모 스트림 생성
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          const tokens = ["안", "녕", "하", "세", "요", "!"];
          let i = 0;
          const timer = setInterval(() => {
            if (i < tokens.length) {
              controller.enqueue(encoder.encode(`data: ${tokens[i++]}\n\n`));
            } else {
              controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
              clearInterval(timer);
              controller.close();
            }
          }, 150);
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
        },
      });
    } catch (err) {
      return new Response(
        JSON.stringify({ error: { code: "INTERNAL", message: "서버 오류" } }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
  ```
- 실제 모델 연동 시: `lib/ai.ts`에 모델 어댑터 작성 후 위 라우트에서 호출

수용기준
- `curl -N -X POST http://localhost:3000/api/chat -H "Content-Type: application/json" -d '{"messages":[{"role":"user","content":"안녕"}],"model":"demo"}'` 실행 시 토큰이 순차 전송

---

### Step 3. 프론트엔드 연동(스트림 수신/렌더)
- 스트림 수신 유틸: `lib/stream.ts` 생성
  ```ts
  export async function* readSSE(res: Response) {
    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let buf = "";
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      let idx;
      while ((idx = buf.indexOf("\n\n")) >= 0) {
        const chunk = buf.slice(0, idx).trim();
        buf = buf.slice(idx + 2);
        if (chunk.startsWith("data: ")) {
          const payload = chunk.slice(6);
          if (payload === "[DONE]") return;
          yield payload;
        }
      }
    }
  }

  export async function sendChat({ messages, model, temperature, max_tokens }: any) {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, model, temperature, max_tokens }),
    });
    if (!res.ok && res.headers.get("content-type")?.includes("application/json")) {
      const data = await res.json();
      throw new Error(data?.error?.message || "요청 실패");
    }
    return readSSE(res);
  }
  ```
- 페이지에 연결: `app/page.tsx` 교체(간단 채팅 MVP)
  ```tsx
  "use client";
  import { useEffect, useRef, useState } from "react";
  import { sendChat } from "@/lib/stream";

  type Role = "user" | "assistant" | "system";
  type Message = { id: string; role: Role; content: string };

  export default function Home() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    }, [messages]);

    async function onSend() {
      const content = input.trim();
      if (!content || loading) return;
      setInput("");
      const userMsg: Message = { id: crypto.randomUUID(), role: "user", content };
      const asstMsg: Message = { id: crypto.randomUUID(), role: "assistant", content: "" };
      setMessages((prev) => [...prev, userMsg, asstMsg]);
      setLoading(true);
      try {
        const stream = await sendChat({
          messages: messages.concat(userMsg).map(({ role, content }) => ({ role, content })),
          model: "demo",
          temperature: 0.7,
          max_tokens: 512,
        });
        for await (const token of stream) {
          setMessages((prev) =>
            prev.map((m) => (m.id === asstMsg.id ? { ...m, content: m.content + token } : m))
          );
        }
      } catch (e: any) {
        setMessages((prev) =>
          prev.map((m) => (m.id === asstMsg.id ? { ...m, content: `[오류] ${e.message}` } : m))
        );
      } finally {
        setLoading(false);
      }
    }

    function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onSend();
      }
    }

    return (
      <div className="min-h-screen flex flex-col items-center px-4 py-8 gap-4">
        <main className="w-full max-w-2xl flex-1 flex flex-col border rounded-lg p-4">
          <div ref={listRef} className="flex-1 overflow-y-auto space-y-3 pr-2">
            {messages.map((m) => (
              <div
                key={m.id}
                className={m.role === "user" ? "text-right" : "text-left"}
              >
                <div
                  className={
                    "inline-block rounded-lg px-3 py-2 " +
                    (m.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800")
                  }
                >
                  {m.content || (m.role === "assistant" && loading ? "..." : "")}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-end gap-2">
            <textarea
              className="flex-1 resize-none h-24 border rounded-md p-2"
              placeholder="메시지를 입력하고 Enter로 전송(Shift+Enter 줄바꿈)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
            />
            <button
              onClick={onSend}
              disabled={loading || !input.trim()}
              className="h-10 px-4 rounded-md bg-black text-white disabled:opacity-50"
            >
              전송
            </button>
          </div>
        </main>
      </div>
    );
  }
  ```

수용기준
- 메시지 입력 후 Enter 시 바로 사용자 메시지가 표시되고, 어시스턴트 답변이 토큰 단위로 증가
- 로딩 중 입력 비활성화 또는 시각적 피드백 제공

---

### Step 4. UI 컴포넌트 분리(shadcn/ui 적용)
- 파일 구성
  - `components/ChatList.tsx`: 역할별 버블, 자동 스크롤 지원
  - `components/ChatInput.tsx`: 멀티라인, 단축키, 전송 버튼
  - `components/Header.tsx`: 새 대화, 설정 열기
  - `components/SettingsSheet.tsx`: 모델/온도/토큰/시스템 프롬프트
- 스타일 가이드
  - 다크모드 지원, 키보드 포커스 링, 접근성 속성(aria-label/role) 적용
- 페이지에서 컴포넌트 사용하도록 교체

수용기준
- 모바일/데스크탑 반응형 정상
- 단축키(Enter/Shift+Enter) 정상
- 설정 변경 시 다음 요청부터 반영

---

### Step 5. 배포(Vercel)
- 환경 변수 설정
  - 실제 모델 연동 시(지금은 데모 스트림이므로 생략 가능)
    - 로컬: `.env.local`
      - `OPENAI_API_KEY=...` (예시: OpenAI 사용 시)
      - `DEFAULT_MODEL=openai:gpt-4o-mini` (선택)
    - Vercel: Project Settings → Environment Variables에 동일 키 추가
- 빌드/배포
  ```bash
  npm run build
  npm start  # 로컬 프로덕션 확인
  ```
  - Vercel에 Git 연동 → `Deploy` 버튼
- 서버 로그/오류 확인
  - 스트리밍 정상 동작, 400/500 처리 확인

수용기준
- 프로덕션 URL에서 입력/스트리밍/반응형/UI 상태 이상 없음