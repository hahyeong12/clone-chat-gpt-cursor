"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { sendChat, type ClientMessage } from "@/lib/stream";

export default function Home() {
  const [messages, setMessages] = useState<{ id: string; role: ClientMessage["role"]; content: string }[]>([]);
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
    const userMsg = { id: crypto.randomUUID(), role: "user" as const, content };
    const asstMsg = { id: crypto.randomUUID(), role: "assistant" as const, content: "" };
    setMessages((prev) => [...prev, userMsg, asstMsg]);
    setLoading(true);
    try {
      const stream = await sendChat({
        messages: [...messages, userMsg].map(({ role, content }) => ({ role, content })),
        // model은 비우면 서버 기본값(DEFAULT_MODEL || "gpt-4o-mini") 사용
        temperature: 0.7,
        max_tokens: 512,
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

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8 gap-4 bg-gradient-to-b from-[#ede9fe] to-white text-foreground">
      <main className="w-full max-w-2xl flex-1 flex flex-col border border-[#e5e7eb] rounded-2xl p-4 bg-white shadow-sm">
        <header className="flex items-center justify-between pb-3 border-b border-[#2a2a3d] mb-3">
          <div className="font-semibold">Harper <span className="ml-2 text-xs text-green-400">● Active</span></div>
          <div className="flex gap-2 opacity-70">
            <button className="size-8 rounded-full hover:bg-white/5 transition-colors">⋯</button>
          </div>
        </header>
        <ScrollArea className="flex-1">
          <div ref={listRef} className="pr-2">
            <div className="space-y-3">
              {messages.map((m) => (
                <div key={m.id} className={m.role === "user" ? "text-right" : "text-left"}>
                  <div
                    className={
                      "inline-block rounded-2xl px-4 py-2 max-w-[80%] " +
                      (m.role === "user"
                        ? "bg-[#7c3aed] text-white shadow-[0_8px_24px_-8px_rgba(124,58,237,0.4)]"
                        : "bg-[#f3f4f6] text-[#111827] border border-[#e5e7eb]")
                    }
                  >
                    {m.content || (m.role === "assistant" && loading ? "..." : "")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
        <div className="mt-4 flex items-end gap-2 bg-white border border-[#e5e7eb] rounded-xl p-2">
          <Textarea
            className="flex-1 h-16 bg-white text-[#111827] border-none focus-visible:ring-0 placeholder:text-[#9ca3af]"
            placeholder="메시지를 입력하고 Enter로 전송(Shift+Enter 줄바꿈)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
          />
          <Button onClick={onSend} disabled={loading || !input.trim()} className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white">
            보내기
          </Button>
        </div>
      </main>
    </div>
  );
}
