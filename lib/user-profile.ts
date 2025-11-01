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
}

// 간단한 인메모리 저장소 (실제로는 데이터베이스 사용)
const users: Map<string, UserProfile> = new Map();

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



