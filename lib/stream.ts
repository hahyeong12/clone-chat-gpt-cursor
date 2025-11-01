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
    // 개행 문자를 기준으로 스트림을 분리합니다.
    while ((idx = buf.indexOf("\n")) >= 0) {
      const line = buf.slice(0, idx).trim();
      buf = buf.slice(idx + 1);
      if (line) {
        try {
          // 각 라인을 JSON으로 파싱합니다.
          const json = JSON.parse(line);
          // 'data' 키의 값을 추출하여 반환합니다.
          if (json.data) {
            yield json.data;
          }
        } catch (e) {
          console.error("스트림 파싱 오류:", line, e);
        }
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
  token?: string; // 토큰 인자 추가
}) {
  // 60초 타임아웃 컨트롤러
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  const headers: HeadersInit = { "Content-Type": "application/json" };
  // 토큰이 있으면 헤더에 추가
  if (body.token) {
    headers["Authorization"] = `Bearer ${body.token}`;
  }

  try {
    const res = await fetch("https://hackathon.jifferent.org/api/chat", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        // 요청 본문에는 토큰을 제외한 나머지 데이터만 포함
        messages: body.messages,
        model: body.model,
        temperature: body.temperature,
        max_tokens: body.max_tokens,
        system: body.system,
        userId: body.userId,
      }),
      signal: controller.signal, // 타임아웃 시그널
    });

    clearTimeout(timeoutId); // 성공 시 타임아웃 클리어

    const contentType = res.headers.get("content-type") || "";
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data?.error?.message || `요청 실패(${res.status})`);
    }
    return readSSE(res);

  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('요청이 60초 후 타임아웃되었습니다.');
    }
    throw error; // 다른 에러는 다시 던짐
  }
}


