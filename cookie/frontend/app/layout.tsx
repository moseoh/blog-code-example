import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "쿠키 테스트 앱",
  description: "쿠키 설정 테스트를 위한 애플리케이션",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head />
      <body>
        <div className="app-layout">
          <div className="sidebar">
            <h2>쿠키 테스트</h2>
            <ul>
              <li><Link href="/browser">브라우저 요청</Link></li>
              <li><Link href="/server">서버 사이드 요청</Link></li>
              <li><Link href="/cookies">쿠키 조회</Link></li>
            </ul>
          </div>
          <div className="content">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
