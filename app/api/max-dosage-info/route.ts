import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ingrName = searchParams.get('ingrName');

  if (!ingrName) {
    return NextResponse.json({ error: 'ingrName is required' }, { status: 400 });
  }

  const serviceKey = process.env.DATA_GO_KR_SERVICE_KEY;
  if (!serviceKey) {
    return NextResponse.json({ error: 'Service key is not configured' }, { status: 500 });
  }

  const endpoint = 'https://apis.data.go.kr/1471000/DayMaxDosgQyByIngdService/getDayMaxDosgQyByIngdList';
  const params = new URLSearchParams({
    serviceKey: decodeURIComponent(serviceKey),
    ingrName: ingrName,
    type: 'json',
    numOfRows: '1' // 가장 관련성 높은 1개만 가져옴
  });

  try {
    const response = await fetch(`${endpoint}?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.body || !data.body.items || data.body.items.length === 0) {
      return NextResponse.json({ dayMaxDosg: '정보 없음' });
    }

    const item = data.body.items[0];
    const dayMaxDosg = item.dayMaxDosg || '정보 없음';

    return NextResponse.json({ dayMaxDosg });

  } catch (error) {
    console.error('Failed to fetch max dosage info:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
