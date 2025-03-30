import { create } from "zustand";

// 채팅 메시지 타입
export interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "system";
  timestamp: number;
}

// 에이전트 타입
export type AgentType = "claude-3.7-sonnet" | "gpt-4o" | "llama-3";

// 채팅 상태 타입
interface ChatState {
  // 채팅 패널 표시 여부
  isChatVisible: boolean;
  toggleChat: () => void;

  // 채팅 패널 너비
  chatWidth: number;
  setChatWidth: (width: number) => void;

  // 메시지 목록
  messages: ChatMessage[];

  // 메시지 입력 값
  inputValue: string;
  setInputValue: (value: string) => void;

  // 선택된 에이전트
  selectedAgent: AgentType;
  setSelectedAgent: (agent: AgentType) => void;

  // 메시지 처리 중 상태
  isProcessing: boolean;

  // 메시지 보내기
  sendMessage: (content: string) => void;

  // 메시지 삭제
  deleteMessage: (id: string) => void;

  // 모든 메시지 삭제
  clearMessages: () => void;
}

// 고유 ID 생성 함수
const generateId = () =>
  Math.random().toString(36).substring(2) + Date.now().toString(36);

// 채팅 스토어 생성
export const useChatStore = create<ChatState>((set, get) => ({
  // 채팅 패널 초기 상태
  isChatVisible: false,
  toggleChat: () => set((state) => ({ isChatVisible: !state.isChatVisible })),

  // 채팅 패널 너비 (기본값: 320px)
  chatWidth: 320,
  setChatWidth: (width) => set({ chatWidth: width }),

  // 채팅 메시지 초기 상태
  messages: [],

  // 입력 값 상태
  inputValue: "",
  setInputValue: (value) => set({ inputValue: value }),

  // 선택된 에이전트 (기본값)
  selectedAgent: "claude-3.7-sonnet",
  setSelectedAgent: (agent) => set({ selectedAgent: agent }),

  // 메시지 처리 중 상태
  isProcessing: false,

  // 메시지 보내기 메서드
  sendMessage: (content) => {
    if (!content.trim()) return;

    // 이미 처리 중이면 중복 전송 방지
    if (get().isProcessing) return;

    // 처리 시작
    set({ isProcessing: true });

    const newMessage: ChatMessage = {
      id: generateId(),
      content,
      sender: "user",
      timestamp: Date.now(),
    };

    // 사용자 메시지 추가 (입력값 초기화)
    set((state) => ({
      messages: [...state.messages, newMessage],
      inputValue: "",
    }));

    // 시스템 응답 추가 (실제로는 서버에서 응답을 받아야 함)
    setTimeout(() => {
      const systemMessage: ChatMessage = {
        id: generateId(),
        content: "메시지를 받았습니다. 어떻게 도와드릴까요?",
        sender: "system",
        timestamp: Date.now(),
      };

      set((state) => ({
        messages: [...state.messages, systemMessage],
        isProcessing: false, // 처리 완료
      }));
    }, 1000);
  },

  // 메시지 삭제 메서드
  deleteMessage: (id) => {
    set((state) => ({
      messages: state.messages.filter((message) => message.id !== id),
    }));
  },

  // 모든 메시지 삭제 메서드
  clearMessages: () => {
    set({ messages: [] });
  },
}));
