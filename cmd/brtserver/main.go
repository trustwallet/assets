package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/trustwallet/assets/internal/brtserver"
)

func main() {
	listen := flag.String("listen", ":8080", "address to listen on (example: :8080)")
	dataPath := flag.String("data", "", "optional path to JSON proof-of-reserves dataset")
	reload := flag.Duration("reload", 30*time.Second, "reload interval for the data file (only when --data is set)")
	flag.Parse()

	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	cfg := brtserver.Config{
		ListenAddr:     *listen,
		DataPath:       *dataPath,
		ReloadInterval: *reload,
	}

	log.Printf("Bitcoin Real Token server starting on %s", cfg.ListenAddr)
	if cfg.DataPath != "" {
		log.Printf("Using external data file: %s (reload interval %s)", cfg.DataPath, cfg.ReloadInterval)
	} else {
		log.Printf("Using embedded proof-of-reserves snapshot")
	}

	if err := brtserver.Run(ctx, cfg); err != nil {
		fmt.Fprintf(os.Stderr, "server error: %v\n", err)
		os.Exit(1)
	}

	log.Println("Server stopped")
}
