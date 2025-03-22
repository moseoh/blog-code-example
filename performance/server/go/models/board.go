package models

import (
	"database/sql"
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
	
	query := `
	INSERT INTO boards (title, content)
	VALUES ($1, $2)
	RETURNING id, title, content, created_at
	`
	
	err := db.QueryRow(query, title, content).Scan(
		&board.ID,
		&board.Title,
		&board.Content,
		&board.CreatedAt,
	)
	
	return board, err
}

// GetAllBoards 모든 게시글을 가져옵니다
func GetAllBoards(db *sql.DB) ([]Board, error) {
	query := `
	SELECT id, title, content, created_at
	FROM boards
	ORDER BY created_at DESC
	`
	
	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	
	var boards []Board
	
	for rows.Next() {
		var board Board
		err := rows.Scan(
			&board.ID,
			&board.Title,
			&board.Content,
			&board.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		boards = append(boards, board)
	}
	
	if err := rows.Err(); err != nil {
		return nil, err
	}
	
	return boards, nil
} 