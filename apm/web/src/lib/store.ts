import { create } from "zustand";
import { useNavigationStore } from "./store/navigation";
import { useChatStore } from "./store/chat";
import { useUserStore } from "./store/user";

// 애플리케이션 전체 상태에 대한 접근을 위한 루트 스토어
export const useStore = () => {
  return {
    // 네비게이션 관련 상태와 액션
    navigation: useNavigationStore(),

    // 채팅 관련 상태와 액션
    chat: useChatStore(),

    // 사용자 관련 상태와 액션
    user: useUserStore(),
  };
};

// 기존 코드는 하위 스토어로 분리되었으므로 삭제
// 필요시 하위 스토어에서 직접 import 가능
