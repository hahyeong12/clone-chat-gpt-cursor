// 사용자 프로필 관리

export interface UserProfile {
  userId: string;
  username: string;
  age?: number;
  allergies?: string[]; // 알레르기
  chronicConditions?: string[]; // 만성 질환
  currentMedications?: string[]; // 현재 복용 중인 약
  bodyType?: string; // 체질 (한의학적 분류)
  previousSymptoms?: string[]; // 과거 증상 기록
  medicationHistory?: Array<{
    medicationId: string;
    date: string;
    symptoms: string[];
    result: "positive" | "negative" | "neutral";
  }>;
  preferences?: {
    avoidIngredients?: string[];
    preferNatural?: boolean;
  };
  conversationHistory?: Array<{
    date: string;
    userMessage: string;
    assistantMessage: string;
    symptoms: string[];
    recommendedMedications?: string[];
  }>; // 대화 기록
}

// 간단한 인메모리 저장소 (실제로는 데이터베이스 사용)
const users: Map<string, UserProfile> = new Map();

// 테스트 계정 3개
export function initializeTestUsers() {
  // 테스트 계정 1: 일반 성인
  users.set("user001", {
    userId: "user001",
    username: "홍길동",
    age: 35,
    allergies: ["페니실린"],
    chronicConditions: ["고혈압"],
    currentMedications: [],
    bodyType: "평상형",
    previousSymptoms: [],
    medicationHistory: []
  });

  // 테스트 계정 2: 알레르기 체질
  users.set("user002", {
    userId: "user002",
    username: "김민수",
    age: 28,
    allergies: ["비타민C", "카페인"],
    chronicConditions: ["천식", "아토피"],
    currentMedications: ["약물A"],
    bodyType: "민감형",
    previousSymptoms: ["두통", "소화불량"],
    medicationHistory: [
      {
        medicationId: "med_002",
        date: "2024-01-15",
        symptoms: ["두통"],
        result: "negative"
      }
    ]
  });

  // 테스트 계정 3: 건강한 노인
  users.set("user003", {
    userId: "user003",
    username: "이영희",
    age: 65,
    allergies: [],
    chronicConditions: ["당뇨"],
    currentMedications: [],
    bodyType: "보양형",
    previousSymptoms: ["근육통"],
    medicationHistory: []
  });
}

// 사용자 프로필 가져오기
export function getUserProfile(userId: string): UserProfile | undefined {
  return users.get(userId);
}

// 사용자 프로필 업데이트
export function updateUserProfile(userId: string, updates: Partial<UserProfile>): void {
  const current = users.get(userId);
  if (current) {
    users.set(userId, { ...current, ...updates });
  }
}

// 약물 복용 이력 추가
export function addMedicationHistory(
  userId: string,
  medicationId: string,
  symptoms: string[]
): void {
  const profile = users.get(userId);
  if (profile) {
    const history = profile.medicationHistory || [];
    history.push({
      medicationId,
      date: new Date().toISOString(),
      symptoms,
      result: "neutral"
    });
    updateUserProfile(userId, { medicationHistory: history });
  }
}

// 과거 증상 기록
export function recordSymptom(userId: string, symptom: string): void {
  const profile = users.get(userId);
  if (profile) {
    const symptoms = [...(profile.previousSymptoms || [])];
    if (!symptoms.includes(symptom)) {
      symptoms.push(symptom);
      updateUserProfile(userId, { previousSymptoms: symptoms });
    }
  }
}

// 대화 기록 저장
export function saveConversation(
  userId: string,
  userMessage: string,
  assistantMessage: string,
  symptoms: string[],
  recommendedMedications?: string[]
): void {
  const profile = users.get(userId);
  if (profile) {
    const history = profile.conversationHistory || [];
    history.push({
      date: new Date().toISOString(),
      userMessage,
      assistantMessage,
      symptoms,
      recommendedMedications,
    });
    updateUserProfile(userId, { conversationHistory: history });
    
    // 증상도 기록
    symptoms.forEach(symptom => recordSymptom(userId, symptom));
  }
}

