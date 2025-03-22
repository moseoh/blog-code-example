FROM golang:1.21-alpine AS builder

WORKDIR /app

# 소스 코드 복사
COPY . .

# 의존성 다운로드
RUN go mod download

# 애플리케이션 빌드
RUN CGO_ENABLED=0 GOOS=linux go build -o server ./main.go

# 최종 이미지 생성
FROM alpine:latest

WORKDIR /app

# 빌더 이미지에서 바이너리 복사
COPY --from=builder /app/server .

# 애플리케이션 실행
EXPOSE 8080
CMD ["./server"] 