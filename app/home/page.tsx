"use client";

import { useState } from "react";
import Link from "next/link";
import { medications } from "@/lib/medications";
import { MedicationCard } from "@/components/medication-card";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // 카테고리 목록
  const categories = Array.from(new Set(medications.map(m => m.category)));

  // 검색 결과
  const filteredMedications = medications.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         med.symptoms.some(s => s.includes(searchQuery));
    const matchesCategory = !selectedCategory || med.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#ede9fe] to-white">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#7c3aed]">약장수</h1>
            <span className="text-sm text-gray-500">의약품 정보 검색</span>
          </div>
          <Link href="/">
            <button className="bg-[#7c3aed] text-white px-6 py-2 rounded-lg hover:bg-[#6d28d9] transition-colors">
              AI 챗봇 상담
            </button>
          </Link>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* 검색 바 */}
        <div className="mb-8">
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="약 이름 또는 증상으로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
            />
          </div>

          {/* 카테고리 필터 */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === null
                  ? "bg-[#7c3aed] text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              전체
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === category
                    ? "bg-[#7c3aed] text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* 결과 카운트 */}
        <div className="mb-4 text-gray-600">
          총 {filteredMedications.length}개의 약물 정보
        </div>

        {/* 약물 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMedications.map(med => (
            <MedicationCard key={med.id} med={med} />
          ))}
        </div>

        {/* 검색 결과 없을 때 */}
        {filteredMedications.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-500 text-lg mb-4">
              검색 결과가 없습니다
            </div>
            <Link href="/">
              <button className="bg-[#7c3aed] text-white px-6 py-3 rounded-lg hover:bg-[#6d28d9] transition-colors">
                AI 챗봇에게 직접 물어보기
              </button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}


