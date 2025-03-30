"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigationStore } from "@/lib/store/navigation";
import { useChatStore } from "@/lib/store/chat";

export function Header() {
  const { currentPage } = useNavigationStore();
  const { toggleChat, isChatVisible } = useChatStore();

  return (
    <header className="h-16 border-b border-sidebar-border bg-background flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold" id="page-title">
        {currentPage}
      </h1>
      <div className="flex items-center space-x-4">
        <Button
          variant={isChatVisible ? "default" : "ghost"}
          size="icon"
          className={`rounded-md ${
            isChatVisible ? "bg-primary text-primary-foreground" : ""
          }`}
          onClick={toggleChat}
          title="채팅 패널 열기"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="9" y1="21" x2="9" y2="9" />
          </svg>
        </Button>

        {/* 알림 버튼 */}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-md relative"
          title="알림"
        >
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
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          {/* 알림 개수 표시 */}
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </Button>

        {/* 사용자 프로필 */}
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center rounded-full border border-border"
          title="사용자 프로필"
        >
          <span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
            UM
          </span>
          <span className="ml-2 text-sm hidden sm:inline">사용자</span>
        </Button>
      </div>
    </header>
  );
}
