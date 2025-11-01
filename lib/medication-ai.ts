// 의약품 추천을 위한 AI 로직

import { medications } from "./medications";
import type { Medication } from "./medications";
import type { UserProfile } from "./user-profile";
import { medicationDetails } from "./symptom-categories";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function* generateMedicationResponse(
  userMessage: string,
  userProfile?: UserProfile
): AsyncIterable<string> {
  const lowerMessage = userMessage.toLowerCase();
  
  // 인사말 처리
  if (lowerMessage.includes("안녕") || lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
    yield* generateStream("어서오십쇼! 약장숩니다. 어디가 불편하셔?");
    return;
  }
  
  // 로그인 관련
  if (lowerMessage.includes("로그인") || lowerMessage.includes("로그아웃")) {
    yield* generateStream("로그인은 위에 있는 로그인 버튼 누르시면 됩니다!");
    return;
  }
  
  // 눈 관련 증상: 보다 세분화된 안내
  if (
    userMessage.includes("눈") && (
      userMessage.includes("아파") ||
      userMessage.includes("따갑") ||
      userMessage.includes("피곤") ||
      userMessage.includes("건조") ||
      userMessage.includes("충혈") ||
      userMessage.includes("이물감")
    )
  ) {
    const redFlags = [
      "시력 저하",
      "강한 통증",
      "심한 충혈 2일 이상",
      "눈부심/시야장애",
      "외상 후 통증"
    ];
    const tips = [
      "화면 사용 줄이고 20-20-20 규칙 실천",
      "인공눈물(보존제 무첨가) 1일 3-4회 점안",
      "냉찜질로 눈 피로 완화",
      "콘택트렌즈 일시 중단"
    ];
    let msg = "아, 눈이 아프시구나! 형님, 이거 좀 들어보세요.\n\n";
    msg += "일단 이렇게 해보시면 좀 낫습니다:\n- " + tips.join("\n- ") + "\n\n";
    msg += "근데 다음 증상 중 하나라도 있으면 바로 안과 가셔야 해요:\n- " + redFlags.join("\n- ");
    yield* generateStream(msg);
    return;
  }
  
  // 증상 확인
  const responses: string[] = [];
  
  // 증상 추출
  const symptoms = extractSymptoms(userMessage);
  
  // 일반적인 질문이나 대화 처리
  if (symptoms.length === 0) {
    // 질문 형식 체크
    if (userMessage.includes("?") || userMessage.includes("뭐") || userMessage.includes("무엇") || 
        userMessage.includes("어떤") || userMessage.includes("어떻게") || userMessage.includes("언제") ||
        userMessage.includes("왜") || userMessage.includes("어디")) {
      yield* generateStream("형님! 약장숩니다.\n\n저는 증상에 맞는 약 추천해드리는 거예요. 예를 들면:\n\n• '머리가 아파요' → 두통 약 추천\n• '소화가 안 돼요' → 소화제 추천\n• '기침이 나요' → 기침약 추천\n\n어디가 불편하신지 말씀해주시면 제가 좋은 거 골라드릴게요! 😊");
      return;
    }
    
    // 일반적인 감사나 긍정적 표현
    if (userMessage.includes("감사") || userMessage.includes("고마") || userMessage.includes("좋") || 
        userMessage.includes("도움") || userMessage.includes("고맙")) {
      yield* generateStream("고맙다고 하지 마세요! 형님 건강하시는 게 제일 중요한 거라니까요.\n\n또 불편하시면 언제든 말씀해주세요! 💚");
      return;
    }
    
    // 부정적인 표현 (그만, 싫어 등)
    if (userMessage.includes("그만") || userMessage.includes("안") || userMessage.includes("싫")) {
      yield* generateStream("알겠습니다! 또 필요하시면 언제든 말씀해주세요.");
      return;
    }
    
    // 일반적인 인사나 대화
    const casualResponses = [
      "어서오십쇼! 약장숩니다. 어디가 불편하셔?",
      "네, 말씀해주세요! 어디가 아프신지 알려주시면 좋은 약 골라드릴게요.",
      "뭐가 불편하신가요? 증상 말씀해주시면 제가 추천해드릴게요.",
      "어디가 아프신지 말씀해주세요! 예를 들어 '머리가 아파요', '소화가 안 돼요' 같은 식으로요."
    ];
    
    yield* generateStream(casualResponses[Math.floor(Math.random() * casualResponses.length)]);
    return;
  }
  
  // 증상 확인 및 상황 분석
  responses.push(`아하, ${symptoms.join(", ")} 때문에 불편하시는구나!`);
  
  // 상황별 안내 추가
  const situation = analyzeSituation(userMessage);
  if (situation) {
    responses.push(`\n상황 보니 ${situation}인 거 같네요.`);
  }
  
  // 약 추천
  const recommendations = recommendMedication(symptoms, userProfile);
  
  if (recommendations.length === 0) {
    responses.push(`\n아, 이 증상에는 제가 가진 약이 딱 맞는 게 없네요.`);
    responses.push(`\n💡 좀 더 자세히 말씀해주시거나 병원 가보시는 게 좋을 것 같아요.`);
  } else {
    responses.push(`\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    responses.push(`\n📋 제가 골라본 약들 (${recommendations.length}개)`);
    responses.push(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    
    // 사용자 연령 확인
    const userAge = userProfile?.age;
    const isInfant = userAge !== undefined && userAge >= 0 && userAge <= 2;
    const isElderly = userAge !== undefined && userAge >= 65;
    
    recommendations.forEach((med, idx) => {
      // 약 상세 정보 가져오기
      const medDetail = medicationDetails[med.id];
      
      // 약장수 말투로 약 소개
      const introPhrases = [
        `형님, 이거 한 번 잡솨보세요. ${med.name}인데 정말 좋아요!`,
        `이 ${med.name} 한 번 보세요. 이거 어디어디에서 이미 정평이 난 거예요!`,
        `${med.name} 한 번 추천해드릴게요. 이거 정말 효과 좋습니다!`,
        `이거 어떠세요? ${med.name}인데, 정말 좋은 약이에요!`
      ];
      responses.push(`\n\n${idx + 1}. ${introPhrases[idx % introPhrases.length]}`);
      responses.push(`   [ ${med.category} ]`);
      
      responses.push(`\n   📌 이 약으로 낫는 증상`);
      responses.push(`   ${med.symptoms.join(", ")}`);
      
      responses.push(`\n   💊 이렇게 드시면 됩니다`);
      responses.push(`   ${med.dosage}`);
      
      // 연령별 안내 추가
      if (medDetail) {
        if (isInfant && medDetail.ageRestrictions?.infant) {
          responses.push(`\n   👶 유아기(0-2세) 이용자 안내`);
          responses.push(`   ${medDetail.ageRestrictions.infant}`);
          
          // 대체 약 추천
          if (medDetail.ageAlternatives?.infant && medDetail.ageAlternatives.infant.length > 0) {
            const altMeds = medDetail.ageAlternatives.infant
              .map(altId => medicationDetails[altId]?.name)
              .filter(Boolean);
            if (altMeds.length > 0 && altMeds[0] !== med.name) {
              responses.push(`   💡 유아기에는 ${altMeds.join(" 또는 ")}이(가) 더 안전할 수 있어요.`);
            }
          }
        } else if (isElderly && medDetail.ageRestrictions?.elderly) {
          responses.push(`\n   👴 노년기(65세 이상) 이용자 안내`);
          responses.push(`   ${medDetail.ageRestrictions.elderly}`);
          
          // 대체 약 추천
          if (medDetail.ageAlternatives?.elderly && medDetail.ageAlternatives.elderly.length > 0) {
            const altMeds = medDetail.ageAlternatives.elderly
              .map(altId => medicationDetails[altId]?.name)
              .filter(Boolean);
            if (altMeds.length > 0 && altMeds[0] !== med.name) {
              responses.push(`   💡 노년기에는 ${altMeds.join(" 또는 ")}이(가) 더 안전할 수 있어요.`);
            }
          }
        }
      }
      
      // 상황별 맞춤 복용 시간 추천
      const customDosage = getCustomDosageAdvice(med, userMessage, userProfile);
      if (customDosage) {
        responses.push(`\n   ⏰ 상황에 맞게 이렇게 드시면 좋아요`);
        // 긴 경우 여러 줄로 나누기
        if (customDosage.length > 40) {
          const parts = customDosage.split(" | ");
          parts.forEach(part => {
            responses.push(`   ${part}`);
          });
        } else {
          responses.push(`   ${customDosage}`);
        }
      }
      
      if (med.warnings && med.warnings.length > 0) {
        responses.push(`\n   ⚠️ 이건 좀 주의하셔야 해요`);
        med.warnings.forEach(warning => {
          responses.push(`   ${warning}`);
        });
      }
      
      if (med.caution && userProfile) {
        responses.push(`\n   🔔 형님 상황에는 이렇게`);
        responses.push(`   ${med.caution}`);
      }
      
      // 약 사이에 큰 공간 추가
      if (idx < recommendations.length - 1) {
        responses.push(`\n\n────────────────────────────`);
      }
    });
    
    // 연령별 종합 추천 메시지
    if (userAge !== undefined) {
      if (isInfant) {
        responses.push(`\n\n👶 유아기 이용자 추가 안내`);
        responses.push(`   유아기(0-2세)는 체중에 따라 용량 조절이 필수입니다.`);
        responses.push(`   모든 약 복용 전에 반드시 소아과 의사나 약사와 상담하세요.`);
      } else if (isElderly) {
        responses.push(`\n\n👴 노년기 이용자 추가 안내`);
        responses.push(`   노년기(65세 이상)는 신장/간 기능 저하 가능성으로 용량 조절이 필요합니다.`);
        responses.push(`   특히 졸음 부작용이 있는 약은 낙상 위험이 높으니 주의하세요.`);
      }
    }
    
    responses.push(`\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    responses.push(`\n📝 한 가지 말씀드릴게요\n`);
    responses.push(`   위 내용은 참고용이에요. 복용 전에 의사나 약사분께 한 번 물어보시는 게 좋습니다.`);
    
    // 긴급 상황 안내
    if (symptoms.some(s => s.includes("근육") || s.includes("가슴"))) {
      responses.push(`\n   🚨 응급 증상이면 즉시 병원 가세요!`);
    }
  }
  
  // 체질별 추천
  if (userProfile && recommendations.length > 0) {
    const bodyType = analyzeUserBodyType(userProfile);
    const personalizedRecommendation = getPersonalizedRecommendation(recommendations, userProfile);
    
    if (personalizedRecommendation) {
      responses.push(`\n${userProfile.username}님 체질(${bodyType}) 보니까`);
      responses.push(`→ ${personalizedRecommendation.name}이(가) 제일 잘 맞을 것 같아요!`);
    }
  }
  
  yield* generateStream(responses.join(""));
}

export function extractSymptoms(text: string): string[] {
  const found: string[] = [];
  const lowerText = text.toLowerCase().replace(/\s+/g, "");
  
  // 더 유연한 증상 추출 - 키워드 뿐만 아니라 문맥도 고려
  const symptomPatterns: { [key: string]: { patterns: (string | RegExp)[], related?: string[] } } = {
    "두통": {
      patterns: ["머리", "두통", "두부", "헤드", "두개", /머리\S*아프/, /두통\S*/, "땅땅", "머리아픔", "두통이", "머리 아픔", "머리좀", "머리 아프다", /머리.*아파/, /머리.*좀/, /머리.*안.*좋/],
      related: ["구역", "어지러", "현기", "시큼", "쑤시"]
    },
    "복통": {
      patterns: ["배", "복통", "복부", /배\S*아프/, /배\S*남/, "가더", /배가.*아프/, "배아파", "배 아파", "배가 아파", "배 좀", "배가 안좋", "복통이", "복통이 있어"],
      related: ["속", "명치", "구역", "메스", "아픔", "시큼"]
    },
    "소화불량": {
      patterns: ["소화", "트림", "더부", "가스", "팽만", /소화\S*안/, /소화\S*안돼/, "소화 안돼", "소화가 안돼", "소화 안되", "소화불량", "트림이", "더부룩"],
      related: ["배", "복부", "트림", "가스", "체함"]
    },
    "기침": {
      patterns: ["기침", "기케", "기캬", "가래", /기침\S*/, /기\S*기\S*/, "기침나", "기침 나", "기침이 나", "기침나요", "기침이"],
      related: ["가래", "헛기침", "목", "기관지", "인후"]
    },
    "근육통": {
      patterns: ["근육", "목아", "어깨", "허리", "등", "견관절", /목\S*아/, /등\S*아/, "목 아파", "목아파", "어깨 아파", "허리 아파", "등 아파", "뻐근", "뻣뻣"],
      related: ["촉", "뻐근", "뻣뻣", "통증", "시큼"]
    },
    "불면증": {
      patterns: ["불면", "잠안", "수면장애", /잠\S*안/, /잠.*못/, /수면.*안/, "잠 안와", "잠이 안와", "잠 못자", "잠을 못자", "불면증", "수면장애"],
      related: ["불면", "이면", "수면", "잠"]
    },
    "비염": {
      patterns: ["콧물", "재채기", "코막", "비염", /콧물\S*/, /코.*막/, "코 막혀", "코막혀", "콧물이", "재채기"],
      related: ["콧", "코막", "코"]
    },
    "위산과다": {
      patterns: ["속쓰", "위산", "역류", "명치", /속\S*쓰/, /가슴.*쓰/, "속 쓰림", "가슴 쓰림", "명치 쓰", "역류", "위산역류"],
      related: ["속이", "가슴", "명치", "위"]
    },
    "메스꺼움": {
      patterns: ["메스", "구토", "토할", "구역", /메스\S*/, /구토\S*/, "메스꺼워", "메스꺼움", "구역질", "토"],
      related: ["토", "끼억", "역"]
    },
    "열": {
      patterns: ["열", "발열", "체온", "온도", /열\S*나/, /발열\S*/, "열나", "열 나", "열이 나", "발열", "열감"],
      related: ["뜨거", "열감", "온도", "체온"]
    }
    ,
    "치통": {
      patterns: [
        "치통", "이빨", "치아", "이가", "이 아", "이 아파", "잇몸", "잇몸 아파", /이\S*아프/, /치\S*아파/
      ],
      related: ["얼얼", "욱신", "땡김", "시림", "시려"]
    }
  };
  
  for (const [symptom, { patterns, related }] of Object.entries(symptomPatterns)) {
    // 패턴 매칭
    const hasPattern = patterns.some(pattern => {
      if (typeof pattern === 'string') {
        return text.includes(pattern) || lowerText.includes(pattern.replace(/\s+/g, ""));
      } else {
        return pattern.test(text);
      }
    });
    
    // 관련 키워드 매칭 (점수 부여)
    let relatedScore = 0;
    if (related) {
      related.forEach(keyword => {
        if (text.includes(keyword) || lowerText.includes(keyword.replace(/\s+/g, ""))) {
          relatedScore++;
        }
      });
    }
    
    // 패턴이 있거나 관련 키워드가 1개 이상이면 증상으로 인정 (더 유연하게)
    if (hasPattern || relatedScore >= 1) {
      found.push(symptom);
    }
  }
  
  return found;
}

function recommendMedication(symptoms: string[], userProfile?: UserProfile): Medication[] {
  const recommendations: Medication[] = [];
  
  for (const med of medications) {
    const hasMatch = symptoms.some(s => 
      med.symptoms.some(symptom => s.includes(symptom) || symptom.includes(s))
    );
    
    if (hasMatch) {
      let score = 100;
      const warnings: string[] = [];
      
      // 알레르기 체크
      if (userProfile?.allergies) {
        const hasAllergy = med.ingredients.some(ingredient => 
          userProfile.allergies!.some(allergen => 
            ingredient.toLowerCase().includes(allergen.toLowerCase())
          )
        );
        
        if (hasAllergy) {
          score = 0;
          warnings.push("알레르기 성분 포함 - 복용 금지");
        }
      }
      
      // 만성 질환 체크
      if (userProfile?.chronicConditions) {
        userProfile.chronicConditions.forEach(condition => {
          if (med.caution && med.caution.toLowerCase().includes(condition.toLowerCase())) {
            score -= 30;
            warnings.push(`${condition} 환자 주의`);
          }
        });
      }
      
      // 과거 복용 이력 체크
      if (userProfile?.medicationHistory) {
        const pastNegative = userProfile.medicationHistory.filter(h => 
          h.medicationId === med.id && h.result === "negative"
        );
        
        if (pastNegative.length > 0) {
          score -= 40;
          warnings.push("과거 부작용 경험");
        }
        
        const pastPositive = userProfile.medicationHistory.filter(h => 
          h.medicationId === med.id && h.result === "positive"
        );
        
        if (pastPositive.length > 0) {
          score += 20;
        }
      }
      
      if (score > 0) {
        recommendations.push({
          ...med,
          warnings: [...med.warnings, ...warnings],
          ...(score < 100 ? { _score: score } : {})
        });
      }
    }
  }
  
  // 점수 기준 정렬
  return recommendations.sort((a, b) => {
    const scoreA = (a as any)._score || 100;
    const scoreB = (b as any)._score || 100;
    return scoreB - scoreA;
  }).slice(0, 3); // 상위 3개만
}

function analyzeUserBodyType(profile: UserProfile): string {
  if (profile.bodyType) {
    return profile.bodyType;
  }
  
  const conditions = profile.chronicConditions || [];
  const history = profile.medicationHistory || [];
  
  if (conditions.includes("천식") || conditions.includes("아토피")) {
    return "민감형";
  }
  
  if (history.some(h => h.result === "negative")) {
    return "민감형";
  }
  
  if (conditions.includes("당뇨") || conditions.includes("고혈압")) {
    return "관리형";
  }
  
  return "평상형";
}

function getPersonalizedRecommendation(medications: Medication[], profile: UserProfile): Medication | null {
  // 가장 높은 점수와 적합한 약 추천
  if (medications.length === 0) return null;
  
  return medications[0]; // 이미 점수 기준으로 정렬됨
}

async function* generateStream(text: string): AsyncIterable<string> {
  // 문자 단위로 스트리밍
  for (const char of text) {
    await new Promise(resolve => setTimeout(resolve, 10));
    yield char;
  }
}

// 상황 분석
function analyzeSituation(text: string): string {
  const situations: string[] = [];
  
  if (text.includes("공복") || text.includes("공복시간")) {
    situations.push("공복 상태");
  }
  if (text.includes("운전")) {
    situations.push("운전 중/운전 예정");
  }
  if (text.includes("밥") && text.includes("안")) {
    situations.push("식사하지 않음");
  }
  if (text.includes("밤") || text.includes("저녁")) {
    situations.push("저녁/밤 시간");
  }
  if (text.includes("아침")) {
    situations.push("아침 시간");
  }
  if (text.includes("피곤") || text.includes("피곤")) {
    situations.push("피로 상태");
  }
  
  return situations.length > 0 ? situations.join(", ") : "";
}

// 상황별 맞춤 복용법 추천
function getCustomDosageAdvice(med: Medication, userMessage: string, userProfile?: UserProfile): string {
  const advice: string[] = [];
  
  // 공복 관련
  if (userMessage.includes("공복")) {
    if (med.name === "타이레놀정" || med.name === "부스코판정") {
      advice.push("식후 30분 복용 권장 (공복에는 위장 자극 가능)");
    }
  }
  
  // 운전 관련
  if (userMessage.includes("운전")) {
    if (med.name === "부스코판정" || med.name.includes("카페인")) {
      advice.push("운전 전 복용 자제, 졸음 유발 가능");
    } else if (med.name === "타이레놀정") {
      advice.push("복용 후 운전 가능");
    }
  }
  
  // 메스꺼움 관련
  if (userMessage.includes("메스꺼워") || userMessage.includes("속이")) {
    if (med.category === "진통제") {
      advice.push("증상 호전 전까지 우선 복용, 지속 시 병원 방문");
    }
  }
  
  // 간질환 환자
  if (userProfile?.chronicConditions?.includes("간")) {
    if (med.name === "타이레놀정") {
      advice.push("간 기능 검사 후 복용 권장");
    }
  }
  
  // 위장 약한 환자
  if (userProfile?.medicationHistory?.some(h => h.medicationId === med.id && h.result === "negative")) {
    advice.push("과거 부작용 경험 있음, 주의 복용");
  }

  // 치통 관련 생활 수칙
  if (
    (userMessage.includes("치통") || userMessage.includes("이빨") || userMessage.includes("치아") || userMessage.includes("잇몸")) &&
    med.category.includes("진통")
  ) {
    advice.push("뜨겁거나 찬 음식 피하기, 가글은 미지근한 소금물 권장");
    advice.push("얼굴 붓기/발열/고름 시 즉시 치과 방문");
  }
  
  return advice.join(" | ");
}


