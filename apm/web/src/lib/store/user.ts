import { create } from "zustand";

// 사용자 정보 타입
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

// 사용자 인증 상태 타입
interface UserState {
  // 사용자 정보
  user: User | null;
  setUser: (user: User | null) => void;

  // 인증 상태
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;

  // 로딩 상태
  isLoading: boolean;
  setLoading: (loading: boolean) => void;

  // 오류 처리
  error: string | null;
  clearError: () => void;
}

// 사용자 스토어 생성
export const useUserStore = create<UserState>((set) => ({
  // 사용자 초기 상태
  user: null,
  setUser: (user) => set({ user, isAuthenticated: !!user }),

  // 인증 초기 상태
  isAuthenticated: false,

  // 로그인 처리
  login: async (email, password) => {
    set({ isLoading: true, error: null });

    try {
      // 여기에서는 실제 로그인 API 호출 대신 예시로 구현
      // 실제 구현에서는 API 호출 코드를 작성해야 함
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 가상의 사용자 정보
      const user: User = {
        id: "user-1",
        name: "사용자",
        email,
        role: "user",
      };

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });

      return true;
    } catch (err) {
      set({
        error:
          err instanceof Error ? err.message : "로그인 중 오류가 발생했습니다",
        isLoading: false,
      });

      return false;
    }
  },

  // 로그아웃 처리
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },

  // 로딩 상태 초기값
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),

  // 오류 상태 초기값
  error: null,
  clearError: () => set({ error: null }),
}));
