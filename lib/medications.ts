// 의약품 데이터베이스
export interface Medication {
  id: string;
  name: string;
  category: string;
  symptoms: string[]; // 치료 가능한 증상들
  ingredients: string[];
  dosage: string;
  warnings: string[];
  caution?: string; // 특정 체질에 대한 주의사항
}

export const medications: Medication[] = [
  // 두통 관련
  {
    id: "med_001",
    name: "타이레놀정",
    category: "진통제",
    symptoms: ["두통", "두통_경증", "열"],
    ingredients: ["아세트아미노펜"],
    dosage: "성인 1회 1-2정, 1일 3-4회",
    warnings: ["과다복용 금지", "간질환 환자 주의"],
    caution: "간 기능 이상 환자는 피하는 것이 좋습니다"
  },
  {
    id: "med_002",
    name: "부스코판정",
    category: "진통제/소염제",
    symptoms: ["두통", "두통_중증", "생리통"],
    ingredients: ["부파레놀", "카페인"],
    dosage: "성인 1회 1정, 1일 3회",
    warnings: ["위장 장애 환자 주의", "임신 초기 금지"],
    caution: "위장이 약한 분은 식후 복용하세요"
  },
  // 소화기관
  {
    id: "med_003",
    name: "가스모틴정",
    category: "소화제",
    symptoms: ["소화불량", "복부팽만", "메스꺼움", "복통"],
    ingredients: ["모사프리드"],
    dosage: "성인 1회 1정, 식전",
    warnings: ["어지러움 경향 주의"],
    caution: "체질적으로 어지러움을 잘 느끼는 분은 주의"
  },
  {
    id: "med_009",
    name: "불스피린정",
    category: "진통제/소염제",
    symptoms: ["복통", "위통", "생리통"],
    ingredients: ["이부프로펜"],
    dosage: "성인 1회 1정, 식후 복용",
    warnings: ["위장 장애 환자 주의", "관절염 환자 주의"],
    caution: "위장이 약한 분은 식후 필수 복용"
  },
  {
    id: "med_004",
    name: "판콜에이내복액",
    category: "감기약",
    symptoms: ["기침", "가래", "콧물"],
    ingredients: ["아세트아미노펜", "클로르페니라민", "덱스트로메토르판"],
    dosage: "성인 1회 10ml, 1일 3회",
    warnings: ["운전금지", "수면유발"],
    caution: "운전이 많으신 분은 피하는 것이 좋습니다"
  },
  // 근육통
  {
    id: "med_005",
    name: "겔포스정",
    category: "근육이완제",
    symptoms: ["근육통", "견관절통", "등허리통"],
    ingredients: ["클로르족사존"],
    dosage: "성인 1회 1정, 1일 2-3회",
    warnings: ["졸음 경향", "운전금지"],
    caution: "중추신경계 민감한 분은 주의"
  },
  // 수면
  {
    id: "med_006",
    name: "필로덤정",
    category: "수면보조제",
    symptoms: ["불면증", "수면장애"],
    ingredients: ["트리아졸람"],
    dosage: "성인 취침 전 1정",
    warnings: ["의존성 주의", "성격변화 주의"],
    caution: "중추신경계 약한 분은 반복 복용 주의"
  },
  // 비염
  {
    id: "med_007",
    name: "지르텍정",
    category: "항히스타민제",
    symptoms: ["비염", "재채기", "눈가려움"],
    ingredients: ["세티리진"],
    dosage: "성인 1회 1정, 1일 1회",
    warnings: ["졸음", "구강건조"],
    caution: "운전 시 주의가 필요합니다"
  },
  // 위산과다
  {
    id: "med_008",
    name: "제산제게일정",
    category: "제산제",
    symptoms: ["속쓰림", "위산과다", "소화불량"],
    ingredients: ["알루미늄", "마그네슘"],
    dosage: "성인 1회 1정, 필요시",
    warnings: ["변비 경향"],
    caution: "변비가 있는 분은 사용 시 주의"
  },
  // 치통
  {
    id: "med_010",
    name: "오라나민정",
    category: "진통제/소염제",
    symptoms: ["치통", "이빨", "이 아"],
    ingredients: ["아세트아미노펜", "이부프로펜"],
    dosage: "성인 1회 1정, 식후",
    warnings: ["위장 장애 환자 주의"],
    caution: "상처가 심한 경우 치과 방문 권장"
  },
  // 발열/감기
  {
    id: "med_011",
    name: "판콜에이정",
    category: "감기약",
    symptoms: ["감기", "콧물", "재채기", "발열"],
    ingredients: ["아세트아미노펜", "클로르페니라민"],
    dosage: "성인 1회 2정, 1일 3-4회",
    warnings: ["운전금지", "졸음 유발"],
    caution: "운전 전 복용 금지"
  },
  {
    id: "med_012",
    name: "락트린정",
    category: "소화제",
    symptoms: ["설사", "변", "복통"],
    ingredients: ["염산로페라마이드"],
    dosage: "성인 1회 2정, 1일 3회",
    warnings: ["48시간 지속 시 병원 방문"],
    caution: "만성 설사는 의사 상담 필요"
  },
  // 생리통
  {
    id: "med_013",
    name: "포비돈정",
    category: "진통제",
    symptoms: ["생리통", "생리", "배 아", "복통"],
    ingredients: ["나프록센"],
    dosage: "성인 1회 1정, 식후",
    warnings: ["위장 장애 환자 주의"],
    caution: "생리 시작 시 미리 복용하는 것이 효과적"
  },
  // 코막힘
  {
    id: "med_014",
    name: "프로스팬시럽",
    category: "거담제",
    symptoms: ["가래", "기침", "기", "콧물"],
    ingredients: ["헤데라"],
    dosage: "성인 1회 10ml, 1일 3회",
    warnings: ["과다복용 주의"],
    caution: "가래 묽게 만들어주는 약"
  },
  // 변비
  {
    id: "med_015",
    name: "락투로즈정",
    category: "변비제",
    symptoms: ["변비", "배변", "변 없"],
    ingredients: ["락툴로스"],
    dosage: "성인 1회 1정, 식후",
    warnings: ["과다복용 주의"],
    caution: "복용 후 수분 섭취 필요"
  },
  // 어지러움
  {
    id: "med_016",
    name: "베타히스틴정",
    category: "어지럼증 치료제",
    symptoms: ["어지러움", "현기", "멀미"],
    ingredients: ["베타히스틴"],
    dosage: "성인 1회 1정, 1일 3회",
    warnings: ["과민반응 주의"],
    caution: "멀미 방지에는 뇌관절방지약 권장"
  },
  // 스트레스/우울
  {
    id: "med_017",
    name: "자로스정",
    category: "진정제",
    symptoms: ["불안", "스트레스", "긴장"],
    ingredients: ["히드록시진"],
    dosage: "성인 1회 1정, 필요시",
    warnings: ["졸음 유발", "운전금지"],
    caution: "차량 운전 전 복용 금지"
  },
  // 피부 가려움
  {
    id: "med_018",
    name: "레오틴크림",
    category: "연고/크림",
    symptoms: ["가려움", "피부", "발진"],
    ingredients: ["덱사메타손"],
    dosage: "연고 도포, 1일 2-3회",
    warnings: ["습포 시간 주의"],
    caution: "피부가 약한 부위는 얇게 바르세요"
  },
  // 구내염
  {
    id: "med_019",
    name: "우리나스프레이",
    category: "구강약",
    symptoms: ["구내염", "입 안", "입아"],
    ingredients: ["클로르헥시딘"],
    dosage: "식후 한 번, 하루 3-4회",
    warnings: ["삼키지 마세요"],
    caution: "영양분 섭취 부족 시 병원 방문"
  },
  // 위염
  {
    id: "med_020",
    name: "가스마시정",
    category: "위장약",
    symptoms: ["위염", "위 아파", "위가아"],
    ingredients: ["스즈클로필레이트"],
    dosage: "성인 1회 1정, 식전",
    warnings: ["가스 축적 주의"],
    caution: "규칙적 식사가 중요합니다"
  }
];

