export type Role = "system" | "user" | "assistant";

export type ClientMessage = {
  role: Role;
  content: string;
};

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

export async function sendChat(body: {
  messages: ClientMessage[];
  model?: string;
  temperature?: number;
  max_tokens?: number;
  system?: string;
  userId?: string;
}) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const contentType = res.headers.get("content-type") || "";
  if (!res.ok && contentType.includes("application/json")) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error?.message || `요청 실패(${res.status})`);
  }
  return readSSE(res);
}


