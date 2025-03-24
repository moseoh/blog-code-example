package handlers

import (
	"context"
	"database/sql"
	"time"

	"github.com/seongha-moon/blog-code-example/performance/server/go/models"
	pb "github.com/seongha-moon/blog-code-example/performance/server/go/proto"
)

type BoardServer struct {
	pb.UnimplementedBoardServiceServer
	db *sql.DB
}

func NewBoardServer(db *sql.DB) *BoardServer {
	return &BoardServer{db: db}
}

func (s *BoardServer) GetBoard(ctx context.Context, req *pb.GetBoardRequest) (*pb.GetBoardResponse, error) {
	board, err := models.GetLatestBoard(s.db)
	if err != nil {
		return nil, err
	}

	return &pb.GetBoardResponse{
		Board: &pb.Board{
			Id:        board.ID,
			Title:     board.Title,
			Content:   board.Content,
			CreatedAt: board.CreatedAt.Format(time.RFC3339),
		},
	}, nil
}
