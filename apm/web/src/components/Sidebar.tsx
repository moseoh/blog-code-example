"use client";

import React from "react";
import Link from "next/link";
import { useNavigationStore, useIsPathActive } from "@/lib/store/navigation";

// 네비게이션 링크 아이템 타입
interface NavItem {
  path: string;
  href: string;
  title: string;
  icon: React.ReactNode;
}

export function Sidebar() {
  // 네비게이션 아이템 목록
  const navItems: NavItem[] = [
    {
      path: "/",
      href: "/",
      title: "Dashboard",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      path: "/logs",
      href: "/logs",
      title: "Logs",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      path: "/traces",
      href: "/traces",
      title: "Traces",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
    {
      path: "/metrics",
      href: "/metrics",
      title: "Metrics",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      path: "/more",
      href: "/more",
      title: "더보기",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <aside className="w-16 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col items-center py-4">
      {/* 로고 영역 */}
      <div className="mb-6 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
      </div>

      {/* 네비게이션 링크 목록 */}
      <nav className="flex-1 flex flex-col space-y-6 w-full px-3">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            href={item.href}
            title={item.title}
            icon={item.icon}
            path={item.path}
          />
        ))}
      </nav>
    </aside>
  );
}

// 네비게이션 링크 컴포넌트
function NavLink({ href, icon, title, path }: NavItem) {
  // 클라이언트 사이드 렌더링에서만 사용하는 활성화 상태 체크 훅 사용
  const isPathActive = useIsPathActive();
  const isActive = isPathActive(path);

  return (
    <div className="group relative">
      <Link
        href={href}
        className={`flex items-center justify-center p-2 w-10 h-10 rounded-lg transition-colors ${
          isActive
            ? "bg-sidebar-primary text-sidebar-primary-foreground"
            : "hover:bg-sidebar-accent/50"
        }`}
        title={title}
      >
        <span className="relative z-10">{icon}</span>
      </Link>
      {/* 호버 시 표시되는 툴팁 */}
      <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-black/75 text-white text-xs rounded whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
        {title}
      </div>
    </div>
  );
}
