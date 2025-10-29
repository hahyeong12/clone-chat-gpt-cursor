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


