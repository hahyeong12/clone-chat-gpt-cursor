# 이전 대화 기록 로드 기능 구현 업데이트 로그

이 문서는 로그인 후 이전 대화 기록을 외부 백엔드에서 로드하고, 이를 프론트엔드에 표시하며, 페이지 이동 시에도 대화 내용이 유지되도록 구현한 변경 사항들을 정리합니다.

## 1. `app/api/conversations/route.ts` (신규 파일)

-   **목적**: 프론트엔드에서 이전 대화 기록을 요청할 때, 외부 FastAPI 백엔드(`https://hackathon.jifferent.org/api/conversations`)로 요청을 프록시(대리 전달)하는 Next.js API 라우트입니다. `Authorization` 헤더의 토큰을 외부 API로 전달합니다.

```typescript
// app/api/conversations/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET(request: Request) {
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const externalApiUrl = 'https://hackathon.jifferent.org/api/conversations';
  const authorizationHeader = request.headers.get('Authorization');

  if (!authorizationHeader) {
    return NextResponse.json({ message: 'Authorization header missing' }, { status: 400 });
  }

  try {
    const response = await fetch(externalApiUrl, {
      method: 'GET',
      headers: {
        'Authorization': authorizationHeader,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'External API error' }));
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error proxying conversations request:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
```

## 2. `lib/chat-context.tsx` (신규 파일)

-   **목적**: React Context를 사용하여 애플리케이션 전역에서 채팅 메시지 상태를 관리하고, 페이지 이동 시에도 대화 내용이 유지되도록 합니다.

```typescript
// lib/chat-context.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// 메시지 타입을 app/page.tsx와 일치시킵니다.
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatContextType {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  return (
    <ChatContext.Provider value={{ messages, setMessages }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
```

## 3. `app/layout.tsx` (수정)

-   **목적**: `ChatProvider`를 애플리케이션의 최상위 레이아웃에 적용하여, 모든 하위 컴포넌트에서 채팅 상태에 접근할 수 있도록 합니다.

```typescript
// app/layout.tsx (관련 부분만 발췌)
import { ChatProvider } from "@/lib/chat-context"; // 신규 import

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <ChatProvider> {/* ChatProvider로 children을 감쌈 */}
            <TokenSender />
            {children}
          </ChatProvider>
        </Providers>
      </body>
    </html>
  );
}
```

## 4. `app/page.tsx` (수정)

-   **목적**: 로컬 `useState` 대신 `ChatContext`를 사용하여 메시지 상태를 관리하고, 로그인 후 `/api/conversations`를 호출하여 이전 대화 기록을 로드합니다.

```typescript
// app/page.tsx (관련 부분만 발췌)
import { useChat } from "@/lib/chat-context"; // 신규 import

export default function Home() {
  const { messages, setMessages } = useChat(); // 로컬 useState 대신 useChat 훅 사용
  // ... (기존 코드) ...

  // NextAuth 세션 변경 시 사용자 프로필 로드 및 대화 내역 로드
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const userId = session.user.id || session.user.email || "";
      const email = session.user.email || "";
      const name = session.user.name || "사용자";
      
      if (userId) {
        const userProfile = getOrCreateGoogleUser(userId, email, name);
        setCurrentUser(userProfile);

        // 이전 대화 내역 로드
        const loadConversations = async () => {
          try {
            const response = await fetch("/api/conversations", {
              headers: {
                Authorization: `Bearer ${session.idToken}`,
              },
            });
            if (!response.ok) {
              throw new Error(`Failed to fetch conversations: ${response.status}`);
            }
            const data = await response.json();

            if (data && data.length > 0) {
              // 모든 대화의 메시지를 하나의 배열로 합칩니다.
              const allMessages = data.flatMap((conv: any) => conv.conversation);
              setMessages(allMessages);
            } else {
              // 이전 대화가 없으면 환영 메시지 설정
              setMessages([{
                id: crypto.randomUUID(),
                role: "assistant",
                content: `안녕하세요, ${userProfile.username}님! 약장수입니다. 어떤 증상으로 불편하신가요?`
              }]);
            }
          } catch (error) {
            console.error("Error loading conversations:", error);
            // 에러 발생 시에도 환영 메시지 설정
            setMessages([{
              id: crypto.randomUUID(),
              role: "assistant",
              content: `안녕하세요, ${userProfile.username}님! 약장수입니다. 어떤 증상으로 불편하신가요?`
            }]);
          }
        };
        loadConversations();
      }
    } else if (status === "unauthenticated") {
      // 로그아웃 상태면 사용자 정보 및 메시지 초기화
      if (currentUser) {
        setCurrentUser(null);
        setMessages([]); 
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status]);

  // ... (기존 코드) ...

  // onSend 함수 내 setMessages 호출 부분은 그대로 유지
  // ...
}
```