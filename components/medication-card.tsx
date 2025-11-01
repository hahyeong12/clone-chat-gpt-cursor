'use client';

import { useState, useEffect } from 'react';
import type { Medication } from '@/lib/medications';

interface MedicationCardProps {
  med: Medication;
}

export function MedicationCard({ med }: MedicationCardProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [price, setPrice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMedInfo() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/medication-info?itemName=${encodeURIComponent(med.name)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch medication info');
        }
        const data = await response.json();
        setImageUrl(data.imageUrl);
        setPrice(data.price);
      } catch (error) {
        console.error('Error fetching medication info:', error);
        // 에러 발생 시 기본 이미지나 상태를 설정할 수 있습니다.
        setImageUrl(null);
        setPrice('정보 없음');
      } finally {
        setIsLoading(false);
      }
    }

    fetchMedInfo();
  }, [med.name]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow flex flex-col">
      {/* 이미지 및 로딩 상태 */}
      <div className="w-full h-40 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
        {isLoading ? (
          <div className="text-gray-500">이미지 로딩 중...</div>
        ) : imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={med.name} className="w-full h-full object-contain rounded-lg" />
        ) : (
          <div className="text-gray-500">이미지 없음</div>
        )}
      </div>

      <div className="flex-1 flex flex-col">
        <div className="mb-3">
          <h3 className="text-xl font-semibold text-[#111827] mb-1">{med.name}</h3>
          <span className="text-sm text-[#7c3aed] bg-purple-50 px-3 py-1 rounded-full">
            {med.category}
          </span>
        </div>

        {/* 가격 정보 */}
        <div className="mb-4">
            <div className="text-lg font-bold text-gray-800">{price || ''}</div>
        </div>

        <div className="mb-4">
          <div className="text-sm font-medium text-gray-700 mb-2">처리 가능한 증상:</div>
          <div className="text-sm text-gray-600">
            {med.symptoms.join(", ")}
          </div>
        </div>

        <div className="mb-4">
          <div className="text-sm font-medium text-gray-700 mb-1">용법:</div>
          <div className="text-sm text-gray-600">{med.dosage}</div>
        </div>

        {med.warnings.length > 0 && (
          <div className="pt-3 border-t border-gray-100 mt-auto">
            <div className="text-sm font-medium text-orange-600 mb-1">⚠️ 주의사항:</div>
            <div className="text-xs text-gray-600">
              {med.warnings.join(", ")}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
