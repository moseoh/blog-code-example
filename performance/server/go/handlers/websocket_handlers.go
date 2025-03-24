package handlers

import (
	"database/sql"
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
	"github.com/seongha-moon/blog-code-example/performance/server/go/models"
)

type WebSocketServer struct {
	db           *sql.DB
	clients      map[*websocket.Conn]bool
	clientsMutex sync.Mutex
	upgrader     websocket.Upgrader
}

func NewWebSocketServer(db *sql.DB) *WebSocketServer {
	return &WebSocketServer{
		db:      db,
		clients: make(map[*websocket.Conn]bool),
		upgrader: websocket.Upgrader{
			ReadBufferSize:  1024,
			WriteBufferSize: 1024,
			CheckOrigin: func(r *http.Request) bool {
				return true
			},
		},
	}
}

func (s *WebSocketServer) HandleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := s.upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("Failed to upgrade WebSocket: %v", err)
		return
	}
	defer conn.Close()

	s.clientsMutex.Lock()
	s.clients[conn] = true
	s.clientsMutex.Unlock()

	board, err := models.GetLatestBoard(s.db)
	if err != nil {
		log.Printf("Failed to get board: %v", err)
		return
	}

	if err := conn.WriteJSON(board); err != nil {
		log.Printf("Failed to send WebSocket message: %v", err)
		s.clientsMutex.Lock()
		delete(s.clients, conn)
		s.clientsMutex.Unlock()
		return
	}

	for {
		_, _, err := conn.ReadMessage()
		if err != nil {
			log.Printf("WebSocket read error: %v", err)
			s.clientsMutex.Lock()
			delete(s.clients, conn)
			s.clientsMutex.Unlock()
			break
		}
	}
}

func (s *WebSocketServer) BroadcastUpdate(board models.Board) error {
	s.clientsMutex.Lock()
	defer s.clientsMutex.Unlock()

	var lastErr error
	for client := range s.clients {
		if err := client.WriteJSON(board); err != nil {
			log.Printf("Failed to send WebSocket message: %v", err)
			client.Close()
			delete(s.clients, client)
			lastErr = err
		}
	}
	return lastErr
}
