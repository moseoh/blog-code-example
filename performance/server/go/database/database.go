package database

import (
	"database/sql"
	"fmt"
)

// InitDB initializes database connection
func InitDB(host, port, user, password, dbname string) (*sql.DB, error) {
	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, fmt.Errorf("데이터베이스 연결 실패: %v", err)
	}

	if err = db.Ping(); err != nil {
		return nil, fmt.Errorf("데이터베이스 연결 확인 실패: %v", err)
	}

	return db, nil
}

// CreateTables creates necessary tables if they don't exist
func CreateTables(db *sql.DB) error {
	query := `
	CREATE TABLE IF NOT EXISTS boards (
		id SERIAL PRIMARY KEY,
		title VARCHAR(255) NOT NULL,
		content TEXT NOT NULL,
		created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
	)`

	_, err := db.Exec(query)
	if err != nil {
		return fmt.Errorf("테이블 생성 실패: %v", err)
	}

	return nil
}