// 증상에서 약 추천
export function recommendMedication(symptoms: string[], userProfile?: {
  allergies?: string[];
  chronicConditions?: string[];
  medications?: string[];
}): Medication[] {
  const recommendations: Medication[] = [];
  
  for (const med of medications) {
    // 증상 매칭
    const hasMatch = symptoms.some(symptom => 
      med.symptoms.some(s => s.includes(symptom) || symptom.includes(s))
    );
    
    if (hasMatch) {
      // 사용자 프로필과 호환성 체크
      let isCompatible = true;
      let warnings: string[] = [];
      
      // 알레르기 체크
      if (userProfile?.allergies) {
        med.ingredients.forEach(ingredient => {
          if (userProfile.allergies!.some(allergen => 
            ingredient.toLowerCase().includes(allergen.toLowerCase())
          )) {
            isCompatible = false;
            warnings.push("알레르기 성분 포함");
          }
        });
      }
      
      // 만성 질환 체크
      if (userProfile?.chronicConditions) {
        userProfile.chronicConditions.forEach(condition => {
          if (med.caution && med.caution.toLowerCase().includes(condition.toLowerCase())) {
            warnings.push("질환 관련 주의사항 있음");
          }
        });
      }
      
      recommendations.push({
        ...med,
        warnings: [...med.warnings, ...warnings]
      });
    }
  }
  
  return recommendations;
}

// 증상 추출 함수
export function extractSymptomsFromText(text: string): string[] {
  const symptomKeywords: { [key: string]: string[] } = {
    "두통": ["두통", "머리 아", "머리아파", "두통있", "두통 발생"],
    "소화불량": ["소화불량", "소화 안", "더부", "트림", "가스"],
    "기침": ["기침", "기케기켰", "기캬"],
    "근육통": ["근육통", "근육 아", "목 아", "어깨 아", "허리 아"],
    "불면증": ["불면", "잠 안", "수면장애", "잠 못"],
    "비염": ["콧물", "재채기", "코막힘", "비염", "알레르기 비염"],
    "위산과다": ["속쓰림", "위산", "위 아", "명치", "가슴 쓰"],
    "메스꺼움": ["메스", "구토", "토할 것", "토"],
    "열": ["열", "발열", "열 나", "체열", "온도"]
  };
  
  const foundSymptoms: string[] = [];
  
  for (const [symptom, keywords] of Object.entries(symptomKeywords)) {
    if (keywords.some(keyword => text.toLowerCase().includes(keyword))) {
      foundSymptoms.push(symptom);
    }
  }
  
  return foundSymptoms;
}


