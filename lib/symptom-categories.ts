// 증상별 카테고리 및 약 추천 구조

export interface DetailedSymptom {
  id: string;
  title: string; // "어디가 어떻게 아플 때"
  description?: string;
  medications: string[]; // 약 ID 배열
}

export interface SymptomCategory {
  id: string;
  title: string; // "머리가 아플 때"
  icon?: string;
  detailedSymptoms: DetailedSymptom[];
}

export interface MedicationDetail {
  id: string;
  name: string;
  category: string;
  characteristics: string; // 특징
  effects: string[]; // 효과
  dosage: {
    method: string; // 복용법
    timing: string; // 복용 시간
    frequency: string; // 복용 횟수
  };
  sideEffects: string[]; // 부작용
  precautions: string[]; // 주의사항
  ingredients: string[];
  duration?: string; // 효과 지속 시간
  comparisonNote?: string; // 다른 약과의 비교 설명 (예: "효과가 확실하지만 맛이 쓰고 부작용이 심할 수 있다")
  ageRestrictions?: {
    infant?: string; // 유아기 (0-2세) 복용 가능 여부 및 주의사항
    child?: string; // 소아기 (3-12세) 복용 가능 여부 및 주의사항
    elderly?: string; // 노년기 (65세 이상) 복용 가능 여부 및 주의사항
  };
  ageAlternatives?: {
    infant?: string[]; // 유아기 대체 약 ID
    elderly?: string[]; // 노년기 대체 약 ID
  };
}

// 인체 해부학적 분류에 따른 신체 부위 체계화
// 1. 머리 및 두경부 (Head & Neck)
// 2. 목 (Neck/경부)
// 3. 상지 (Upper Limb): 어깨, 팔, 손
// 4. 흉부 (Thorax): 가슴, 등 윗부분
// 5. 척추 (Spine): 경추, 흉추, 요추
// 6. 복부 (Abdomen): 배, 생식기
// 7. 하지 (Lower Limb): 다리, 발
// 8. 피부 (Skin)
// 9. 감각기관: 귀, 눈 등

