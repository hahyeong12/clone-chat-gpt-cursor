import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatAssistantResponse(text: string): string {
  let formattedText = text;

  // 1. 숫자 강조 (굵게)
  // 정수 또는 소수점 숫자를 찾습니다.
  formattedText = formattedText.replace(/\b(\d+(\.\d+)?)\b/g, '**$1**');

  // 2. 경고 문구 강조 (굵고 기울임)
  const warningKeywords = [
    "주의사항", "주의", "경고", "금지", "피하는 것이 좋습니다", "주의가 필요합니다",
    "권장하지 않습니다", "삼키지 마세요", "과다복용", "부작용", "상담 필요", "병원 방문"
  ];

  warningKeywords.forEach(keyword => {
    // 대소문자 구분 없이 키워드를 찾고, 이미 마크다운으로 감싸져 있지 않은 경우에만 적용
    const regex = new RegExp(`(?<!\\*\\*\\*)${keyword}(?!\\*\\*\\*)`, 'gi');
    formattedText = formattedText.replace(regex, '***$&***');
  });

  return formattedText;
}
