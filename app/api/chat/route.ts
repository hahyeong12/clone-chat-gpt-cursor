export const runtime = "nodejs";
import { generateMedicationResponse } from "@/lib/medication-ai";
import { getUserProfile, saveConversation, updateUserCharacteristicsFromConversations } from "@/lib/user-profile";
import { extractSymptoms } from "@/lib/medication-ai";
import type { Message } from "@/lib/ai";

type ChatRequestBody = {
  messages: Message[];
  model?: string;
  temperature?: number;
  max_tokens?: number;
  system?: string;
  userId?: string; // 사용자 ID 추가
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ChatRequestBody;

    if (!Array.isArray(body?.messages) || body.messages.length === 0) {
      return new Response(
        JSON.stringify({ error: { code: "BAD_REQUEST", message: "messages 배열은 필수입니다." } }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const encoder = new TextEncoder();
    let assistantMessage = "";
    let recommendedMedications: string[] = [];
    
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        (async () => {
          try {
            // 의약품 추천 모드
            const lastMessage = body.messages[body.messages.length - 1];
            const userProfile = body.userId ? getUserProfile(body.userId) : undefined;
            
            // 증상 추출
            const symptoms = extractSymptoms(lastMessage.content);
            
            const responseStream = generateMedicationResponse(
              lastMessage.content,
              userProfile
            );
            
            // 응답을 수집하여 저장 (로그인 사용자인 경우)
            let responseText = "";
            for await (const token of responseStream) {
              responseText += token;
              controller.enqueue(encoder.encode(`data: ${token}\n\n`));
            }
            
            assistantMessage = responseText;
            
            // 추천된 약 이름 추출 (응답에서 약 이름 찾기)
            if (userProfile && symptoms.length > 0) {
              // 약 이름 추출 로직 - 번호 목록 형식에서 추출
              const medPattern = /(\d+)\.\s*([^\n\[\]]+?)(?:\s*\[|\s*💊|\s*📌|$)/g;
              const matches = [...assistantMessage.matchAll(medPattern)];
              if (matches.length > 0) {
                recommendedMedications = matches.map(match => 
                  match[2].trim().split(/\[|💊|📌/)[0].trim()
                ).filter(name => name.length > 0);
              } else {
                // 다른 형식 시도: "약이름" 패턴
                const altMatches = assistantMessage.match(/["']([^"']+약[^"']*)["']/g);
                if (altMatches) {
                  recommendedMedications = altMatches.map(m => 
                    m.replace(/["']/g, "").trim()
                  );
                }
              }
            }
            
            controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
            controller.close();
            
            // 로그인 사용자인 경우 대화 기록 저장
            if (body.userId && assistantMessage) {
              saveConversation(
                body.userId,
                lastMessage.content,
                assistantMessage,
                symptoms,
                recommendedMedications
              );
              
              // 사용자 특성 업데이트
              updateUserCharacteristicsFromConversations(body.userId);
            }
          } catch (e: any) {
            // 스트림 파이프 오류를 피하기 위해 에러를 enqueue 후 정상 종료 처리
            const msg = (e && e.message) ? String(e.message) : "stream_error";
            controller.enqueue(encoder.encode(`data: [ERROR] ${msg}\n\n`));
            controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
            controller.close();
          }
        })();
      },
      cancel() {
        // 연결 종료 시 타이머/자원 정리(데모에선 Interval만 고려)
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