export const symptomCategories: SymptomCategory[] = [
  // 1. 머리 및 두경부
  {
    id: "headache",
    title: "머리가 아플 때",
    icon: "🤕",
    detailedSymptoms: [
      {
        id: "headache-mild",
        title: "가볍게 두통이 있을 때",
        description: "스트레스, 피로로 인한 경미한 두통",
        medications: ["med_001", "med_002"]
      },
      {
        id: "headache-severe",
        title: "심하게 두통이 있을 때",
        description: "찌르는 듯한 통증, 편두통",
        medications: ["med_002", "med_001"]
      },
      {
        id: "headache-with-fever",
        title: "열이 나면서 두통이 있을 때",
        description: "감기나 인플루엔자로 인한 두통",
        medications: ["med_001", "med_011"]
      },
      {
        id: "headache-after-sleep",
        title: "잠을 못 자서 두통이 있을 때",
        description: "불면증으로 인한 두통",
        medications: ["med_001", "med_006"]
      }
    ]
  },
  // 2. 목 (경부)
  {
    id: "neck-pain",
    title: "목이 아플 때",
    icon: "🗣️",
    detailedSymptoms: [
      {
        id: "neck-stiffness",
        title: "목이 뻣뻣할 때",
        description: "목 경직, 움직임 불편",
        medications: ["med_005", "med_009"]
      },
      {
        id: "neck-muscle-pain",
        title: "목 근육이 아플 때",
        description: "목 근육통, 뒷목 뻐근함",
        medications: ["med_005", "med_009"]
      },
      {
        id: "neck-cervical-pain",
        title: "경추가 아플 때",
        description: "경추 디스크, 목 척추 통증",
        medications: ["med_005", "med_009"]
      }
    ]
  },
  // 3. 상지 - 어깨
  // 어깨 붕대: 🩹 (붕대) + 💪 (팔근육) 조합, 또는 🤕 (머리 붕대 - 어깨 부상 연상)
  {
    id: "shoulder-pain",
    title: "어깨가 아플 때",
    icon: "🤕",
    detailedSymptoms: [
      {
        id: "shoulder-stiffness",
        title: "어깨가 결릴 때",
        description: "오십견, 어깨 결림, 어깨 뻐근함",
        medications: ["med_005", "med_009"]
      },
      {
        id: "shoulder-joint-pain",
        title: "어깨 관절이 아플 때",
        description: "어깨 관절 통증, 회전근개 손상",
        medications: ["med_009", "med_005"]
      },
      {
        id: "shoulder-muscle-pain",
        title: "어깨 근육이 아플 때",
        description: "어깨 근육통, 어깨 근육 피로",
        medications: ["med_005", "med_009"]
      }
    ]
  },
  // 3. 상지 - 팔
  {
    id: "arm-pain",
    title: "팔이 아플 때",
    icon: "💪",
    detailedSymptoms: [
      {
        id: "arm-muscle-pain",
        title: "팔 근육이 아플 때",
        description: "팔 근육통, 근육 피로",
        medications: ["med_005", "med_009"]
      },
      {
        id: "arm-elbow-pain",
        title: "팔꿈치가 아플 때",
        description: "테니스 엘보, 골프 엘보, 팔꿈치 관절 통증",
        medications: ["med_009", "med_005"]
      },
      {
        id: "arm-upper-pain",
        title: "팔 윗부분이 아플 때",
        description: "상완 통증, 팔 윗부분 근육통",
        medications: ["med_005", "med_009"]
      }
    ]
  },
  // 4. 흉부
  {
    id: "chest-pain",
    title: "가슴이 아플 때",
    icon: "❤️",
    detailedSymptoms: [
      {
        id: "chest-acid",
        title: "가슴이 쓰릴 때",
        description: "위산 역류로 인한 가슴 쓰림",
        medications: ["med_008", "med_003"]
      },
      {
        id: "chest-tightness",
        title: "가슴이 답답할 때",
        description: "호흡 곤란, 가슴 압박감",
        medications: ["med_008", "med_004"]
      }
    ]
  },
  // 5. 척추 (Spine) - 경추, 흉추, 요추 통합
  // 허리 삐끗 - 손으로 허리 집는 모습: 🤷 (어깨 으쓱 - 손을 몸통 옆으로), 🤲 (손 모으기 - 배/허리 부분 연상)
  // 실제로는 손으로 허리 집는 구체적인 이모티콘이 없음
  {
    id: "back-pain",
    title: "등/허리가 아플 때",
    icon: "🤷",
    detailedSymptoms: [
      {
        id: "spine-cervical",
        title: "목 부분 척추가 아플 때",
        description: "경추 통증, 목 척추 디스크",
        medications: ["med_005", "med_009"]
      },
      {
        id: "back-upper-pain",
        title: "등 윗부분이 아플 때",
        description: "흉추 통증, 등 윗부분 근육통, 뻐근함, 어깨 결림",
        medications: ["med_005", "med_009"]
      },
      {
        id: "back-middle-pain",
        title: "등 중간이 아플 때",
        description: "등 중간 근육통, 척추 주변 통증",
        medications: ["med_005", "med_009"]
      },
      {
        id: "back-lower-pain",
        title: "허리가 아플 때",
        description: "요추 통증, 요통, 허리 디스크",
        medications: ["med_005", "med_009"]
      },
      {
        id: "back-whole-pain",
        title: "척추 전체가 아플 때",
        description: "척추 전체 통증, 등 전체 근육통",
        medications: ["med_005", "med_009"]
      }
    ]
  },
  // 6. 복부
  // 볼록 나온 배: 🤰 (임산부 - 볼록한 배 표현), 또는 실제 이미지 필요
  {
    id: "stomach-pain",
    title: "배가 아플 때",
    icon: "🤰",
    detailedSymptoms: [
      {
        id: "stomach-digestion",
        title: "소화가 안 될 때",
        description: "소화불량, 더부룩함, 트림",
        medications: ["med_003", "med_008"]
      },
      {
        id: "stomach-cramp",
        title: "배가 쥐어짜는 듯 아플 때",
        description: "복통, 복부 경련",
        medications: ["med_003", "med_009"]
      },
      {
        id: "stomach-acid",
        title: "속이 쓰릴 때",
        description: "위산과다, 속쓰림",
        medications: ["med_008", "med_003"]
      },
      {
        id: "stomach-nausea",
        title: "메스꺼울 때",
        description: "구역질, 토할 것 같음",
        medications: ["med_003", "med_008"]
      },
      {
        id: "stomach-diarrhea",
        title: "설사가 날 때",
        description: "변을 자주 봄, 복통과 함께 설사",
        medications: ["med_012", "med_003"]
      },
      {
        id: "stomach-constipation",
        title: "변비가 있을 때",
        description: "배변 없음, 배가 부르고 답답함",
        medications: ["med_015", "med_003"]
      },
      {
        id: "stomach-menstrual",
        title: "생리통이 있을 때",
        description: "생리 중 하복부 통증",
        medications: ["med_013", "med_002"]
      }
    ]
  },
  // 1. 머리 및 두경부 - 구강
  {
    id: "tooth-pain",
    title: "이가 아플 때",
    icon: "🦷",
    detailedSymptoms: [
      {
        id: "tooth-pain-mild",
        title: "이가 시릴 때",
        description: "찬 음식에 이가 시림",
        medications: ["med_001", "med_010"]
      },
      {
        id: "tooth-pain-severe",
        title: "이가 심하게 아플 때",
        description: "지속적인 치통",
        medications: ["med_010", "med_002"]
      },
      {
        id: "mouth-ulcer",
        title: "입 안이 아플 때",
        description: "구내염, 입 안 상처",
        medications: ["med_019", "med_010"]
      }
    ]
  },
  // 2. 목 (인후부)
  {
    id: "throat-pain",
    title: "목 안쪽이 아플 때",
    icon: "🗣️",
    detailedSymptoms: [
      {
        id: "throat-cough",
        title: "기침이 날 때",
        description: "마른기침, 가래가 있는 기침",
        medications: ["med_004", "med_014"]
      },
      {
        id: "throat-sore",
        title: "인후통이 있을 때",
        description: "목 안쪽 통증, 인후염",
        medications: ["med_004", "med_011"]
      },
      {
        id: "throat-phlegm",
        title: "가래가 많을 때",
        description: "가래 배출 필요",
        medications: ["med_014", "med_004"]
      }
    ]
  },
  {
    id: "cold-symptoms",
    title: "감기 증상이 있을 때",
    icon: "🤧",
    detailedSymptoms: [
      {
        id: "cold-runny-nose",
        title: "콧물이 날 때",
        description: "코막힘, 콧물, 재채기",
        medications: ["med_011", "med_007"]
      },
      {
        id: "cold-fever",
        title: "열이 날 때",
        description: "발열, 오한, 두통",
        medications: ["med_001", "med_011"]
      },
      {
        id: "cold-cough",
        title: "기침과 콧물이 함께",
        description: "감기로 인한 복합 증상",
        medications: ["med_004", "med_011"]
      }
    ]
  },
  {
    id: "sleep-issues",
    title: "잠이 안 올 때",
    icon: "😴",
    detailedSymptoms: [
      {
        id: "sleep-insomnia",
        title: "불면증이 있을 때",
        description: "잠이 오지 않음",
        medications: ["med_006", "med_001"]
      },
      {
        id: "sleep-stress",
        title: "스트레스로 잠이 안 올 때",
        description: "불안, 긴장으로 인한 불면",
        medications: ["med_017", "med_006"]
      }
    ]
  },
  {
    id: "dizziness",
    title: "어지러울 때",
    icon: "😵‍💫",
    detailedSymptoms: [
      {
        id: "dizziness-general",
        title: "일반적인 어지러움",
        description: "현기증, 멀미",
        medications: ["med_016", "med_003"]
      },
      {
        id: "dizziness-motion-sickness",
        title: "멀미가 날 때",
        description: "차량 멀미, 배멀미",
        medications: ["med_016", "med_003"]
      }
    ]
  },
  {
    id: "leg-pain",
    title: "다리가 아플 때",
    icon: "🦵",
    detailedSymptoms: [
      {
        id: "leg-knee-pain",
        title: "무릎이 아플 때",
        description: "무릎 관절 통증, 무릎 부위 아픔",
        medications: ["med_009", "med_005"]
      },
      {
        id: "leg-muscle-pain",
        title: "다리 근육이 아플 때",
        description: "종아리, 허벅지 근육통",
        medications: ["med_005", "med_009"]
      },
      {
        id: "leg-joint-pain",
        title: "다리 관절이 아플 때",
        description: "발목, 무릎 관절 통증",
        medications: ["med_009", "med_005"]
      },
      {
        id: "leg-numbness",
        title: "다리가 저릴 때",
        description: "저림, 마비감, 혈행 불량",
        medications: ["med_005", "med_016"]
      }
    ]
  },
  // 7. 하지 - 발
  {
    id: "foot-pain",
    title: "발이 아플 때",
    icon: "🦶",
    detailedSymptoms: [
      {
        id: "foot-ankle-pain",
        title: "발목이 아플 때",
        description: "발목 통증, 발목 염좌",
        medications: ["med_009", "med_005"]
      },
      {
        id: "foot-sole-pain",
        title: "발바닥이 아플 때",
        description: "족저근막염, 발바닥 통증",
        medications: ["med_009", "med_005"]
      },
      {
        id: "foot-toe-pain",
        title: "발가락이 아플 때",
        description: "발가락 관절 통증, 염좌",
        medications: ["med_009", "med_005"]
      }
    ]
  },
  // 3. 상지 - 손
  {
    id: "hand-pain",
    title: "손이 아플 때",
    icon: "✋",
    detailedSymptoms: [
      {
        id: "hand-joint-pain",
        title: "손 관절이 아플 때",
        description: "손목, 손가락 관절 통증",
        medications: ["med_009", "med_005"]
      },
      {
        id: "hand-wrist-pain",
        title: "손목이 아플 때",
        description: "손목 통증, 손목 인대 염좌",
        medications: ["med_009", "med_005"]
      },
      {
        id: "hand-numbness",
        title: "손이 저릴 때",
        description: "손 저림, 손목터널증후군",
        medications: ["med_005", "med_016"]
      }
    ]
  },
  {
    id: "skin-issues",
    title: "피부가 아플 때",
    icon: "🩹",
    detailedSymptoms: [
      {
        id: "skin-rash",
        title: "발진이 날 때",
        description: "피부 발진, 알레르기 반응",
        medications: ["med_007", "med_001"]
      },
      {
        id: "skin-itchy",
        title: "피부가 가려울 때",
        description: "가려움, 알레르기",
        medications: ["med_007", "med_001"]
      },
      {
        id: "skin-allergy",
        title: "알레르기 반응이 있을 때",
        description: "알레르기성 피부염",
        medications: ["med_007"]
      }
    ]
  },
  {
    id: "ear-pain",
    title: "귀가 아플 때",
    icon: "👂",
    detailedSymptoms: [
      {
        id: "ear-ache",
        title: "귀가 아플 때",
        description: "중이염, 귀 통증",
        medications: ["med_001", "med_010"]
      },
      {
        id: "ear-ringing",
        title: "귀울림이 있을 때",
        description: "이명, 귀에서 소리가 남",
        medications: ["med_016", "med_001"]
      }
    ]
  },
  // 10. 안과 (서울대 보건진료소 진료과 기반)
  {
    id: "eye-pain",
    title: "눈이 아플 때",
    icon: "👁️",
    detailedSymptoms: [
      {
        id: "eye-dryness",
        title: "눈이 건조할 때",
        description: "안구건조증, 눈 피로, 시력 저하",
        medications: ["med_020", "med_021"]
      },
      {
        id: "eye-conjunctivitis",
        title: "결막염이 있을 때",
        description: "눈 충혈, 눈물, 가려움, 분비물",
        medications: ["med_021", "med_020"]
      },
      {
        id: "eye-fatigue",
        title: "눈이 피로할 때",
        description: "컴퓨터 시야증후군, 눈 피로감",
        medications: ["med_020", "med_021"]
      },
      {
        id: "eye-itchy",
        title: "눈이 가려울 때",
        description: "알레르기성 결막염, 눈 가려움",
        medications: ["med_021", "med_007"]
      }
    ]
  },
  // 11. 피부과 확장 (서울대 보건진료소 진료과 기반)
  {
    id: "skin-acne",
    title: "여드름이 있을 때",
    icon: "😤",
    detailedSymptoms: [
      {
        id: "acne-mild",
        title: "경미한 여드름",
        description: "검은 머리, 하얀 머리 여드름",
        medications: ["med_022", "med_023"]
      },
      {
        id: "acne-inflammatory",
        title: "염증성 여드름",
        description: "빨갛고 아픈 여드름, 농포",
        medications: ["med_022", "med_023"]
      },
      {
        id: "acne-severe",
        title: "심한 여드름",
        description: "여드름 흉터, 낭종성 여드름",
        medications: ["med_023", "med_022"]
      }
    ]
  },
  {
    id: "skin-eczema",
    title: "습진이 있을 때",
    icon: "🩹",
    detailedSymptoms: [
      {
        id: "eczema-dry",
        title: "건조한 습진",
        description: "피부 건조, 각질, 가려움",
        medications: ["med_024", "med_007"]
      },
      {
        id: "eczema-itchy",
        title: "가려운 습진",
        description: "심한 가려움, 발진",
        medications: ["med_007", "med_024"]
      },
      {
        id: "eczema-wet",
        title: "습한 습진",
        description: "진물, 염증, 감염 우려",
        medications: ["med_024", "med_025"]
      }
    ]
  },
  // 12. 산부인과 확장 (서울대 보건진료소 진료과 기반)
  {
    id: "gynecological-issues",
    title: "여성 건강 문제",
    icon: "🌸",
    detailedSymptoms: [
      {
        id: "menstrual-irregular",
        title: "생리 불순이 있을 때",
        description: "생리 주기 불규칙, 생리량 이상",
        medications: ["med_013", "med_002"]
      },
      {
        id: "menstrual-pms",
        title: "생리 전 증후군",
        description: "생리 전 불안, 우울, 복통",
        medications: ["med_013", "med_017"]
      },
      {
        id: "vaginal-discharge",
        title: "질 분비물이 이상할 때",
        description: "질염 의심, 분비물 증가, 냄새",
        medications: ["med_026", "med_027"]
      }
    ]
  },
  // 13. 정신건강의학과 확장 (서울대 보건진료소 진료과 기반)
  {
    id: "mental-health",
    title: "정신 건강 문제",
    icon: "🧠",
    detailedSymptoms: [
      {
        id: "depression",
        title: "우울감이 있을 때",
        description: "우울한 기분, 의욕 상실, 무기력",
        medications: ["med_028", "med_017"]
      },
      {
        id: "anxiety",
        title: "불안이 심할 때",
        description: "불안감, 초조함, 걱정 과다",
        medications: ["med_017", "med_028"]
      },
      {
        id: "stress-severe",
        title: "스트레스가 심할 때",
        description: "과도한 스트레스, 긴장, 피로",
        medications: ["med_017", "med_006"]
      },
      {
        id: "panic",
        title: "공황 증상이 있을 때",
        description: "공황발작, 호흡곤란, 두근거림",
        medications: ["med_017", "med_028"]
      }
    ]
  },
];