// 대화 기록 분석으로 사용자 특성 업데이트
export function updateUserCharacteristicsFromConversations(userId: string): void {
  const profile = users.get(userId);
  if (!profile || !profile.conversationHistory) return;
  
  const history = profile.conversationHistory;
  
  // 자주 나타나는 증상으로 체질 추론
  const symptomFrequency: { [key: string]: number } = {};
  history.forEach(conv => {
    conv.symptoms.forEach(symptom => {
      symptomFrequency[symptom] = (symptomFrequency[symptom] || 0) + 1;
    });
  });
  
  // 자주 나타나는 증상들
  const frequentSymptoms = Object.entries(symptomFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([symptom]) => symptom);
  
  // 체질 분석 업데이트
  let newBodyType = profile.bodyType || "평상형";
  
  if (frequentSymptoms.some(s => s.includes("알레르기") || s.includes("민감"))) {
    newBodyType = "민감형";
  } else if (frequentSymptoms.some(s => s.includes("만성") || s.includes("관리"))) {
    newBodyType = "관리형";
  } else if (history.length > 5) {
    // 충분한 대화 기록이 있으면 더 정확한 체질 분석
    const allSymptoms = history.flatMap(conv => conv.symptoms);
    const uniqueSymptoms = Array.from(new Set(allSymptoms));
    
    if (uniqueSymptoms.length > 5) {
      newBodyType = "복합형";
    }
  }
  
  if (newBodyType !== profile.bodyType) {
    updateUserProfile(userId, { bodyType: newBodyType });
  }
  
  // 자주 추천되는 약 성분 파악
  const ingredientPreferences: { [key: string]: number } = {};
  history.forEach(conv => {
    conv.recommendedMedications?.forEach(medName => {
      // 약 이름에서 성분 추론 (실제로는 medications.ts에서 가져와야 함)
      if (medName.includes("타이레놀")) {
        ingredientPreferences["파라세타몰"] = (ingredientPreferences["파라세타몰"] || 0) + 1;
      }
    });
  });
  
  // 선호 성분 업데이트
  if (Object.keys(ingredientPreferences).length > 0) {
    const preferredIngredients = Object.entries(ingredientPreferences)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([ingredient]) => ingredient);
    
    updateUserProfile(userId, {
      preferences: {
        ...profile.preferences,
        preferNatural: false, // 필요시 대화에서 추론
      },
    });
  }
}

// 사용자 체질 분석
export function analyzeBodyType(profile: UserProfile): string {
  const conditions = profile.chronicConditions || [];
  const symptoms = profile.previousSymptoms || [];
  const history = profile.medicationHistory || [];
  
  // 체질 추론 로직
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

// 모든 사용자 가져오기
export function getAllUsers(): UserProfile[] {
  return Array.from(users.values());
}

// 로그인 인증
export function authenticateUser(username: string, password: string): UserProfile | null {
  // 간단한 인증 로직 (실제로는 해시된 비밀번호 비교)
  const credentials: { [key: string]: { userId: string; password: string } } = {
    "hong": { userId: "user001", password: "password123" },
    "홍길동": { userId: "user001", password: "password123" },
    "kim": { userId: "user002", password: "password123" },
    "김민수": { userId: "user002", password: "password123" },
    "lee": { userId: "user003", password: "password123" },
    "이영희": { userId: "user003", password: "password123" }
  };

  const cred = credentials[username.toLowerCase()];
  
  if (cred && cred.password === password) {
    return getUserProfile(cred.userId) || null;
  }

  return null;
}

// Google OAuth 사용자 생성 또는 가져오기
export function getOrCreateGoogleUser(userId: string, email: string, name: string): UserProfile {
  let user = getUserProfile(userId);
  
  if (!user) {
    // 새 사용자 생성
    user = {
      userId: userId,
      username: name,
      age: undefined,
      allergies: [],
      chronicConditions: [],
      currentMedications: [],
      bodyType: "평상형",
      previousSymptoms: [],
      medicationHistory: [],
    };
    users.set(userId, user);
  } else {
    // 기존 사용자 정보 업데이트
    updateUserProfile(userId, {
      username: name,
    });
    user = getUserProfile(userId)!;
  }
  
  return user;
}


