package main

import (
	"log"
	"net"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
	"google.golang.org/grpc"

	"github.com/seongha-moon/blog-code-example/performance/server/go/database"
	"github.com/seongha-moon/blog-code-example/performance/server/go/handlers"
	pb "github.com/seongha-moon/blog-code-example/performance/server/go/proto"
)

func main() {
	// Database connection
	dbHost := os.Getenv("DB_HOST")
	if dbHost == "" {
		dbHost = "localhost"
	}
	dbPort := os.Getenv("DB_PORT")
	if dbPort == "" {
		dbPort = "5432"
	}
	dbUser := os.Getenv("DB_USER")
	if dbUser == "" {
		dbUser = "postgres"
	}
	dbPassword := os.Getenv("DB_PASSWORD")
	if dbPassword == "" {
		dbPassword = "postgres"
	}
	dbName := os.Getenv("DB_NAME")
	if dbName == "" {
		dbName = "postgres"
	}

	// Initialize database
	db, err := database.InitDB(dbHost, dbPort, dbUser, dbPassword, dbName)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	// Create tables
	if err := database.CreateTables(db); err != nil {
		log.Fatalf("Failed to create tables: %v", err)
	}

	// Initialize servers
	wsServer := handlers.NewWebSocketServer(db)
	grpcServer := handlers.NewBoardServer(db)

	// HTTP & WebSocket server
	r := mux.NewRouter()
	r.HandleFunc("/api/boards", handlers.CreateBoardHandler(db)).Methods("POST")
	r.HandleFunc("/api/boards", handlers.GetBoardsHandler(db)).Methods("GET")
	r.HandleFunc("/ws/boards", wsServer.HandleWebSocket)

	// Start gRPC server
	go func() {
		lis, err := net.Listen("tcp", ":50051")
		if err != nil {
			log.Fatalf("Failed to listen for gRPC: %v", err)
		}
		s := grpc.NewServer()
		pb.RegisterBoardServiceServer(s, grpcServer)
		log.Printf("Starting gRPC server on :50051")
		if err := s.Serve(lis); err != nil {
			log.Fatalf("Failed to serve gRPC: %v", err)
		}
	}()

	// Start HTTP & WebSocket server
	log.Printf("Starting HTTP & WebSocket server on :8080")
	if err := http.ListenAndServe(":8080", r); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
