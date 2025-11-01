"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { symptomCategories, medicationDetails } from "@/lib/symptom-categories";
import { useSession, signOut } from "next-auth/react";
import { LoginDialog } from "@/components/login-dialog";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDetailedSymptom, setSelectedDetailedSymptom] = useState<string | null>(null);
  const { data: session, status } = useSession();

  const currentCategory = selectedCategory 
    ? symptomCategories.find(cat => cat.id === selectedCategory)
    : null;

  const currentDetailedSymptom = selectedDetailedSymptom && currentCategory
    ? currentCategory.detailedSymptoms.find(s => s.id === selectedDetailedSymptom)
    : null;

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedDetailedSymptom(null);
  };

  const handleDetailedSymptomSelect = (symptomId: string) => {
    setSelectedDetailedSymptom(symptomId);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedDetailedSymptom(null);
  };

  const handleBackToDetailed = () => {
    setSelectedDetailedSymptom(null);
  };

  // 약장수 버튼 클릭 시 초기 상태로 리셋
  const handleResetToHome = () => {
    setSelectedCategory(null);
    setSelectedDetailedSymptom(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#ede9fe] to-white">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 
              onClick={handleResetToHome}
              className="text-2xl font-bold text-[#7c3aed] hover:text-[#6d28d9] transition-colors cursor-pointer"
            >
              약장수
            </h1>
            <span className="text-sm text-gray-500">의약품 정보 검색</span>
          </div>
          <div className="flex items-center gap-3">
            {status === "authenticated" && session?.user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  {session.user.name || session.user.email}님
                </span>
              <Button
                variant="outline"
                size="sm"
                  onClick={() => signOut({ callbackUrl: "/" })}
                className="text-xs"
              >
                로그아웃
              </Button>
              </div>
            ) : (
              <LoginDialog />
            )}
            <Link href="/chat">
              <button className="bg-[#7c3aed] text-white px-6 py-2 rounded-lg hover:bg-[#6d28d9] transition-colors">
                AI 챗봇 상담
              </button>
            </Link>
          </div>
          </div>
        </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* 증상별 카테고리 목록 */}
        {!selectedCategory && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">증상별 약 추천</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {symptomCategories.map(category => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-[#7c3aed] hover:shadow-lg transition-all text-center"
                >
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <div className="font-semibold text-gray-800">{category.title}</div>
                </button>
              ))}
            </div>
                    </div>
        )}

        {/* 세부 증상 선택 */}
        {selectedCategory && currentCategory && !selectedDetailedSymptom && (
          <div>
            <button
              onClick={handleBackToCategories}
              className="mb-4 text-[#7c3aed] hover:text-[#6d28d9] flex items-center gap-2"
            >
              ← 뒤로가기
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{currentCategory.title}</h2>
            <p className="text-gray-600 mb-6">어디가 어떻게 아플 때를 선택해주세요</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentCategory.detailedSymptoms.map(symptom => (
                <button
                  key={symptom.id}
                  onClick={() => handleDetailedSymptomSelect(symptom.id)}
                  className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-[#7c3aed] hover:shadow-lg transition-all text-left"
                >
                  <div className="font-semibold text-lg text-gray-800 mb-2">{symptom.title}</div>
                  {symptom.description && (
                    <div className="text-sm text-gray-600">{symptom.description}</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 약 상세 정보 */}
        {selectedDetailedSymptom && currentDetailedSymptom && (
          <div>
            <button
              onClick={handleBackToDetailed}
              className="mb-4 text-[#7c3aed] hover:text-[#6d28d9] flex items-center gap-2"
            >
              ← 뒤로가기
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{currentDetailedSymptom.title}</h2>
            {currentDetailedSymptom.description && (
              <p className="text-gray-600 mb-6">{currentDetailedSymptom.description}</p>
            )}

            {/* 약 개수에 따라 레이아웃 조정 */}
            <div 
              className={
                currentDetailedSymptom.medications.length === 2
                  ? "grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto"
                  : currentDetailedSymptom.medications.length === 3
                  ? "grid grid-cols-1 md:grid-cols-3 gap-6"
                  : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              }
            >
              {currentDetailedSymptom.medications.map((medId, index) => {
                const medDetail = medicationDetails[medId];
                if (!medDetail) return null;

                return (
                  <div
                    key={medId}
                    className={`bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow flex flex-col ${
                      currentDetailedSymptom.medications.length === 2 
                        ? "h-full p-6" 
                        : "p-5"
                    }`}
                  >
                    {/* 헤더 */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-gray-800">{medDetail.name}</h3>
                        <span className="text-xs text-[#7c3aed] bg-purple-50 px-2 py-1 rounded-full">
                          {medDetail.category}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-3">{medDetail.characteristics}</p>
                      
                      {/* 비교 설명 */}
                      {medDetail.comparisonNote && (
                        <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r-lg mb-3">
                          <div className="text-xs font-semibold text-blue-800 mb-1">💡 이 약을 선택하면 좋은 경우</div>
                          <p className="text-xs text-blue-700 leading-relaxed">{medDetail.comparisonNote}</p>
                        </div>
                      )}
                    </div>

                    {/* 효과 */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1">
                        <span>✨</span> 효과
                      </h4>
                      <ul className="space-y-1">
                        {medDetail.effects.slice(0, 3).map((effect, idx) => (
                          <li key={idx} className="flex items-start gap-1 text-xs text-gray-700">
                            <span className="text-[#7c3aed] mt-0.5">•</span>
                            <span className="line-clamp-1">{effect}</span>
                          </li>
                        ))}
                        {medDetail.effects.length > 3 && (
                          <li className="text-xs text-gray-500">+ {medDetail.effects.length - 3}개 더</li>
                        )}
                      </ul>
                    </div>

                    {/* 복용법 */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1">
                        <span>💊</span> 복용법
                      </h4>
                      <div className="bg-gray-50 rounded-lg p-2 space-y-1 text-xs">
                        <div className="flex items-start gap-1">
                          <span className="font-medium text-gray-600 min-w-[50px]">시간:</span>
                          <span className="text-gray-700">{medDetail.dosage.timing}</span>
                        </div>
                        <div className="flex items-start gap-1">
                          <span className="font-medium text-gray-600 min-w-[50px]">횟수:</span>
                          <span className="text-gray-700">{medDetail.dosage.frequency}</span>
                        </div>
                      </div>
                    </div>

                    {/* 성분 */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1">
                        <span>🧪</span> 성분
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {medDetail.ingredients.slice(0, 2).map((ingredient, idx) => (
                          <span
                            key={idx}
                            className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs"
                          >
                            {ingredient}
                          </span>
                        ))}
                        {medDetail.ingredients.length > 2 && (
                          <span className="text-xs text-gray-500 px-2 py-0.5">
                            +{medDetail.ingredients.length - 2}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 부작용 */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-orange-700 mb-2 flex items-center gap-1">
                        <span>⚠️</span> 부작용
                      </h4>
                      <ul className="space-y-1">
                        {medDetail.sideEffects.slice(0, 2).map((sideEffect, idx) => (
                          <li key={idx} className="flex items-start gap-1 text-xs text-gray-700">
                            <span className="text-orange-500 mt-0.5">•</span>
                            <span className="line-clamp-1">{sideEffect}</span>
                          </li>
                        ))}
                        {medDetail.sideEffects.length > 2 && (
                          <li className="text-xs text-gray-500">+ {medDetail.sideEffects.length - 2}개 더</li>
                        )}
                      </ul>
                    </div>

                    {/* 주의사항 */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-1">
                        <span>🔔</span> 주의사항
                      </h4>
                      <ul className="space-y-1">
                        {medDetail.precautions.slice(0, 2).map((precaution, idx) => (
                          <li key={idx} className="flex items-start gap-1 text-xs text-gray-700">
                            <span className="text-red-500 mt-0.5">•</span>
                            <span className="line-clamp-2">{precaution}</span>
                          </li>
                        ))}
                        {medDetail.precautions.length > 2 && (
                          <li className="text-xs text-gray-500">+ {medDetail.precautions.length - 2}개 더</li>
                        )}
                      </ul>
                    </div>

                    {/* 효과 지속 시간 */}
                    {medDetail.duration && (
                      <div className="pt-3 border-t border-gray-100 mt-auto">
                        <div className="text-xs text-gray-600">
                          <span className="font-medium">효과 지속: </span>
                          {medDetail.duration}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
