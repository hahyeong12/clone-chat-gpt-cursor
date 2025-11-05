"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { sendChat, type ClientMessage } from "@/lib/stream";
import { LoginDialog } from "@/components/login-dialog";
import { type UserProfile, getOrCreateGoogleUser, getUserProfile } from "@/lib/user-profile";
import { useSession, signOut as nextAuthSignOut } from "next-auth/react";
import { useChat } from "@/lib/chat-context";
import { SpinningPill } from "@/components/ui/spinning-pill";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { formatAssistantResponse } from "@/lib/utils";

export default function Home() {
  const { messages, setMessages } = useChat(); // 전역 상태 사용
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null); // viewportRef 추가
  const { data: session, status } = useSession();

  useEffect(() => {
    // initializeTestUsers(); // 테스트 계정 초기화 제거
  }, []);

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

  useEffect(() => {
    viewportRef.current?.scrollTo({ top: viewportRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function onSend() {
    const content = input.trim();
    if (!content || loading) return;
    setInput("");
    const userMsg = { id: crypto.randomUUID(), role: "user" as const, content };
    const asstMsg = { id: crypto.randomUUID(), role: "assistant" as const, content: "" };
    setMessages((prev) => [...prev, userMsg, asstMsg]);
    setLoading(true);
    try {
      const stream = await sendChat({
        messages: [...messages, userMsg].map(({ role, content }) => ({ role, content })),
        temperature: 0.7,
        max_tokens: 512,
        userId: currentUser?.userId,
        token: session?.idToken, // 세션의 idToken 전달
      });
      for await (const token of stream) {
        setMessages((prev) => prev.map((m) => (m.id === asstMsg.id ? { ...m, content: m.content + token } : m)));
      }
    } catch (e: any) {
      setMessages((prev) => prev.map((m) => (m.id === asstMsg.id ? { ...m, content: `[오류] ${e.message}` } : m)));
    } finally {
      setLoading(false);
    }
  }



  const handleLogout = async () => {
    // NextAuth 세션이 있으면 NextAuth 로그아웃, 없으면 로컬 로그아웃
    if (session) {
      await nextAuthSignOut({ callbackUrl: "/" });
    }
    setCurrentUser(null);
    setMessages([]);
  };

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  }

  return (
    <div className="h-screen flex flex-col items-center px-4 py-6 gap-4 bg-gradient-to-b from-[#ede9fe] to-white text-foreground">
      {/* 헤더에 사이트 이동 버튼 추가 */}
      <Link href="/home" className="absolute top-4 right-4">
        <button className="bg-white text-[#7c3aed] px-4 py-2 rounded-lg border border-[#e5e7eb] hover:bg-gray-50 transition-colors">
          📋 의약품 검색
        </button>
      </Link>

      <main className="w-full max-w-2xl flex-1 flex flex-col border border-[#e5e7eb] rounded-2xl p-4 bg-white shadow-sm min-h-0">
        <header className="flex items-center justify-between pb-3 border-b border-[#2a2a3d] mb-3">
          <div className="flex flex-col">
            <div className="flex items-center">
              <div className="font-semibold">💊 약장수
                <span className="ml-2 text-xs text-green-400">● Active</span>
              </div>
            </div>
            {currentUser && (
              <div className="text-xs text-gray-500 mt-1">
                {currentUser.username}님 (체질: {currentUser.bodyType || "평상형"})
              </div>
            )}
          </div>
          <div className="flex gap-2">
            {currentUser ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-xs"
              >
                로그아웃
              </Button>
            ) : (
              <LoginDialog />
            )}
          </div>
        </header>

        <ScrollArea className="flex-1 min-h-0" viewportRef={viewportRef}>
          <div className="pr-2">
            <div className="space-y-3">
              {messages.map((m) => (
                <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex items-start"}>
                  {m.role === "assistant" && (
                    <div className="mr-3 text-2xl">
                      🤖
                    </div>
                  )}
                  <div
                    className={
                      "markdown-content inline-block rounded-2xl px-4 py-3 max-w-[85%] whitespace-pre-wrap break-words " +
                      (m.role === "user"
                        ? "bg-[#7c3aed] text-white shadow-[0_8px_24px_-8px_rgba(124,58,237,0.4)]"
                        : "bg-[#f3f4f6] text-[#111827] border border-[#e5e7eb]")
                    }
                  >
                    {m.role === "user" && m.content}
                    {m.role === "assistant" && m.content ? (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {formatAssistantResponse(m.content)}
                      </ReactMarkdown>
                    ) : null}
                    {m.role === "assistant" && !m.content && loading && (
                      <SpinningPill />
                    )}
                  </div>
                  {m.role === "user" && <div className="w-10" />}
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>

        <form 
          onSubmit={(e) => {
            e.preventDefault();
            onSend();
          }}
          className="mt-4 flex items-end gap-2 bg-white border border-[#e5e7eb] rounded-xl p-2"
        >
          <Textarea
            id="chat-input"
            name="chat-input"
            className="flex-1 h-16 bg-white text-[#111827] border-none focus-visible:ring-0 placeholder:text-[#9ca3af]"
            placeholder={currentUser ? "증상을 알려주세요 (예: 두통, 소화불량, 기침)" : "로그인 후 증상을 입력하세요"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={!currentUser}
            autoComplete="off"
          />
          <Button 
            type="submit"
            name="send-button"
            id="send-button"
            disabled={loading || !input.trim()} 
            className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white"
          >
            보내기
          </Button>
        </form>
      </main>
    </div>
  );
}
