package database

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

// InitDB 데이터베이스 연결을 설정합니다
func InitDB(host, port, user, password, dbname string) (*sql.DB, error) {
	// 연결 문자열 생성
	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)

	// 데이터베이스 연결
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, err
	}

	// 연결 풀 설정
	db.SetMaxOpenConns(100)   // 최대 동시 연결 수
	db.SetMaxIdleConns(20)    // 유휴 상태로 유지할 최대 연결 수
	db.SetConnMaxLifetime(30) // 연결 최대 수명 (30초)

	// 연결 테스트
	if err := db.Ping(); err != nil {
		return nil, err
	}

	log.Println("데이터베이스 연결 성공")
	return db, nil
}

// CreateTables 필요한의 테이블을 생성합니다
func CreateTables(db *sql.DB) error {
	// board 테이블 생성
	query := `
	CREATE TABLE IF NOT EXISTS boards (
		id SERIAL PRIMARY KEY,
		title VARCHAR(255) NOT NULL,
		content TEXT NOT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	)
	`

	_, err := db.Exec(query)
	if err != nil {
		return err
	}

	log.Println("테이블 생성 완료")
	return nil
}
