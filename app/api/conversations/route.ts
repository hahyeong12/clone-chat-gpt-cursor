import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET(request: Request) {
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const externalApiUrl = 'https://hackathon.jifferent.org/api/conversations';
  const authorizationHeader = request.headers.get('Authorization');

  if (!authorizationHeader) {
    return NextResponse.json({ message: 'Authorization header missing' }, { status: 400 });
  }

  try {
    const response = await fetch(externalApiUrl, {
      method: 'GET',
      headers: {
        'Authorization': authorizationHeader,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'External API error' }));
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error proxying conversations request:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
