import http from "k6/http";
import { check } from "k6";
import { Rate } from "k6/metrics";

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
  },
};

// 기본 설정
const BASE_URL = "http://host.docker.internal:8080";

// REST API 테스트
export default function () {
  // GET 요청 - 최근 게시글 조회
  const getRes = http.get(`${BASE_URL}/api/currency`);

  // 응답 로깅 (디버깅용)
  if (getRes.status !== 200) {
    console.log(`Status: ${getRes.status}, Body: ${getRes.body}`);
  }

  // 매우 간단한 응답 확인
  const getSuccess = check(getRes, {
    "status is 200": (r) => r.status === 200,
    "response has content": (r) => r.body && r.body.length > 0,
    "response time < 500ms": (r) => r.timings.duration < 500,
  });

  failRate.add(!getSuccess);
}
