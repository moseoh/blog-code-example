package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/gorilla/websocket"

	"your-project/server/go/models"
)

// WebSocket 연결을 업그레이드하는 upgrader
var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true // CORS 허용
	},
}

// 활성 WebSocket 연결을 관리하는 클라이언트 맵
var clients = make(map[*websocket.Conn]bool)
var clientsMutex sync.Mutex

// 게시글 생성을 위한 요청 구조체
type CreateBoardRequest struct {
	Title   string `json:"title"`
	Content string `json:"content"`
}

// CreateBoardHandler 새 게시글을 생성하는 핸들러
func CreateBoardHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// 요청 본문 파싱
		var req CreateBoardRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "잘못된 요청 형식", http.StatusBadRequest)
			return
		}

		// 유효성 검사
		if req.Title == "" || req.Content == "" {
			http.Error(w, "제목과 내용은 필수입니다", http.StatusBadRequest)
			return
		}

		// 게시글 생성
		board, err := models.CreateBoard(db, req.Title, req.Content)
		if err != nil {
			log.Printf("게시글 생성 오류: %v", err)
			http.Error(w, "게시글 생성 실패", http.StatusInternalServerError)
			return
		}

		// 모든 WebSocket 클라이언트에게 새 게시글 통지
		go broadcastBoardUpdate(board)

		// 응답 전송
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(board)
	}
}

// GetBoardsHandler 모든 게시글을 조회하는 핸들러
func GetBoardsHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// 게시글 목록 조회
		boards, err := models.GetAllBoards(db)
		if err != nil {
			log.Printf("게시글 조회 오류: %v", err)
			http.Error(w, "게시글 조회 실패", http.StatusInternalServerError)
			return
		}

		// 응답 전송
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(boards)
	}
}

// WebsocketBoardsHandler WebSocket을 통해 게시글 업데이트를 제공하는 핸들러
func WebsocketBoardsHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// HTTP 연결을 WebSocket으로 업그레이드
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Printf("WebSocket 업그레이드 실패: %v", err)
			return
		}
		defer conn.Close()

		// 클라이언트 등록
		clientsMutex.Lock()
		clients[conn] = true
		clientsMutex.Unlock()

		// 현재 모든 게시글 전송
		boards, err := models.GetAllBoards(db)
		if err != nil {
			log.Printf("게시글 조회 오류: %v", err)
			return
		}

		if err := conn.WriteJSON(boards); err != nil {
			log.Printf("WebSocket 메시지 전송 실패: %v", err)
			clientsMutex.Lock()
			delete(clients, conn)
			clientsMutex.Unlock()
			return
		}

		// 클라이언트 연결이 종료될 때까지 대기
		for {
			// 핑 메시지 주기적 전송을 위한 빈 메시지 수신
			_, _, err := conn.ReadMessage()
			if err != nil {
				log.Printf("WebSocket 읽기 오류: %v", err)
				clientsMutex.Lock()
				delete(clients, conn)
				clientsMutex.Unlock()
				break
			}
		}
	}
}

// broadcastBoardUpdate 모든 WebSocket 클라이언트에게 게시글 업데이트를 전송
func broadcastBoardUpdate(board models.Board) {
	clientsMutex.Lock()
	defer clientsMutex.Unlock()

	for client := range clients {
		err := client.WriteJSON(board)
		if err != nil {
			log.Printf("WebSocket 메시지 전송 오류: %v", err)
			client.Close()
			delete(clients, client)
		}
	}
} 