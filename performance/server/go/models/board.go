package models

import (
	"database/sql"
	"fmt"
	"time"
)

// Board 모델 구조체
type Board struct {
	ID        int       `json:"id"`
	Title     string    `json:"title"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`
}

// CreateBoard 새로운 게시글을 생성합니다
func CreateBoard(db *sql.DB, title, content string) (Board, error) {
	var board Board

	// 트랜잭션 시작
	tx, err := db.Begin()
	if err != nil {
		return board, fmt.Errorf("트랜잭션 시작 실패: %v", err)
	}
	defer tx.Rollback() // 실패 시 롤백

	query := `
	INSERT INTO boards (title, content)
	VALUES ($1, $2)
	RETURNING id, title, content, created_at
	`

	err = tx.QueryRow(query, title, content).Scan(
		&board.ID,
		&board.Title,
		&board.Content,
		&board.CreatedAt,
	)
	if err != nil {
		return board, fmt.Errorf("게시글 생성 실패: %v", err)
	}

	// 트랜잭션 커밋
	if err = tx.Commit(); err != nil {
		return board, fmt.Errorf("트랜잭션 커밋 실패: %v", err)
	}

	return board, nil
}

// GetLatestBoard 가장 최근 게시글을 가져옵니다
func GetLatestBoard(db *sql.DB) (Board, error) {
	query := `
	SELECT id, title, content, created_at
	FROM boards
	ORDER BY created_at DESC
	LIMIT 1
	`

	var board Board
	err := db.QueryRow(query).Scan(
		&board.ID,
		&board.Title,
		&board.Content,
		&board.CreatedAt,
	)

	if err == sql.ErrNoRows {
		return Board{}, nil
	}

	if err != nil {
		return Board{}, err
	}

	return board, nil
}
