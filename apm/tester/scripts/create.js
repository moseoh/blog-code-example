import http from "k6/http";
import { check } from "k6";
import { Rate } from "k6/metrics";
import { randomString } from "https://jslib.k6.io/k6-utils/1.2.0/index.js";

// 성공률 메트릭 정의
const failRate = new Rate("failed_requests");

// 테스트 설정
export const options = {
  stages: [
    { duration: "6s", target: 50 }, // 30초 동안 점진적으로 VU 수를 50으로 증가
    { duration: "6s", target: 100 }, // 1분 동안 50 VU 유지
    { duration: "6s", target: 0 }, // 1분 동안 50 VU 유지
  ],
  thresholds: {
    failed_requests: ["rate<0.1"], // 실패율 10% 미만 유지
    http_req_duration: ["p(95)<500"], // 95% 요청이 500ms 이내 완료
  }
};

// 기본 설정
const BASE_URL = "http://host.docker.internal:8080";

// REST API 테스트
export default function () {
  // 새 게시글 생성
  const payload = JSON.stringify({
    title: `테스트 제목 ${randomString(8)}`,
    content: `테스트 내용 ${randomString(20)}`,
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // POST 요청 - 게시글 생성
  const postRes = http.post(`${BASE_URL}/api/boards`, payload, params);

  // 응답 확인
  const postSuccess = check(postRes, {
    "status is 201": (r) => r.status === 201,
    "has valid JSON response": (r) => {
      try {
        const data = r.json();
        return typeof data === 'object' && 'id' in data;
      } catch (e) {
        return false;
      }
    }
  });

  failRate.add(!postSuccess);
}