// 약 상세 정보
export const medicationDetails: { [key: string]: MedicationDetail } = {
  "med_001": {
    id: "med_001",
    name: "타이레놀정",
    category: "진통제",
    characteristics: "아세트아미노펜 성분의 안전한 진통제로 위장 자극이 적고 해열 효과가 뛰어납니다.",
    comparisonNote: "위장이 약하거나 속 쓰림을 원하지 않는 분에게 추천. 효과는 확실하지만 맛이 약간 쓰고, 과다복용 시 간 손상 위험이 있습니다.",
    effects: [
      "두통 완화",
      "발열 감소",
      "가벼운 근육통 완화",
      "위장 자극 최소화"
    ],
    dosage: {
      method: "물과 함께 복용",
      timing: "식후 30분 또는 필요시",
      frequency: "1회 1-2정, 1일 3-4회 (최대 1일 8정)"
    },
    sideEffects: [
      "드물게 피부 발진",
      "과다복용 시 간 손상 가능성",
      "드물게 알레르기 반응"
    ],
    precautions: [
      "간질환 환자는 의사와 상담 후 복용",
      "1일 최대 4g 초과 금지",
      "알코올과 함께 복용 금지",
      "임신 중 복용 전 의사 상담 필요"
    ],
    ingredients: ["아세트아미노펜"],
    duration: "복용 후 30분~1시간에 효과 시작, 4-6시간 지속",
    ageRestrictions: {
      infant: "유아(0-2세)는 체중에 따라 용량 조절 필요. 의사 처방 필수",
      child: "소아(3-12세)는 성인 용량의 절반 이하로 복용. 체중에 따라 용량 조절",
      elderly: "노년기(65세 이상)는 간 기능 저하 가능성 고려하여 용량 25% 감소 권장"
    },
    ageAlternatives: {
      infant: ["med_001"], // 유아기에는 동일 약이지만 용량만 조절
      elderly: ["med_001"] // 노년기에도 동일 약이지만 용량 조절 필요
    }
  },
  "med_002": {
    id: "med_002",
    name: "부스코판정",
    category: "진통제/소염제",
    characteristics: "부파레놀과 카페인 복합제로 심한 두통과 생리통에 효과적이며, 카페인으로 효과가 빠르게 나타납니다.",
    comparisonNote: "심한 두통이나 생리통이 있을 때 효과가 빠르고 강력합니다. 하지만 위장 장애 위험이 있고, 저녁 복용 시 불면증을 유발할 수 있어 주의가 필요합니다.",
    effects: [
      "중증 두통 완화",
      "생리통 완화",
      "항염 작용",
      "카페인으로 인한 각성 효과"
    ],
    dosage: {
      method: "물과 함께 복용",
      timing: "식후 30분 권장",
      frequency: "1회 1정, 1일 3회 (최대 1일 3정)"
    },
    sideEffects: [
      "위장 장애 (소화불량, 속쓰림)",
      "두통 재발 (약물 남용 시)",
      "불면증 (저녁 복용 시)",
      "드물게 알레르기 반응"
    ],
    precautions: [
      "위장이 약한 분은 식후 필수 복용",
      "임신 초기(1-3개월) 복용 금지",
      "고혈압 환자는 의사 상담 필요",
      "카페인 민감자는 저녁 복용 피하기",
      "연속 복용 시 10일 이내 권장"
    ],
    ingredients: ["부파레놀", "카페인"],
    duration: "복용 후 20-30분에 효과 시작, 4-6시간 지속",
    ageRestrictions: {
      infant: "유아기(0-2세) 복용 금지. 카페인 성분으로 인해 신경계 자극 위험",
      child: "소아기(3-12세)는 카페인 성분으로 인해 주의 필요. 의사 상담 권장",
      elderly: "노년기(65세 이상)는 위장 장애 위험 증가, 고혈압 환자 주의 필요"
    },
    ageAlternatives: {
      infant: ["med_001"], // 유아기에는 타이레놀 추천
      elderly: ["med_001"] // 노년기에는 타이레놀이 더 안전
    }
  },
  "med_003": {
    id: "med_003",
    name: "가스모틴정",
    category: "소화제",
    characteristics: "위장 운동 촉진제로 소화 불량과 메스꺼움에 효과적이며, 위장 배출을 촉진합니다.",
    comparisonNote: "소화 불량과 메스꺼움에 빠르고 확실한 효과를 보입니다. 하지만 드물게 어지러움을 일으킬 수 있어 운전 전 복용은 피하는 것이 좋습니다.",
    effects: [
      "소화 불량 개선",
      "메스꺼움 완화",
      "위장 운동 촉진",
      "복부 팽만 완화"
    ],
    dosage: {
      method: "물과 함께 복용",
      timing: "식전 15-30분",
      frequency: "1회 1정, 1일 3회"
    },
    sideEffects: [
      "드물게 어지러움",
      "드물게 두통",
      "드물게 설사",
      "드물게 피부 발진"
    ],
    precautions: [
      "식전 복용 권장 (효과 극대화)",
      "어지러움을 잘 느끼는 분은 주의",
      "운전 전 복용 시 주의",
      "소화관 협착 환자는 복용 금지"
    ],
    ingredients: ["모사프리드"],
    duration: "복용 후 30분~1시간에 효과 시작, 식사 중 효과 지속",
    ageRestrictions: {
      infant: "유아기(0-2세)는 어지러움 부작용 위험으로 복용 금지",
      child: "소아기(3-12세)는 용량 조절 필요",
      elderly: "노년기(65세 이상)는 어지러움으로 인한 낙상 위험 증가, 용량 50% 감소 권장"
    },
    ageAlternatives: {
      infant: ["med_008"], // 유아기에는 제산제가 더 안전
      elderly: ["med_008"] // 노년기에는 제산제가 더 안전
    }
  },
  "med_004": {
    id: "med_004",
    name: "판콜에이내복액",
    category: "감기약",
    characteristics: "감기 증상 복합 치료제로 기침, 가래, 콧물, 발열을 동시에 완화합니다.",
    comparisonNote: "액체 형태로 복용이 쉽고 기침, 가래, 콧물 등 감기 증상을 한 번에 해결할 수 있습니다. 하지만 졸음이 심하고 운전 능력이 저하되므로, 운전이나 중요한 업무 전 복용은 피해야 합니다.",
    effects: [
      "기침 완화",
      "가래 배출 촉진",
      "콧물 감소",
      "발열 감소"
    ],
    dosage: {
      method: "액체를 그대로 복용",
      timing: "식후 30분",
      frequency: "1회 10ml, 1일 3회"
    },
    sideEffects: [
      "졸음 (클로르페니라민 성분)",
      "구강건조",
      "드물게 어지러움",
      "드물게 위장 장애"
    ],
    precautions: [
      "운전 전 복용 절대 금지",
      "알코올과 함께 복용 금지",
      "수면제와 함께 복용 시 주의",
      "노인 환자는 복용량 조절 필요"
    ],
    ingredients: ["아세트아미노펜", "클로르페니라민", "덱스트로메토르판"],
    duration: "복용 후 30분~1시간에 효과 시작, 4-6시간 지속",
    ageRestrictions: {
      infant: "유아기(0-2세)는 클로르페니라민으로 인한 졸음 과다 위험, 복용량 25% 권장",
      child: "소아기(3-12세)는 체중에 따라 용량 조절 필요",
      elderly: "노년기(65세 이상)는 졸음 부작용 심화, 낙상 위험 증가로 용량 50% 감소 필요"
    },
    ageAlternatives: {
      infant: ["med_001"], // 유아기에는 타이레놀만 단독 사용 권장
      elderly: ["med_001"] // 노년기에는 졸음 적은 타이레놀 추천
    }
  },
  "med_005": {
    id: "med_005",
    name: "겔포스정",
    category: "근육이완제",
    characteristics: "근육 긴장 완화제로 근육통과 관절통에 효과적이며, 근육 경련을 완화합니다.",
    comparisonNote: "근육통과 관절통에 효과가 뛰어나고 근육 이완 효과가 좋습니다. 하지만 졸음이 오므로 운전이나 위험한 작업 전 복용은 절대 금지입니다.",
    effects: [
      "근육통 완화",
      "근육 경련 완화",
      "관절통 완화",
      "어깨, 목, 허리 통증 완화"
    ],
    dosage: {
      method: "물과 함께 복용",
      timing: "식후 30분",
      frequency: "1회 1정, 1일 2-3회"
    },
    sideEffects: [
      "졸음 (일반적)",
      "어지러움",
      "드물게 구강건조",
      "드물게 두통"
    ],
    precautions: [
      "운전 전 복용 절대 금지",
      "중추신경계 약물과 함께 복용 시 주의",
      "알코올과 함께 복용 금지",
      "장기간 복용 시 의사 상담 필요"
    ],
    ingredients: ["클로르족사존"],
    duration: "복용 후 1-2시간에 효과 시작, 6-8시간 지속",
    ageRestrictions: {
      infant: "유아기(0-2세) 복용 금지. 졸음 부작용이 과도함",
      child: "소아기(3-12세)는 용량 조절 필요하며 의사 상담 필수",
      elderly: "노년기(65세 이상)는 졸음으로 인한 낙상 위험 매우 높음. 용량 50% 감소 필수"
    },
    ageAlternatives: {
      infant: ["med_001"], // 유아기에는 타이레놀 추천
      elderly: ["med_001"] // 노년기에는 졸음 적은 타이레놀 추천
    }
  },
  "med_006": {
    id: "med_006",
    name: "필로덤정",
    category: "수면보조제",
    characteristics: "단기간 불면증 치료에 사용되는 수면 유도제로 빠른 수면 유도 효과가 있습니다.",
    comparisonNote: "불면증에 즉각적이고 확실한 효과를 보입니다. 하지만 의존성이 생기기 쉬우며, 다음날 잔여 효과(졸음)가 있어 장기 복용은 피해야 합니다.",
    effects: [
      "수면 유도",
      "불면증 완화",
      "빠른 잠들기 효과",
      "수면 시간 연장"
    ],
    dosage: {
      method: "물과 함께 복용",
      timing: "취침 30분 전",
      frequency: "1회 1정, 1일 1회 (최대 1일 1정)"
    },
    sideEffects: [
      "다음날 졸음 (잔여 효과)",
      "기억력 저하 (드물게)",
      "의존성 발생 가능",
      "드물게 두통, 어지러움"
    ],
    precautions: [
      "의사의 처방 없이 장기간 복용 금지",
      "알코올과 절대 함께 복용 금지",
      "연속 복용 시 2주 이내 권장",
      "의존성이 생기기 쉬우므로 주의",
      "운전 또는 위험한 작업 전 복용 금지"
    ],
    ingredients: ["트리아졸람"],
    duration: "복용 후 30분~1시간에 효과 시작, 6-8시간 지속",
    ageRestrictions: {
      infant: "유아기(0-2세) 절대 복용 금지",
      child: "소아기(3-12세) 복용 금지. 의존성 위험 매우 높음",
      elderly: "노년기(65세 이상)는 기억력 저하, 낙상 위험 증가로 용량 50% 감소 필수"
    },
    ageAlternatives: {
      infant: [], // 유아기에는 수면보조제 사용 금지
      elderly: ["med_017"] // 노년기에는 자로스정(경미한 진정제) 추천
    }
  },
  "med_007": {
    id: "med_007",
    name: "지르텍정",
    category: "항히스타민제",
    characteristics: "2세대 항히스타민제로 비염 증상에 효과적이며, 졸음 부작용이 1세대 대비 적습니다.",
    comparisonNote: "비염 증상에 효과적이고 졸음 부작용이 적어 일상 생활에 지장을 덜 줍니다. 하루 1회 복용으로 간편하며, 효과가 24시간 지속됩니다. 하지만 드물게 졸음이 올 수 있으므로 운전 전 복용 시 주의가 필요합니다.",
    effects: [
      "알레르기 비염 증상 완화",
      "재채기 감소",
      "콧물 감소",
      "눈 가려움 완화"
    ],
    dosage: {
      method: "물과 함께 복용",
      timing: "식후 또는 취침 전",
      frequency: "1회 1정, 1일 1회"
    },
    sideEffects: [
      "드물게 졸음 (1세대 대비 적음)",
      "드물게 구강건조",
      "드물게 두통",
      "드물게 위장 장애"
    ],
    precautions: [
      "운전 전 복용 시 주의",
      "임신 중 복용 전 의사 상담 필요",
      "간 기능 이상 환자는 복용량 조절 필요",
      "알코올과 함께 복용 시 졸음 증가 가능"
    ],
    ingredients: ["세티리진"],
    duration: "복용 후 1시간에 효과 시작, 24시간 지속",
    ageRestrictions: {
      infant: "유아기(0-2세)는 용량 조절 필요. 의사 처방 필수",
      child: "소아기(3-12세)는 체중에 따라 용량 조절",
      elderly: "노년기(65세 이상)는 신장 기능 저하 고려하여 용량 25% 감소 권장"
    },
    ageAlternatives: {
      infant: ["med_007"], // 유아기에도 사용 가능하나 용량 조절 필요
      elderly: ["med_007"] // 노년기에도 사용 가능하나 용량 조절 필요
    }
  },
  "med_008": {
    id: "med_008",
    name: "제산제게일정",
    category: "제산제",
    characteristics: "위산 중화제로 속쓰림과 위산과다에 즉각적인 효과를 보이며, 가글 형태로 위장 벽을 보호합니다.",
    comparisonNote: "속쓰림에 즉각적이고 빠른 효과를 보입니다. 부작용이 거의 없고 맛도 부드러워 속 편하게 복용할 수 있지만, 변비 경향이 있는 분은 과다복용을 피해야 합니다.",
    effects: [
      "위산 중화",
      "속쓰림 완화",
      "위장 보호",
      "소화 불량 완화"
    ],
    dosage: {
      method: "씹어서 복용 또는 가글 후 삼킴",
      timing: "식후 1시간 또는 속쓰림 시",
      frequency: "1회 1정, 필요시 1일 최대 6정"
    },
    sideEffects: [
      "변비 (과다복용 시)",
      "드물게 구토",
      "드물게 알레르기 반응"
    ],
    precautions: [
      "변비 경향이 있는 분은 사용량 제한",
      "다른 약과 2시간 간격 두고 복용",
      "신장 질환 환자는 의사 상담 필요",
      "장기간 사용 시 의사 상담 필요"
    ],
    ingredients: ["알루미늄", "마그네슘"],
    duration: "복용 즉시 효과 시작, 2-3시간 지속",
    ageRestrictions: {
      infant: "유아기(0-2세)는 사용 가능하나 용량 조절 필요",
      child: "소아기(3-12세)는 사용 가능하며 안전",
      elderly: "노년기(65세 이상)는 신장 기능 저하 시 알루미늄 축적 위험, 변비 주의 필요"
    },
    ageAlternatives: {
      infant: ["med_008"], // 유아기에도 사용 가능
      elderly: ["med_008"] // 노년기에도 사용 가능하나 주의 필요
    }
  },
  "med_009": {
    id: "med_009",
    name: "불스피린정",
    category: "진통제/소염제",
    characteristics: "이부프로펜 성분의 소염진통제로 염증과 통증을 동시에 완화하며, 생리통과 복통에 효과적입니다.",
    comparisonNote: "염증과 통증에 강력한 효과를 보이며 생리통에 특히 좋습니다. 하지만 위장 장애 위험이 있어 식후 복용이 필수이며, 위장이 약한 분은 주의가 필요합니다.",
    effects: [
      "통증 완화",
      "염증 완화",
      "생리통 완화",
      "복통 완화"
    ],
    dosage: {
      method: "물과 함께 복용",
      timing: "식후 즉시 (위장 보호)",
      frequency: "1회 1정, 1일 3회 (최대 1일 3정)"
    },
    sideEffects: [
      "위장 장애 (위통, 속쓰림)",
      "드물게 어지러움",
      "드물게 두통",
      "드물게 피부 발진"
    ],
    precautions: [
      "식후 필수 복용 (위장 보호)",
      "위궤양 환자는 복용 금지",
      "임신 말기(7-9개월) 복용 금지",
      "신장 기능 이상 환자는 의사 상담 필요",
      "항응고제와 함께 복용 시 주의"
    ],
    ingredients: ["이부프로펜"],
    duration: "복용 후 30분~1시간에 효과 시작, 4-6시간 지속",
    ageRestrictions: {
      infant: "유아기(0-2세) 복용 금지. 위장 자극 및 신장 손상 위험",
      child: "소아기(3-12세)는 용량 조절 필요, 의사 상담 권장",
      elderly: "노년기(65세 이상)는 위장 장애, 신장 기능 저하 위험 증가. 용량 50% 감소 필수"
    },
    ageAlternatives: {
      infant: ["med_001"], // 유아기에는 타이레놀 추천
      elderly: ["med_001"] // 노년기에는 타이레놀이 더 안전
    }
  },
  "med_010": {
    id: "med_010",
    name: "오라나민정",
    category: "진통제/소염제",
    characteristics: "아세트아미노펜과 이부프로펜 복합제로 치통과 같은 심한 통증에 효과적입니다.",
    comparisonNote: "치통과 같은 심한 통증에 강력하고 빠른 효과를 보입니다. 하지만 위장 장애 위험이 있어 식후 복용이 필수이며, 위장이 약한 분이나 임산부는 주의가 필요합니다.",
    effects: [
      "심한 통증 완화",
      "염증 완화",
      "치통 완화",
      "빠른 효과"
    ],
    dosage: {
      method: "물과 함께 복용",
      timing: "식후 30분",
      frequency: "1회 1정, 1일 3회 (최대 1일 3정)"
    },
    sideEffects: [
      "위장 장애",
      "드물게 어지러움",
      "드물게 두통",
      "과다복용 시 간 손상 가능성"
    ],
    precautions: [
      "식후 복용 권장",
      "치과 치료 필요 시 복용과 함께 병원 방문",
      "상처가 심한 경우 즉시 치과 방문 권장",
      "알코올과 함께 복용 금지"
    ],
    ingredients: ["아세트아미노펜", "이부프로펜"],
    duration: "복용 후 20-30분에 효과 시작, 4-6시간 지속",
    ageRestrictions: {
      infant: "유아기(0-2세) 복용 금지. 이부프로펜 성분으로 인한 위장/신장 위험",
      child: "소아기(3-12세)는 용량 조절 필요, 의사 상담 권장",
      elderly: "노년기(65세 이상)는 위장 장애 위험 증가, 용량 50% 감소 필수"
    },
    ageAlternatives: {
      infant: ["med_001"], // 유아기에는 타이레놀 추천
      elderly: ["med_001"] // 노년기에는 타이레놀이 더 안전
    }
  },
  "med_011": {
    id: "med_011",
    name: "판콜에이정",
    category: "감기약",
    characteristics: "감기 증상 완화제로 발열, 콧물, 재채기 등 다양한 감기 증상을 동시에 완화합니다.",
    comparisonNote: "감기 증상을 종합적으로 빠르게 완화시킵니다. 하지만 졸음이 심하고 운전 능력이 저하되므로, 운전이나 중요한 업무가 있는 경우 피해야 합니다.",
    effects: [
      "발열 감소",
      "콧물 감소",
      "재채기 감소",
      "감기 증상 전반 완화"
    ],
    dosage: {
      method: "물과 함께 복용",
      timing: "식후 30분",
      frequency: "1회 2정, 1일 3-4회"
    },
    sideEffects: [
      "졸음 (클로르페니라민 성분)",
      "운전 능력 저하",
      "드물게 구강건조",
      "드물게 위장 장애"
    ],
    precautions: [
      "운전 전 복용 절대 금지",
      "알코올과 함께 복용 금지",
      "수면제와 함께 복용 시 주의",
      "고혈압 약과 함께 복용 시 의사 상담 필요"
    ],
    ingredients: ["아세트아미노펜", "클로르페니라민"],
    duration: "복용 후 30분~1시간에 효과 시작, 4-6시간 지속",
    ageRestrictions: {
      infant: "유아기(0-2세)는 졸음 부작용 심화로 복용량 25% 권장",
      child: "소아기(3-12세)는 체중에 따라 용량 조절 필요",
      elderly: "노년기(65세 이상)는 졸음 부작용 심화, 낙상 위험 증가로 용량 50% 감소 필요"
    },
    ageAlternatives: {
      infant: ["med_001"], // 유아기에는 타이레놀만 단독 사용 권장
      elderly: ["med_001"] // 노년기에는 졸음 적은 타이레놀 추천
    }
  },
  "med_012": {
    id: "med_012",
    name: "락트린정",
    category: "소화제",
    characteristics: "설사 치료제로 장 운동을 조절하여 급성 설사를 빠르게 완화합니다.",
    comparisonNote: "급성 설사에 빠르고 확실한 효과를 보입니다. 부작용이 거의 없고 안전하게 복용할 수 있지만, 만성 설사나 혈변/점액변이 있는 경우에는 즉시 병원을 방문해야 합니다.",
    effects: [
      "설사 완화",
      "장 운동 조절",
      "복통 완화",
      "변비 유발 방지"
    ],
    dosage: {
      method: "물과 함께 복용",
      timing: "설사 시작 시 또는 식후",
      frequency: "1회 2정, 1일 3회 (최대 1일 6정)"
    },
    sideEffects: [
      "드물게 변비",
      "드물게 복부 팽만",
      "드물게 어지러움"
    ],
    precautions: [
      "48시간 이상 지속 시 병원 방문",
      "혈변 또는 점액변이 있으면 즉시 병원 방문",
      "급성 설사에만 사용",
      "만성 설사는 의사 상담 필요"
    ],
    ingredients: ["염산로페라마이드"],
    duration: "복용 후 1-2시간에 효과 시작, 4-6시간 지속",
    ageRestrictions: {
      infant: "유아기(0-2세) 복용 금지. 탈수 위험 증가",
      child: "소아기(3-12세)는 체중에 따라 용량 조절 필요",
      elderly: "노년기(65세 이상)는 변비 위험 증가, 용량 25% 감소 권장"
    },
    ageAlternatives: {
      infant: [], // 유아기에는 의사 상담 필수
      elderly: ["med_012"] // 노년기에도 사용 가능하나 용량 조절 필요
    }
  },
  "med_013": {
    id: "med_013",
    name: "포비돈정",
    category: "진통제",
    characteristics: "나프록센 성분의 소염진통제로 생리통에 특효가 있으며, 자궁 수축으로 인한 통증을 완화합니다.",
    comparisonNote: "생리통에 특히 효과적이며, 생리 시작 전 미리 복용하면 더욱 효과적입니다. 효과 지속 시간이 길어(6-8시간) 편리하지만, 위장 장애 위험이 있어 식후 복용이 필수입니다.",
    effects: [
      "생리통 완화",
      "항염 작용",
      "복통 완화",
      "생리 관련 통증 완화"
    ],
    dosage: {
      method: "물과 함께 복용",
      timing: "식후 30분 또는 생리 시작 전 예방 복용",
      frequency: "1회 1정, 1일 2-3회"
    },
    sideEffects: [
      "위장 장애 (속쓰림)",
      "드물게 두통",
      "드물게 어지러움",
      "드물게 피부 발진"
    ],
    precautions: [
      "생리 시작 전 복용 시 효과적",
      "식후 복용 권장",
      "위궤양 환자는 복용 금지",
      "임신 중 복용 전 의사 상담 필요"
    ],
    ingredients: ["나프록센"],
    duration: "복용 후 30분~1시간에 효과 시작, 6-8시간 지속",
    ageRestrictions: {
      infant: "유아기(0-2세) 복용 금지. 위장 자극 및 신장 위험",
      child: "소아기(3-12세)는 용량 조절 필요, 의사 상담 권장",
      elderly: "노년기(65세 이상)는 위장 장애, 신장 기능 저하 위험 증가. 용량 50% 감소 필수"
    },
    ageAlternatives: {
      infant: ["med_001"], // 유아기에는 타이레놀 추천
      elderly: ["med_001"] // 노년기에는 타이레놀이 더 안전
    }
  },
  "med_014": {
    id: "med_014",
    name: "프로스팬시럽",
    category: "거담제",
    characteristics: "가래 완화제로 가래를 묽게 만들어 배출을 쉽게 하며, 기침을 완화합니다.",
    comparisonNote: "가래가 많을 때 특히 효과적이며, 시럽 형태로 복용이 쉽고 맛도 좋습니다. 부작용이 거의 없지만, 당뇨 환자는 당 함량을 고려해야 하며 과다복용 시 설사가 발생할 수 있습니다.",
    effects: [
      "가래 완화",
      "기침 완화",
      "기관지 분비물 배출 촉진",
      "호흡 곤란 완화"
    ],
    dosage: {
      method: "시럽을 그대로 복용",
      timing: "식후 30분",
      frequency: "1회 10ml, 1일 3회"
    },
    sideEffects: [
      "드물게 구역질",
      "드물게 설사",
      "드물게 알레르기 반응"
    ],
    precautions: [
      "가래가 많은 경우 효과적",
      "충분한 수분 섭취 권장",
      "당뇨 환자는 당 함량 주의",
      "과다복용 시 설사 가능"
    ],
    ingredients: ["헤데라"],
    duration: "복용 후 1시간에 효과 시작, 6-8시간 지속",
    ageRestrictions: {
      infant: "유아기(0-2세)는 시럽 형태로 복용 가능하나 용량 조절 필요",
      child: "소아기(3-12세)는 체중에 따라 용량 조절",
      elderly: "노년기(65세 이상)는 당뇨 환자의 경우 당 함량 주의 필요"
    },
    ageAlternatives: {
      infant: ["med_014"], // 유아기에도 사용 가능하나 용량 조절 필요
      elderly: ["med_014"] // 노년기에도 사용 가능하나 당 함량 주의
    }
  },
  "med_015": {
    id: "med_015",
    name: "락투로즈정",
    category: "변비제",
    characteristics: "장내 수분 증가제로 변을 부드럽게 만들어 배변을 용이하게 하며, 안전한 변비 치료제입니다.",
    comparisonNote: "변비에 안전하고 효과적인 약으로 부작용이 거의 없습니다. 하지만 효과가 나타나기까지 24-48시간이 걸리므로, 급하게 해결하고 싶은 경우에는 다른 약을 고려해볼 수 있습니다.",
    effects: [
      "변비 완화",
      "장 운동 촉진",
      "변의 연화",
      "배변 촉진"
    ],
    dosage: {
      method: "물과 함께 복용",
      timing: "식후 30분",
      frequency: "1회 1정, 1일 1-2회"
    },
    sideEffects: [
      "드물게 복부 팽만",
      "드물게 복통",
      "과다복용 시 설사",
      "드물게 메스꺼움"
    ],
    precautions: [
      "복용 후 충분한 수분 섭취 필요",
      "과다복용 시 설사 주의",
      "장 폐쇄 환자는 복용 금지",
      "규칙적인 식사와 함께 복용 권장"
    ],
    ingredients: ["락툴로스"],
    duration: "복용 후 24-48시간에 효과 시작",
    ageRestrictions: {
      infant: "유아기(0-2세)는 사용 가능하나 용량 조절 필요",
      child: "소아기(3-12세)는 사용 가능하며 안전",
      elderly: "노년기(65세 이상)는 사용 가능하나 효과 지연 가능성"
    },
    ageAlternatives: {
      infant: ["med_015"], // 유아기에도 사용 가능
      elderly: ["med_015"] // 노년기에도 사용 가능
    }
  },
  "med_016": {
    id: "med_016",
    name: "베타히스틴정",
    category: "어지럼증 치료제",
    characteristics: "내이 순환 개선제로 어지러움과 멀미를 완화하며, 균형 감각을 개선합니다.",
    comparisonNote: "어지러움과 멀미에 효과적이며 부작용이 거의 없습니다. 하지만 운동 전 복용 시 주의가 필요하며, 기존 어지럼증 질환이 있는 경우 의사 상담이 필요합니다.",
    effects: [
      "어지러움 완화",
      "멀미 완화",
      "내이 순환 개선",
      "균형 감각 개선"
    ],
    dosage: {
      method: "물과 함께 복용",
      timing: "식후 30분",
      frequency: "1회 1정, 1일 3회"
    },
    sideEffects: [
      "드물게 위장 장애",
      "드물게 두통",
      "드물게 알레르기 반응"
    ],
    precautions: [
      "운동 전 복용 시 주의",
      "과민반응 시 즉시 복용 중단",
      "기존 어지럼증 질환 시 의사 상담 필요",
      "운전 전 복용 시 주의"
    ],
    ingredients: ["베타히스틴"],
    duration: "복용 후 1-2시간에 효과 시작, 6-8시간 지속",
    ageRestrictions: {
      infant: "유아기(0-2세)는 용량 조절 필요, 의사 처방 필수",
      child: "소아기(3-12세)는 체중에 따라 용량 조절",
      elderly: "노년기(65세 이상)는 신장 기능 저하 고려하여 용량 25% 감소 권장"
    },
    ageAlternatives: {
      infant: ["med_016"], // 유아기에도 사용 가능하나 용량 조절 필요
      elderly: ["med_016"] // 노년기에도 사용 가능하나 용량 조절 필요
    }
  },
  "med_017": {
    id: "med_017",
    name: "자로스정",
    category: "진정제",
    characteristics: "진정 작용제로 불안, 스트레스, 긴장을 완화하며, 가벼운 진정 효과가 있습니다.",
    comparisonNote: "불안과 스트레스에 효과적이지만 졸음이 오므로 운전 전 복용은 절대 금지입니다. 필요시 복용이 가능하여 간편하지만, 장기간 복용 시 의사 상담이 필요합니다.",
    effects: [
      "불안 완화",
      "긴장 완화",
      "스트레스 완화",
      "진정 효과"
    ],
    dosage: {
      method: "물과 함께 복용",
      timing: "필요시 또는 식후",
      frequency: "1회 1정, 필요시 1일 최대 3정"
    },
    sideEffects: [
      "졸음",
      "어지러움",
      "구강건조",
      "드물게 두통"
    ],
    precautions: [
      "운전 전 복용 절대 금지",
      "알코올과 함께 복용 금지",
      "중추신경계 약물과 함께 복용 시 주의",
      "장기간 복용 시 의사 상담 필요"
    ],
    ingredients: ["히드록시진"],
    duration: "복용 후 30분~1시간에 효과 시작, 4-6시간 지속",
    ageRestrictions: {
      infant: "유아기(0-2세) 복용 금지. 졸음 부작용 위험",
      child: "소아기(3-12세)는 용량 조절 필요, 의사 상담 권장",
      elderly: "노년기(65세 이상)는 졸음으로 인한 낙상 위험 증가, 용량 50% 감소 필수"
    },
    ageAlternatives: {
      infant: [], // 유아기에는 진정제 사용 금지
      elderly: ["med_017"] // 노년기에도 사용 가능하나 용량 조절 필요
    }
  },
  "med_019": {
    id: "med_019",
    name: "우리나스프레이",
    category: "구강약",
    characteristics: "구강 소독제로 구내염과 입 안 상처에 직접 도포하여 염증을 완화하고 회복을 촉진합니다.",
    comparisonNote: "구내염에 직접 도포하여 빠르고 확실한 효과를 보입니다. 부작용이 거의 없고 편리하게 사용할 수 있지만, 삼키면 안 되므로 어린이 사용 시 주의가 필요합니다.",
    effects: [
      "구내염 완화",
      "입 안 상처 완화",
      "구강 소독",
      "염증 완화"
    ],
    dosage: {
      method: "입 안에 직접 분사",
      timing: "식후 및 취침 전",
      frequency: "1회 1-2회 분사, 1일 3-4회"
    },
    sideEffects: [
      "드물게 입 안 건조감",
      "드물게 미각 이상",
      "드물게 알레르기 반응"
    ],
    precautions: [
      "삼키지 말고 가글 후 뱉기",
      "어린이는 사용 시 주의",
      "치료 후 식사 주의",
      "영양분 섭취 부족 시 병원 방문"
    ],
    ingredients: ["클로르헥시딘"],
    duration: "도포 즉시 효과 시작, 2-3시간 지속",
    ageRestrictions: {
      infant: "유아기(0-2세)는 삼킬 위험으로 사용 주의, 보호자 지도 필요",
      child: "소아기(3-12세)는 삼키지 않도록 지도 필요",
      elderly: "노년기(65세 이상)는 사용 가능하며 안전"
    },
    ageAlternatives: {
      infant: ["med_019"], // 유아기에도 사용 가능하나 보호자 지도 필수
      elderly: ["med_019"] // 노년기에도 사용 가능
    }
  },
  // 20. 안과 약물 (서울대 보건진료소 진료과 기반)
  "med_020": {
    id: "med_020",
    name: "아이리프 인공눈물",
    category: "안약",
    characteristics: "히알루론산 성분의 인공눈물로 안구건조증과 눈 피로에 효과적이며, 자연스러운 눈물과 유사한 성분입니다.",
    comparisonNote: "눈 건조증과 피로에 즉각적이고 부드러운 효과를 보입니다. 부작용이 거의 없고 콘택트렌즈 착용 중에도 사용 가능하지만, 하루에 여러 번 점안해야 할 수 있습니다.",
    effects: [
      "안구건조증 완화",
      "눈 피로 완화",
      "눈 보습",
      "시력 보호"
    ],
    dosage: {
      method: "눈에 점안",
      timing: "필요시 또는 하루 3-4회",
      frequency: "1회 1-2방울씩, 하루 3-4회"
    },
    sideEffects: [
      "드물게 일시적인 시야 흐림",
      "드물게 자극감",
      "드물게 알레르기 반응"
    ],
    precautions: [
      "콘택트렌즈 착용 전 점안 후 15분 대기",
      "개봉 후 1개월 이내 사용",
      "눈에 직접 닿지 않도록 주의",
      "감염이 있는 경우 의사 상담 필요"
    ],
    ingredients: ["히알루론산"],
    duration: "점안 즉시 효과 시작, 2-4시간 지속",
    ageRestrictions: {
      infant: "유아기(0-2세)는 의사 처방 필요, 보호자 지도 하 사용",
      child: "소아기(3-12세)는 보호자 지도 하 사용",
      elderly: "노년기(65세 이상)는 사용 가능하며 안전"
    },
    ageAlternatives: {
      infant: ["med_020"], // 유아기에도 사용 가능하나 주의 필요
      elderly: ["med_020"] // 노년기에도 사용 가능
    }
  },
  "med_021": {
    id: "med_021",
    name: "토브라마이신 안약",
    category: "항생제 안약",
    characteristics: "항생제 안약으로 결막염과 세균성 안구 감염에 효과적입니다.",
    comparisonNote: "결막염에 강력하고 빠른 효과를 보입니다. 하지만 항생제이므로 의사의 처방 없이는 구입이 어려우며, 바이러스성 결막염에는 효과가 없습니다.",
    effects: [
      "세균성 결막염 치료",
      "안구 감염 완화",
      "눈 염증 완화",
      "분비물 감소"
    ],
    dosage: {
      method: "눈에 점안",
      timing: "식후 또는 필요시",
      frequency: "1회 1-2방울씩, 하루 4-6회 (의사 지시에 따라)"
    },
    sideEffects: [
      "드물게 일시적인 시야 흐림",
      "드물게 가려움",
      "드물게 알레르기 반응",
      "드물게 눈 자극"
    ],
    precautions: [
      "의사 처방 필수",
      "바이러스성 결막염에는 효과 없음",
      "정해진 기간 동안만 사용",
      "다른 사람과 공유 금지"
    ],
    ingredients: ["토브라마이신"],
    duration: "점안 후 1-2일 내 효과 시작",
    ageRestrictions: {
      infant: "유아기(0-2세)는 의사 처방 필수, 용량 조절 필요",
      child: "소아기(3-12세)는 의사 처방 필수",
      elderly: "노년기(65세 이상)는 신장 기능 고려하여 사용"
    },
    ageAlternatives: {
      infant: ["med_021"], // 유아기에도 사용 가능하나 의사 처방 필수
      elderly: ["med_021"] // 노년기에도 사용 가능하나 주의 필요
    }
  },
  // 22-23. 피부과 약물 (서울대 보건진료소 진료과 기반)
  "med_022": {
    id: "med_022",
    name: "벤조일퍼옥사이드 연고",
    category: "여드름 치료제",
    characteristics: "여드름 치료에 효과적인 항균 및 각질 제거제로 염증성 여드름과 비염증성 여드름 모두에 효과적입니다.",
    comparisonNote: "여드름에 강력하고 확실한 효과를 보입니다. 하지만 초기 사용 시 피부 자극(건조, 벗겨짐)이 발생할 수 있으며, 햇빛에 민감해질 수 있어 주의가 필요합니다.",
    effects: [
      "여드름 치료",
      "피지 분비 감소",
      "세균 억제",
      "각질 제거"
    ],
    dosage: {
      method: "여드름 부위에 도포",
      timing: "세안 후 취침 전",
      frequency: "1일 1회 (초기 1주일은 격일)"
    },
    sideEffects: [
      "초기 피부 건조, 벗겨짐",
      "피부 자극 (초기)",
      "햇빛 민감도 증가",
      "드물게 알레르기 반응"
    ],
    precautions: [
      "초기 사용 시 피부 자극 가능 (점진적 사용 권장)",
      "자외선 차단제 필수 사용",
      "건조한 피부는 보습제 함께 사용",
      "임신 중 사용 전 의사 상담 필요"
    ],
    ingredients: ["벤조일퍼옥사이드"],
    duration: "사용 후 2-4주 내 효과 시작",
    ageRestrictions: {
      infant: "유아기(0-2세) 사용 금지. 피부 자극 위험",
      child: "소아기(3-12세)는 의사 상담 권장",
      elderly: "노년기(65세 이상)는 피부가 민감하므로 용량 감소 권장"
    },
    ageAlternatives: {
      infant: [], // 유아기에는 사용 금지
      elderly: ["med_022"] // 노년기에도 사용 가능하나 주의 필요
    }
  },
  "med_023": {
    id: "med_023",
    name: "레티노이드 크림",
    category: "여드름 치료제",
    characteristics: "비타민 A 유도체로 여드름과 주름 개선에 효과적이며, 피부 재생을 촉진합니다.",
    comparisonNote: "여드름과 피부 재생에 강력한 효과를 보입니다. 하지만 초기 사용 시 피부 자극이 심하고, 햇빛에 매우 민감하며, 임신 중 사용 금지이므로 주의가 필요합니다.",
    effects: [
      "여드름 치료",
      "피부 재생 촉진",
      "각질 제거",
      "모공 정화"
    ],
    dosage: {
      method: "얼굴에 얇게 도포",
      timing: "세안 후 취침 전",
      frequency: "1일 1회 (초기 1주일은 격일)"
    },
    sideEffects: [
      "초기 피부 건조, 벗겨짐 (심함)",
      "피부 자극, 홍반",
      "햇빛 매우 민감",
      "드물게 알레르기 반응"
    ],
    precautions: [
      "임신 중 절대 사용 금지",
      "초기 사용 시 피부 자극 매우 심함 (점진적 사용 필수)",
      "자외선 차단제 필수 사용 (낮 시간 사용 시 주의)",
      "건조한 피부는 보습제 함께 사용 필수"
    ],
    ingredients: ["트레티노인"],
    duration: "사용 후 4-8주 내 효과 시작",
    ageRestrictions: {
      infant: "유아기(0-2세) 절대 사용 금지",
      child: "소아기(3-12세) 사용 금지. 피부 자극 위험",
      elderly: "노년기(65세 이상)는 피부가 매우 민감하므로 주의 필요"
    },
    ageAlternatives: {
      infant: [], // 유아기에는 사용 금지
      elderly: ["med_022"] // 노년기에는 벤조일퍼옥사이드가 더 안전
    }
  },
  // 24-25. 습진 치료제
  "med_024": {
    id: "med_024",
    name: "하이드로코르티손 연고",
    category: "스테로이드 연고",
    characteristics: "가벼운 스테로이드 연고로 습진과 피부 염증에 효과적이며, 가려움과 발진을 완화합니다.",
    comparisonNote: "습진과 가려움에 빠르고 확실한 효과를 보입니다. 하지만 장기간 사용 시 피부 위축 위험이 있고, 얼굴에는 장기간 사용을 피해야 합니다.",
    effects: [
      "습진 완화",
      "피부 염증 완화",
      "가려움 완화",
      "발진 완화"
    ],
    dosage: {
      method: "습진 부위에 얇게 도포",
      timing: "세안 후 하루 1-2회",
      frequency: "1일 1-2회 (증상이 심하면 의사 상담)"
    },
    sideEffects: [
      "장기간 사용 시 피부 위축",
      "드물게 피부 염색 변화",
      "드물게 모세혈관 확장",
      "드물게 알레르기 반응"
    ],
    precautions: [
      "얼굴에는 장기간 사용 금지 (1주일 이내)",
      "연속 사용 시 2주 이내 권장",
      "감염이 있는 부위에는 사용 금지",
      "의사의 지시에 따라 사용"
    ],
    ingredients: ["하이드로코르티손"],
    duration: "도포 후 수일 내 효과 시작",
    ageRestrictions: {
      infant: "유아기(0-2세)는 의사 처방 필요, 용량 조절 필요",
      child: "소아기(3-12세)는 의사 상담 권장",
      elderly: "노년기(65세 이상)는 피부가 약하므로 주의 필요"
    },
    ageAlternatives: {
      infant: ["med_024"], // 유아기에도 사용 가능하나 의사 처방 필요
      elderly: ["med_024"] // 노년기에도 사용 가능하나 주의 필요
    }
  },
  "med_025": {
    id: "med_025",
    name: "무피로신 연고",
    category: "항생제 연고",
    characteristics: "항생제 연고로 습진에 의한 2차 감염과 세균성 피부 감염에 효과적입니다.",
    comparisonNote: "습진 감염에 강력하고 빠른 효과를 보입니다. 하지만 항생제이므로 의사 처방이 필요하며, 바이러스 감염에는 효과가 없습니다.",
    effects: [
      "세균성 피부 감염 치료",
      "습진 2차 감염 완화",
      "피부 염증 완화",
      "농포 치료"
    ],
    dosage: {
      method: "감염 부위에 도포",
      timing: "세안 후 하루 2-3회",
      frequency: "1일 2-3회 (의사 지시에 따라)"
    },
    sideEffects: [
      "드물게 피부 자극",
      "드물게 알레르기 반응",
      "드물게 피부 건조"
    ],
    precautions: [
      "의사 처방 필요 (일반의약품 아님)",
      "바이러스 감염에는 효과 없음",
      "정해진 기간 동안만 사용",
      "감염 증상이 악화되면 즉시 병원 방문"
    ],
    ingredients: ["무피로신"],
    duration: "도포 후 수일 내 효과 시작",
    ageRestrictions: {
      infant: "유아기(0-2세)는 의사 처방 필수",
      child: "소아기(3-12세)는 의사 처방 필수",
      elderly: "노년기(65세 이상)는 신장 기능 고려하여 사용"
    },
    ageAlternatives: {
      infant: ["med_025"], // 유아기에도 사용 가능하나 의사 처방 필수
      elderly: ["med_025"] // 노년기에도 사용 가능하나 주의 필요
    }
  },
  // 26-27. 산부인과 약물
  "med_026": {
    id: "med_026",
    name: "클로트리마졸 질정",
    category: "항진균제",
    characteristics: "질염 치료제로 곰팡이성 질염에 효과적이며, 질 내 직접 삽입하여 사용합니다.",
    comparisonNote: "질염에 확실하고 빠른 효과를 보입니다. 하지만 임신 중에는 사용 전 의사 상담이 필요하며, 사용 중 성관계를 피해야 합니다.",
    effects: [
      "곰팡이성 질염 치료",
      "질 가려움 완화",
      "질 분비물 감소",
      "질 염증 완화"
    ],
    dosage: {
      method: "질 내 직접 삽입",
      timing: "취침 전",
      frequency: "1일 1회, 3-7일간 (의사 지시에 따라)"
    },
    sideEffects: [
      "드물게 질 자극",
      "드물게 가려움 증가 (초기)",
      "드물게 알레르기 반응",
      "드물게 소화기 장애"
    ],
    precautions: [
      "사용 중 성관계 피하기",
      "임신 중 사용 전 의사 상담 필요",
      "증상이 개선되지 않으면 병원 방문",
      "생리 중에도 사용 가능"
    ],
    ingredients: ["클로트리마졸"],
    duration: "사용 후 2-3일 내 효과 시작",
    ageRestrictions: {
      infant: "유아기(0-2세) 사용 불가",
      child: "소아기(3-12세) 사용 불가",
      elderly: "노년기(65세 이상)는 의사 상담 후 사용"
    },
    ageAlternatives: {
      infant: [], // 유아기에는 사용 불가
      elderly: ["med_026"] // 노년기에도 사용 가능하나 의사 상담 필요
    }
  },
  "med_027": {
    id: "med_027",
    name: "메트로니다졸 질정",
    category: "항생제",
    characteristics: "세균성 질염 치료제로 트리코모나스 질염과 세균성 질염에 효과적입니다.",
    comparisonNote: "세균성 질염에 강력하고 확실한 효과를 보입니다. 하지만 항생제이므로 의사 처방이 필요하며, 알코올과 함께 복용하면 심한 부작용이 발생할 수 있습니다.",
    effects: [
      "세균성 질염 치료",
      "트리코모나스 질염 치료",
      "질 분비물 감소",
      "질 염증 완화"
    ],
    dosage: {
      method: "질 내 직접 삽입",
      timing: "취침 전",
      frequency: "1일 1회, 5-7일간 (의사 지시에 따라)"
    },
    sideEffects: [
      "드물게 질 자극",
      "드물게 알레르기 반응",
      "드물게 두통",
      "알코올과 함께 복용 시 심한 부작용"
    ],
    precautions: [
      "의사 처방 필수",
      "알코올과 절대 함께 복용 금지 (사용 중 및 사용 후 3일)",
      "사용 중 성관계 피하기",
      "임신 중 사용 전 의사 상담 필요"
    ],
    ingredients: ["메트로니다졸"],
    duration: "사용 후 2-3일 내 효과 시작",
    ageRestrictions: {
      infant: "유아기(0-2세) 사용 불가",
      child: "소아기(3-12세) 사용 불가",
      elderly: "노년기(65세 이상)는 의사 상담 후 사용"
    },
    ageAlternatives: {
      infant: [], // 유아기에는 사용 불가
      elderly: ["med_027"] // 노년기에도 사용 가능하나 의사 상담 필요
    }
  },
  // 28. 정신건강의학과 약물
  "med_028": {
    id: "med_028",
    name: "플루옥세틴 캡슐",
    category: "항우울제",
    characteristics: "선택적 세로토닌 재흡수 억제제(SSRI)로 우울증과 불안장애에 효과적이며, 처방전이 필요한 전문의약품입니다.",
    comparisonNote: "우울증과 불안에 강력하고 확실한 효과를 보입니다. 하지만 의사 처방이 필수이며, 복용 후 2-4주 후에야 효과가 나타나며, 초기 부작용(구역질, 불면증)이 있을 수 있습니다.",
    effects: [
      "우울증 완화",
      "불안장애 완화",
      "기분 개선",
      "의욕 회복"
    ],
    dosage: {
      method: "물과 함께 복용",
      timing: "아침 식후",
      frequency: "1일 1회, 의사 처방에 따라 (보통 1일 1캡슐)"
    },
    sideEffects: [
      "초기 구역질, 메스꺼움",
      "초기 불면증",
      "드물게 두통",
      "드물게 성기능 저하",
      "드물게 졸음"
    ],
    precautions: [
      "의사 처방 필수 (전문의약품)",
      "복용 즉시 효과 없음 (2-4주 후 효과 시작)",
      "갑작스러운 복용 중단 금지 (점진적 감량 필요)",
      "18세 미만 청소년은 자살 사고 위험으로 주의",
      "알코올과 함께 복용 금지"
    ],
    ingredients: ["플루옥세틴"],
    duration: "복용 후 2-4주 후 효과 시작, 지속적 복용 필요",
    ageRestrictions: {
      infant: "유아기(0-2세) 절대 복용 금지",
      child: "소아기(3-12세) 복용 금지. 의사 특별 처방 시에만 가능",
      elderly: "노년기(65세 이상)는 용량 50% 감소 필수, 신장 기능 고려 필요"
    },
    ageAlternatives: {
      infant: [], // 유아기에는 복용 금지
      elderly: ["med_017"] // 노년기에는 경미한 진정제(자로스정) 추천
    }
  }
};

