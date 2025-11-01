export const runtime = "nodejs";
import { generateMedicationResponse } from "@/lib/medication-ai";
import { getUserProfile } from "@/lib/user-profile";
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
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        (async () => {
          try {
            // 의약품 추천 모드
            const lastMessage = body.messages[body.messages.length - 1];
            const userProfile = body.userId ? getUserProfile(body.userId) : undefined;
            
            const responseStream = generateMedicationResponse(
              lastMessage.content,
              userProfile
            );
            
            for await (const token of responseStream) {
              controller.enqueue(encoder.encode(`data: ${token}\n\n`));
            }
            controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
            controller.close();
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


