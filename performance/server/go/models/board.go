package models

import (
	"database/sql"
	"time"
)

// Board 모델 구조체
type Board struct {
	ID        int64     `json:"id"`
	Title     string    `json:"title"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`
}

// CreateBoard 새로운 게시글을 생성합니다
func CreateBoard(db *sql.DB, title, content string) (Board, error) {
	var board Board
	err := db.QueryRow(
		"INSERT INTO boards (title, content) VALUES ($1, $2) RETURNING id, title, content, created_at",
		title, content,
	).Scan(&board.ID, &board.Title, &board.Content, &board.CreatedAt)
	return board, err
}

// GetLatestBoard 가장 최근 게시글을 가져옵니다
func GetLatestBoard(db *sql.DB) (Board, error) {
	var board Board
	err := db.QueryRow(
		"SELECT id, title, content, created_at FROM boards ORDER BY created_at DESC LIMIT 1",
	).Scan(&board.ID, &board.Title, &board.Content, &board.CreatedAt)
	if err == sql.ErrNoRows {
		return Board{}, nil
	}
	return board, err
}
