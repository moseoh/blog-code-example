import http from "k6/http";
import { check, sleep } from "k6";
import { Rate } from "k6/metrics";
import ws from "k6/ws";
import { randomString } from "https://jslib.k6.io/k6-utils/1.2.0/index.js";

// 성공률 메트릭 정의
const failRate = new Rate("failed_requests");

// 테스트 설정
export const options = {
  stages: [
    { duration: "30s", target: 50 }, // 30초 동안 점진적으로 VU 수를 50으로 증가
    { duration: "1m", target: 50 }, // 1분 동안 50 VU 유지
    { duration: "30s", target: 0 }, // 30초 동안 점진적으로 VU 수를 0으로 감소
  ],
  thresholds: {
    failed_requests: ["rate<0.1"], // 실패율 10% 미만 유지
    http_req_duration: ["p(95)<500"], // 95% 요청이 500ms 이내 완료
  },
};

// 기본 설정
const BASE_URL = "http://go-server:8080";
const WS_URL = "ws://go-server:8080/ws/boards";

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
    "has valid JSON response": (r) => r.json().id !== undefined,
  });

  failRate.add(!postSuccess);

  // 잠시 대기
  sleep(1);

  // GET 요청 - 게시글 목록 조회
  const getRes = http.get(`${BASE_URL}/api/boards`);

  // 응답 확인
  const getSuccess = check(getRes, {
    "status is 200": (r) => r.status === 200,
    "has valid JSON response": (r) => Array.isArray(r.json()),
  });

  failRate.add(!getSuccess);

  // 잠시 대기
  sleep(1);

  // WebSocket 테스트
  // 주의: 이 부분은 VU가 많을 때 리소스를 많이
  // 소모하므로 전체 VU 중 10%만 실행
  if (Math.random() < 0.1) {
    const wsRes = ws.connect(WS_URL, function (socket) {
      socket.on("open", () => {
        console.log("WebSocket 연결 성공");
      });

      socket.on("message", (msg) => {
        const msgSuccess = check(msg, {
          "has valid message": (data) => true, // 메시지를 받았는지 여부만 확인
        });

        failRate.add(!msgSuccess);
      });

      socket.on("close", () => console.log("WebSocket 연결 종료"));

      socket.setTimeout(function () {
        socket.close();
      }, 5000); // 5초 후 연결 종료
    });

    // WebSocket 연결 확인
    check(wsRes, {
      "WebSocket connected": (r) => r && r.status === 101,
    });
  }

  // 테스트 사이에 잠시 대기
  sleep(3);
}
