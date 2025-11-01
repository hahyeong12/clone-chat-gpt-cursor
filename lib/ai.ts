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
  // 실제 모델 연동: OPENAI_API_KEY가 있으면 OpenAI Chat Completions 스트리밍 사용
  if (apiKey) {
    const OpenAI = (await import("openai")).default;
    const client = new OpenAI({ apiKey });
    // SDK v4의 스트리밍 사용
    const stream = await client.chat.completions.create({
      model: params.model || "gpt-4o-mini",
      temperature: params.temperature,
      max_tokens: params.max_tokens,
      messages: params.messages.map((m) => ({ role: m.role, content: m.content })),
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


