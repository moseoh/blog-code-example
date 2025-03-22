package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strings"
	"sync"

	"github.com/gorilla/websocket"

	"github.com/seongha-moon/blog-code-example/performance/server/go/models"
)

// ErrorResponse represents an error response
type ErrorResponse struct {
	Error string `json:"error"`
}

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

// sendErrorResponse sends a JSON error response
func sendErrorResponse(w http.ResponseWriter, message string, status int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(ErrorResponse{Error: message})
}

// CreateBoardHandler creates a new board
func CreateBoardHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Parse request body
		var req CreateBoardRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			log.Printf("Failed to parse request body: %v", err)
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(`{"error":"Invalid request"}`))
			return
		}

		// Validate request
		if req.Title == "" || req.Content == "" {
			log.Printf("Validation failed: title or content is empty")
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(`{"error":"Missing fields"}`))
			return
		}

		// Create board
		board, err := models.CreateBoard(db, req.Title, req.Content)
		if err != nil {
			log.Printf("Failed to create board: %v", err)
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(`{"error":"Server error"}`))
			return
		}

		// Broadcast to WebSocket clients
		go func() {
			if err := broadcastBoardUpdate(board); err != nil {
				log.Printf("Failed to broadcast update: %v", err)
			}
		}()

		// Send response
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(board)
	}
}

// GetBoardsHandler retrieves the latest board
func GetBoardsHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Get latest board
		board, err := models.GetLatestBoard(db)
		if err != nil {
			log.Printf("Failed to get board: %v", err)
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(`{"error":"Server error"}`))
			return
		}

		// Send response
		w.Header().Set("Content-Type", "application/json")

		// Return empty object if no board exists
		if board.ID == 0 {
			w.Write([]byte("{}"))
			return
		}

		// Just use the standard encoder
		err = json.NewEncoder(w).Encode(board)
		if err != nil {
			log.Printf("Failed to encode response: %v", err)
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(`{"error":"Server error"}`))
		}
	}
}

// escapeString escapes special JSON characters
func escapeString(s string) string {
	s = strings.Replace(s, "\\", "\\\\", -1)
	s = strings.Replace(s, "\"", "\\\"", -1)
	s = strings.Replace(s, "\n", "\\n", -1)
	s = strings.Replace(s, "\r", "\\r", -1)
	s = strings.Replace(s, "\t", "\\t", -1)
	return s
}

// WebsocketBoardsHandler handles WebSocket connections
func WebsocketBoardsHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Upgrade HTTP connection to WebSocket
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Printf("Failed to upgrade WebSocket: %v", err)
			return
		}
		defer conn.Close()

		// Register client
		clientsMutex.Lock()
		clients[conn] = true
		clientsMutex.Unlock()

		// Send current latest board
		board, err := models.GetLatestBoard(db)
		if err != nil {
			log.Printf("Failed to get board: %v", err)
			return
		}

		if err := conn.WriteJSON(board); err != nil {
			log.Printf("Failed to send WebSocket message: %v", err)
			clientsMutex.Lock()
			delete(clients, conn)
			clientsMutex.Unlock()
			return
		}

		// Wait for client disconnect
		for {
			_, _, err := conn.ReadMessage()
			if err != nil {
				log.Printf("WebSocket read error: %v", err)
				clientsMutex.Lock()
				delete(clients, conn)
				clientsMutex.Unlock()
				break
			}
		}
	}
}

// broadcastBoardUpdate sends board updates to all WebSocket clients
func broadcastBoardUpdate(board models.Board) error {
	clientsMutex.Lock()
	defer clientsMutex.Unlock()

	var lastErr error
	for client := range clients {
		if err := client.WriteJSON(board); err != nil {
			log.Printf("Failed to send WebSocket message: %v", err)
			client.Close()
			delete(clients, client)
			lastErr = err
		}
	}
	return lastErr
}
