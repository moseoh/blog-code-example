"use client";

import React, { useRef, useEffect } from "react";
import { useChatStore, AgentType } from "@/lib/store/chat";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { format } from "date-fns";

export function Chat() {
  const {
    isChatVisible,
    toggleChat,
    messages,
    inputValue,
    setInputValue,
    sendMessage,
    clearMessages,
    chatWidth,
    setChatWidth,
    selectedAgent,
    setSelectedAgent,
    isProcessing,
  } = useChatStore();

  const chatRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // 드래그로 사이즈 조절을 위한 상태
  const dragRef = useRef<{
    isDragging: boolean;
    startX: number;
    startWidth: number;
  }>({
    isDragging: false,
    startX: 0,
    startWidth: chatWidth,
  });

  // 메시지가 추가될 때마다 스크롤을 아래로 이동
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  // 텍스트 영역 높이 자동 조절
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [inputValue]);

  // 드래그 시작
  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();

    dragRef.current = {
      isDragging: true,
      startX: e.clientX,
      startWidth: chatWidth,
    };

    // 전역 이벤트 리스너 추가
    document.addEventListener("mousemove", handleResizeMove);
    document.addEventListener("mouseup", handleResizeEnd);
  };

  // 드래그 중
  const handleResizeMove = (e: MouseEvent) => {
    if (!dragRef.current.isDragging) return;

    const delta = dragRef.current.startX - e.clientX;
    const newWidth = Math.max(
      320,
      Math.min(800, dragRef.current.startWidth + delta)
    );

    setChatWidth(newWidth);
  };

  // 드래그 종료
  const handleResizeEnd = () => {
    dragRef.current.isDragging = false;

    // 이벤트 리스너 제거
    document.removeEventListener("mousemove", handleResizeMove);
    document.removeEventListener("mouseup", handleResizeEnd);
  };

  // 키 입력 핸들러
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      if (inputValue.trim() && !isProcessing) {
        sendMessage(inputValue);
      }
    }
  };

  // 메시지 전송 버튼 핸들러
  const handleSendClick = () => {
    if (inputValue.trim() && !isProcessing) {
      sendMessage(inputValue);
      // 포커스 유지
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  // 에이전트 변경 핸들러
  const handleAgentChange = (value: AgentType) => {
    setSelectedAgent(value);
  };

  // 채팅 패널이 보이지 않으면 렌더링하지 않음
  if (!isChatVisible) return null;

  return (
    <div
      ref={chatRef}
      className="border-l border-border bg-background flex flex-col h-full relative"
      style={{ width: `${chatWidth}px` }}
    >
      {/* 리사이즈 핸들 */}
      <div
        ref={resizeRef}
        className="absolute left-0 top-0 w-1 h-full cursor-ew-resize group z-10"
        onMouseDown={handleResizeStart}
      >
        <div className="absolute left-0 top-0 w-1 h-full bg-primary/0 group-hover:bg-primary/20 transition-colors" />
      </div>

      {/* 헤더 */}
      <div className="p-4 border-b border-border flex justify-between items-center shrink-0">
        <h2 className="font-medium">채팅</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={clearMessages}
            title="채팅 내역 지우기"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            </svg>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={toggleChat}
            title="채팅 패널 닫기"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </Button>
        </div>
      </div>

      {/* 메시지 목록 - ScrollArea 사용 */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 overflow-hidden">
        <div className="p-4 space-y-4 min-h-full">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              메시지가 없습니다. 채팅을 시작하세요.
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <div className="mb-1 whitespace-pre-wrap">
                    {message.content}
                  </div>
                  <div
                    className={`text-xs ${
                      message.sender === "user"
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    }`}
                  >
                    {format(new Date(message.timestamp), "HH:mm")}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* 메시지 입력 영역 */}
      <div className="border-t border-border bg-background/95 shrink-0">
        {/* 텍스트 영역 */}
        <div className="p-2">
          <Textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="메시지 입력..."
            className="resize-none w-full min-h-[44px] max-h-[120px] bg-muted/50 border-0 focus-visible:ring-1"
            rows={1}
          />
        </div>

        {/* 하단 컨트롤 영역 */}
        <div className="px-2 pb-2 flex items-center justify-between">
          {/* 에이전트 선택 드롭다운 */}
          <Select value={selectedAgent} onValueChange={handleAgentChange}>
            <SelectTrigger className="w-[180px] h-9 text-xs">
              <SelectValue placeholder="에이전트 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="claude-3.7-sonnet">
                Claude 3.7 Sonnet
              </SelectItem>
              <SelectItem value="gpt-4o">GPT-4o</SelectItem>
              <SelectItem value="llama-3">Llama 3</SelectItem>
            </SelectContent>
          </Select>

          {/* 전송 버튼 */}
          <Button
            onClick={handleSendClick}
            disabled={!inputValue.trim() || isProcessing}
            className="h-9"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1"
            >
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
            전송
          </Button>
        </div>
      </div>
    </div>
  );
}
