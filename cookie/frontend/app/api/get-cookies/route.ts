import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = await cookies()

    // 백엔드 API 호출
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/get-cookies`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Cookie': cookieStore.toString()
      }
    });
    
    const backendData = await backendResponse.json();
    
    // 응답 생성
    return NextResponse.json({
      message: '프론트엔드 서버에서 쿠키 조회 완료',
      backendCookies: backendData.cookies, // 백엔드 서버에서 조회한 쿠키
    });
  } catch (error) {
    console.error('쿠키 조회 오류:', error);
    return NextResponse.json(
      { error: '프론트엔드 서버 쿠키 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 