"use client";

import React from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/ui/Header";
import { Chat } from "@/components/Chat";
import { usePathname } from "next/navigation";
import { useNavigationStore } from "@/lib/store/navigation";
import { useEffect } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const { setCurrentPage } = useNavigationStore();

  // 페이지 변경 시 현재 페이지 업데이트
  useEffect(() => {
    let pageName = "Dashboard";
    if (pathname === "/") pageName = "Dashboard";
    else if (pathname.includes("/logs")) pageName = "Logs";
    else if (pathname.includes("/traces")) pageName = "Traces";
    else if (pathname.includes("/metrics")) pageName = "Metrics";
    else if (pathname.includes("/more")) pageName = "더보기";

    setCurrentPage(pageName);
  }, [pathname, setCurrentPage]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* 사이드바 */}
      <Sidebar />

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col">
        {/* 헤더 */}
        <Header />

        {/* 페이지 콘텐츠 */}
        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
            <div className="container mx-auto px-6 py-8">{children}</div>
          </main>

          {/* 오른쪽 채팅 패널 */}
          <Chat />
        </div>
      </div>
    </div>
  );
}
