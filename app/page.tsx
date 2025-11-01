"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { sendChat, type ClientMessage } from "@/lib/stream";
import { LoginDialog } from "@/components/login-dialog";
import { initializeTestUsers, type UserProfile, getOrCreateGoogleUser, getUserProfile } from "@/lib/user-profile";
import { useSession, signOut as nextAuthSignOut } from "next-auth/react";

export default function Home() {
  const [messages, setMessages] = useState<{ id: string; role: ClientMessage["role"]; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    initializeTestUsers();
  }, []);

  // NextAuth 세션 변경 시 사용자 프로필 로드
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const userId = session.user.id || session.user.email || "";
      const email = session.user.email || "";
      const name = session.user.name || "사용자";
      
      if (userId) {
        // Google 로그인 사용자 프로필 가져오기 또는 생성
        const userProfile = getOrCreateGoogleUser(userId, email, name);
        setCurrentUser(userProfile);
        
        // 환영 메시지 설정 (메시지가 없을 때만)
        if (messages.length === 0) {
          setMessages([{
            id: crypto.randomUUID(),
            role: "assistant",
            content: `안녕하세요, ${userProfile.username}님! 약장수 챗봇입니다. 어떤 증상으로 불편하신가요?`
          }]);
        }
      }
    } else if (status === "unauthenticated") {
      // 로그아웃 상태면 사용자 정보 초기화
      if (currentUser) {
        setCurrentUser(null);
        setMessages([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
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

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    setMessages([{
      id: crypto.randomUUID(),
      role: "assistant",
      content: `안녕하세요, ${user.username}님! 약장수 챗봇입니다. 어떤 증상으로 불편하신가요?`
    }]);
  };

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
    <div className="min-h-screen flex flex-col items-center px-4 py-8 gap-4 bg-gradient-to-b from-[#ede9fe] to-white text-foreground">
      {/* 헤더에 사이트 이동 버튼 추가 */}
      <Link href="/home" className="absolute top-4 right-4">
        <button className="bg-white text-[#7c3aed] px-4 py-2 rounded-lg border border-[#e5e7eb] hover:bg-gray-50 transition-colors">
          📋 의약품 검색
        </button>
      </Link>

      <main className="w-full max-w-2xl flex-1 flex flex-col border border-[#e5e7eb] rounded-2xl p-4 bg-white shadow-sm">
        <header className="flex items-center justify-between pb-3 border-b border-[#2a2a3d] mb-3">
          <div className="flex flex-col">
            <div className="flex items-center">
              <Image src="/assets/pill.png" alt="pill" width={28} height={28} />
              <div className="font-semibold ml-3">약장수 챗봇
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
              <LoginDialog onLogin={handleLogin} />
            )}
          </div>
        </header>

        <ScrollArea className="flex-1">
          <div ref={listRef} className="pr-2">
            <div className="space-y-3">
              {messages.map((m) => (
                <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex items-start"}>
                  {m.role === "assistant" && (
                    <div className="mr-3">
                      <Image src="/assets/robot-pharmacist.png" alt="robot pharmacist" width={40} height={40} className="rounded-md" />
                    </div>
                  )}
                  <div
                    className={
                      "inline-block rounded-2xl px-4 py-3 max-w-[85%] whitespace-pre-wrap break-words " +
                      (m.role === "user"
                        ? "bg-[#7c3aed] text-white shadow-[0_8px_24px_-8px_rgba(124,58,237,0.4)]"
                        : "bg-[#f3f4f6] text-[#111827] border border-[#e5e7eb]")
                    }
                  >
                    {m.content || (m.role === "assistant" && loading ? "..." : "")}
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
