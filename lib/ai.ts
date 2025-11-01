import { fetchDrugInfo, fetchMaxDosageInfo } from "./medication-api";
import { medications } from "./medications";

export type Role = "system" | "user" | "assistant";

export type Message = {
  role: Role;
  content: string;
};

export type GenerateStreamParams = {
  messages: Message[];
  model: string;
  temperature?: number;
  max_tokens?: number;
  system?: string;
};

export async function* generateStream(
  params: GenerateStreamParams
): AsyncIterable<string> {
  if (!params?.messages?.length) return;

  const apiKey = process.env.OPENAI_API_KEY;
  const messagesToSend = [...params.messages]; // 메시지 배열 복사

  // ... (의약품 정보 추출 및 추가 로직) ...

  // --- 메시지 프루닝 로직 추가 ---
  const MAX_NON_SYSTEM_MESSAGES = 15; // 대화 기록에서 유지할 최대 비-시스템 메시지 수

  const systemMessages = messagesToSend.filter(m => m.role === "system");
  let nonSystemMessages = messagesToSend.filter(m => m.role !== "system");

  if (nonSystemMessages.length > MAX_NON_SYSTEM_MESSAGES) {
    // 가장 오래된 메시지부터 제거 (최신 메시지는 유지)
    nonSystemMessages = nonSystemMessages.slice(nonSystemMessages.length - MAX_NON_SYSTEM_MESSAGES);
  }
  
  // 시스템 메시지와 프루닝된 비-시스템 메시지를 다시 합칩니다.
  messagesToSend.splice(0, messagesToSend.length, ...systemMessages, ...nonSystemMessages);
  // --- 프루닝 로직 끝 ---

  // 실제 모델 연동: OPENAI_API_KEY가 있으면 OpenAI Chat Completions 스트리밍 사용
  if (apiKey) {
    const OpenAI = (await import("openai")).default;
    const client = new OpenAI({ apiKey });
    // SDK v4의 스트리밍 사용
    const stream = await client.chat.completions.create({
      model: params.model || "gpt-4o-mini",
      temperature: params.temperature,
      max_tokens: params.max_tokens,
      messages: messagesToSend.map((m) => ({ role: m.role, content: m.content })),
      stream: true,
    });

    for await (const event of stream) {
      const delta = event.choices?.[0]?.delta?.content;
      if (typeof delta === "string" && delta.length > 0) {
        yield delta;
      }
    }
    return;
  }

  // 데모 스트림(키가 없을 때)
  const tokens = toDemoTokens(params.messages);
  for (const token of tokens) {
    await delay(40);
    yield token;
  }
}

function toDemoTokens(messages: Message[]): string[] {
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const base = lastUser?.content?.trim() || "";
  const reply = base
    ? `당신의 입력: "${base}" 를 잘 받았습니다. 이것은 데모 스트림입니다.`
    : "안녕하세요! 이것은 데모 스트림 응답입니다.";
  return [...reply];
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


