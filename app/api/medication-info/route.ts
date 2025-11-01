import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const itemName = searchParams.get('itemName');

  if (!itemName) {
    return NextResponse.json({ error: 'itemName is required' }, { status: 400 });
  }

  const serviceKey = process.env.DATA_GO_KR_SERVICE_KEY;
  if (!serviceKey) {
    return NextResponse.json({ error: 'Service key is not configured' }, { status: 500 });
  }

  const endpoint = 'https://apis.data.go.kr/1471000/DrbEasyDrugInfoService/getDrbEasyDrugList';
  const params = new URLSearchParams({
    serviceKey: decodeURIComponent(serviceKey),
    itemName: itemName,
    type: 'json',
    numOfRows: '1' // 가장 관련성 높은 1개만 가져옴
  });

  try {
    const response = await fetch(`${endpoint}?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const data = await response.json();

    // 공공데이터 API는 데이터가 없을 때 body를 비우는 경우가 있음
    if (!data.body || !data.body.items || data.body.items.length === 0) {
      return NextResponse.json({ imageUrl: null, price: '정보 없음' });
    }

    const item = data.body.items[0];
    const imageUrl = item.itemImage || null;

    // 가격 정보는 API에 없으므로, 대비용 플레이스홀더를 반환
    const price = '정보 없음'; 

    return NextResponse.json({ imageUrl, price });

  } catch (error) {
    console.error('Failed to fetch medication info:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
