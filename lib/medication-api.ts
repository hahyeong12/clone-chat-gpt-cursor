export async function fetchDrugInfo(itemName: string): Promise<{ imageUrl: string | null; price: string | null; error?: string }> {
  try {
    const response = await fetch(`/api/medication-info?itemName=${encodeURIComponent(itemName)}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to fetch drug info: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching drug info from proxy:", error);
    return { imageUrl: null, price: "정보 없음", error: error.message };
  }
}

export async function fetchMaxDosageInfo(ingredientName: string): Promise<{ dayMaxDosg: string; error?: string }> {
  try {
    const response = await fetch(`/api/max-dosage-info?ingrName=${encodeURIComponent(ingredientName)}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to fetch max dosage info: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching max dosage info from proxy:", error);
    return { dayMaxDosg: "정보 없음", error: error.message };
  }
}
