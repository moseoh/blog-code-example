import { NextResponse } from 'next/server';

interface CookieRequest {
  key: string;
  value: string;
  domain: string;
  path: string;
  secure: boolean;
  httponly: boolean;
  samesite: string;
}

export async function POST(request: Request) {
  try {
    const cookieData: CookieRequest = await request.json();
    
    // 백엔드 API로 요청 전달
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/set-cookie`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cookieData),
    });
    
    const data = await backendResponse.json();
    
    // Response 객체 생성
    const response = NextResponse.json(
      { 
        message: '서버 사이드에서 쿠키 설정 완료', 
        backendResponse: data 
      }
    );
    
    // 응답에 쿠키 설정
    response.cookies.set({
      name: cookieData.key,
      value: cookieData.value,
      path: cookieData.path,
      domain: cookieData.domain,
      secure: cookieData.secure,
      httpOnly: cookieData.httponly,
      sameSite: cookieData.samesite as 'lax' | 'strict' | 'none',
    });
    
    return response;
  } catch (error) {
    console.error('쿠키 설정 오류:', error);
    return NextResponse.json(
      { error: '서버 사이드 쿠키 설정 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 