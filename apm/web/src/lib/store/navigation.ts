import { create } from "zustand";
import { usePathname } from "next/navigation";

// 네비게이션 상태 타입
interface NavigationState {
  // 현재 페이지 제목
  currentPage: string;
  setCurrentPage: (page: string) => void;

  // 활성화 경로 체크 (패스 비교용)
  isPathActive: (path: string, currentPath?: string) => boolean;
}

// 네비게이션 스토어 생성
export const useNavigationStore = create<NavigationState>((set, get) => ({
  // 현재 페이지 초기값
  currentPage: "Dashboard",
  setCurrentPage: (page) => set({ currentPage: page }),

  // 경로 활성화 체크 메서드
  // 서버와 클라이언트 간의 하이드레이션 불일치를 방지하기 위해
  // 현재 경로를 외부에서 전달받을 수 있도록 함
  isPathActive: (path, currentPath) => {
    // 전달받은 currentPath가 있으면 사용, 없으면 '/'를 기본값으로 사용
    const pathname = currentPath || "/";

    // 루트 경로 처리
    if (path === "/" && pathname === "/") {
      return true;
    }

    // 다른 경로 처리 - path가 루트가 아니면 pathname이 path로 시작하는지 체크
    if (path !== "/" && pathname.startsWith(path)) {
      return true;
    }

    return false;
  },
}));

// 클라이언트 컴포넌트에서 사용할 경로 활성화 체크 훅
export function useIsPathActive() {
  const pathname = usePathname();
  const { isPathActive } = useNavigationStore();

  return (path: string) => isPathActive(path, pathname);
}
