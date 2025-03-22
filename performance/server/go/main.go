package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"

	"github.com/seongha-moon/blog-code-example/performance/server/go/database"
	"github.com/seongha-moon/blog-code-example/performance/server/go/handlers"
)

func main() {
	// 환경 변수로부터 DB 설정 가져오기
	dbHost := getEnv("DB_HOST", "postgres")
	dbPort := getEnv("DB_PORT", "5432")
	dbUser := getEnv("DB_USER", "postgres")
	dbPassword := getEnv("DB_PASSWORD", "postgres")
	dbName := getEnv("DB_NAME", "postgres")

	// 데이터베이스 연결
	db, err := database.InitDB(dbHost, dbPort, dbUser, dbPassword, dbName)
	if err != nil {
		log.Fatalf("데이터베이스 연결 실패: %v", err)
	}
	defer db.Close()

	// 테이블 생성
	if err := database.CreateTables(db); err != nil {
		log.Fatalf("테이블 생성 실패: %v", err)
	}

	// 라우터 설정
	r := mux.NewRouter()

	// REST API 엔드포인트
	r.HandleFunc("/api/boards", handlers.CreateBoardHandler(db)).Methods("POST")
	r.HandleFunc("/api/boards", handlers.GetBoardsHandler(db)).Methods("GET")

	// WebSocket 엔드포인트
	r.HandleFunc("/ws/boards", handlers.WebsocketBoardsHandler(db))

	// 서버 실행
	port := getEnv("PORT", "8080")
	log.Printf("%s 포트에서 서버 시작...", port)
	if err := http.ListenAndServe(":"+port, r); err != nil {
		log.Fatalf("서버 시작 실패: %v", err)
	}
}

// 환경 변수를 가져오는 유틸리티 함수
func getEnv(key, fallback string) string {
	value := os.Getenv(key)
	if value == "" {
		return fallback
	}
	return value
}
