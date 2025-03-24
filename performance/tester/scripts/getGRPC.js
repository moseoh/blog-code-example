import grpc from 'k6/net/grpc';
import { check } from 'k6';
import { Rate } from "k6/metrics";

// 성공률 메트릭 정의
const failRate = new Rate("failed_requests");

const client = new grpc.Client();
client.load(['/proto'], 'board.proto');

// 테스트 설정
export const options = {
    stages: [
        { duration: "6s", target: 50 }, // 30초 동안 점진적으로 VU 수를 50으로 증가
        { duration: "6s", target: 100 }, // 1분 동안 50 VU 유지
        { duration: "6s", target: 0 }, // 1분 동안 50 VU 유지
    ],
    thresholds: {
        failed_requests: ["rate<0.1"], // 실패율 10% 미만 유지
        grpc_req_duration: ["p(95)<500"], // 95% 요청이 500ms 이내 완료
    }
};

// gRPC 테스트
export default function () {
    if (__ITER === 0) {
        client.connect('host.docker.internal:50051', {
            plaintext: true
        });
    }

    const response = client.invoke('board.BoardService/GetBoard', {});

    // 응답 로깅 (디버깅용)
    if (response.status !== grpc.StatusOK) {
        console.log(`Status: ${response.status}, Error: ${response.error}`);
    }

    // 매우 간단한 응답 확인
    const getSuccess = check(response, {
        "status is OK": (r) => r && r.status === grpc.StatusOK,
        "response has content": (r) => r && r.message && r.message.board,
        "response time < 500ms": (r) => r.time < 500,
    });

    failRate.add(!getSuccess);
}

export function teardown() {
    client.close();
} 