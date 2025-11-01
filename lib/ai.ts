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

  // 마지막 사용자 메시지에서 의약품 정보 추출 및 추가
  const lastUserMessage = messagesToSend.filter(m => m.role === "user").pop();
  if (lastUserMessage) {
    let drugInfoContent = "";
    for (const med of medications) {
      // 약 이름이 사용자 메시지에 포함되어 있는지 확인 (대소문자 구분 없이)
      if (lastUserMessage.content.toLowerCase().includes(med.name.toLowerCase())) {
        const drugDetails = await fetchDrugInfo(med.name);
        
drugInfoContent += `
사용자가 '${med.name}'에 대해 문의했습니다. 다음 정보를 참고하여 답변하세요:
- 이름: ${med.name}
- 카테고리: ${med.category}
- 처리 가능한 증상: ${med.symptoms.join(", ")}
- 용법: ${med.dosage}
- 주의사항: ${med.warnings.join(", ")}
${drugDetails.price !== "정보 없음" ? `- 가격: ${drugDetails.price}` : ''}
`;

        // 성분별 일일 최대 투여량 정보 추가
        for (const ingredient of med.ingredients) {
          const maxDosageDetails = await fetchMaxDosageInfo(ingredient);
          if (maxDosageDetails.dayMaxDosg && maxDosageDetails.dayMaxDosg !== "정보 없음") {
            drugInfoContent += `- ${ingredient} 일일 최대 투여량: ${maxDosageDetails.dayMaxDosg}
`;
          } else if (maxDosageDetails.error) {
            drugInfoContent += `- ${ingredient} 일일 최대 투여량 정보를 가져오는 중 오류 발생: ${maxDosageDetails.error}
`;
          } else {
            drugInfoContent += `- ${ingredient} 일일 최대 투여량: 정보 없음
`;
          }
        }
        
        // 하나의 약에 대한 정보만 가져오도록 (가장 먼저 찾은 약)
        break;
      }
    }

    if (drugInfoContent) {
      // 시스템 메시지로 의약품 정보를 추가하여 AI가 참고하도록 함
      messagesToSend.unshift({ role: "system", content: drugInfoContent });
    }
  }

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


