package brtserver

import (
	"context"
	"embed"
	"encoding/json"
	"errors"
	"fmt"
	"html/template"
	"io"
	"io/fs"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"time"
)

//go:embed data/*.json
var embeddedData embed.FS

//go:embed static/templates/*.html static/public/*
var embeddedStatic embed.FS

type ReserveAddress struct {
	Address     string  `json:"address"`
	Description string  `json:"description"`
	BalanceBTC  float64 `json:"balance_btc"`
	LastProofTx string  `json:"last_proof_tx"`
}

type Attestation struct {
	ID       string `json:"id"`
	URL      string `json:"url"`
	Hash     string `json:"hash"`
	IssuedAt string `json:"issued_at"`
}

type SupplyEvent struct {
	Type        string  `json:"type"`
	Amount      float64 `json:"amount"`
	TxID        string  `json:"txid"`
	Description string  `json:"description"`
	Timestamp   string  `json:"timestamp"`
}

type rawProof struct {
	UpdatedAt         string           `json:"updated_at"`
	CollateralRatio   float64          `json:"collateral_ratio"`
	MaxSupply         float64          `json:"max_supply"`
	CirculatingSupply float64          `json:"circulating_supply"`
	BTCLocked         float64          `json:"btc_locked"`
	ReserveAddresses  []ReserveAddress `json:"reserve_addresses"`
	Attestations      []Attestation    `json:"attestations"`
	PendingMints      []SupplyEvent    `json:"pending_mints"`
	RecentBurns       []SupplyEvent    `json:"recent_burns"`
}

// ProofOfReserves represents the canonical state served to clients.
type ProofOfReserves struct {
	UpdatedAt         time.Time
	CollateralRatio   float64
	MaxSupply         float64
	CirculatingSupply float64
	BTCLocked         float64
	ReserveAddresses  []ReserveAddress
	Attestations      []Attestation
	PendingMints      []SupplyEvent
	RecentBurns       []SupplyEvent
}

// ForumCategory represents navigation items for the governance forum landing page.
type ForumCategory struct {
	Name        string
	Description string
	CreateURL   string
	Topics      []ForumTopic
}

// ForumTopic is a pre-seeded spotlight item.
type ForumTopic struct {
	Title        string
	URL          string
	Posts        int
	LastActivity time.Time
}

type Config struct {
	ListenAddr     string
	DataPath       string
	ReloadInterval time.Duration
}

var (
	tpl          *template.Template
	tplOnce      sync.Once
	stateMu      sync.RWMutex
	state        ProofOfReserves
	forumContent = []ForumCategory{
		{
			Name:        "Reserve Policy",
			Description: "Discuss collateral management, proof attestation cadence, and emergency response playbooks.",
			CreateURL:   "https://github.com/bitcoinrealtoken/integrations/issues/new?title=%5BReserve+Policy%5D+",
			Topics: []ForumTopic{
				{
					Title:        "Raising minimum collateral ratio to 108%",
					URL:          "https://github.com/bitcoinrealtoken/integrations/discussions/12",
					Posts:        34,
					LastActivity: time.Date(2025, 10, 29, 16, 45, 0, 0, time.UTC),
				},
				{
					Title:        "Introducing delegated attestations",
					URL:          "https://github.com/bitcoinrealtoken/integrations/discussions/9",
					Posts:        21,
					LastActivity: time.Date(2025, 10, 24, 10, 15, 0, 0, time.UTC),
				},
			},
		},
		{
			Name:        "Integrations",
			Description: "Wallets, custodians, and exchanges can coordinate API changes and rollout timelines.",
			CreateURL:   "https://github.com/bitcoinrealtoken/integrations/issues/new?title=%5BIntegration%5D+",
			Topics: []ForumTopic{
				{
					Title:        "BRT support for Lightning-enabled custodians",
					URL:          "https://github.com/bitcoinrealtoken/integrations/discussions/14",
					Posts:        18,
					LastActivity: time.Date(2025, 10, 27, 9, 30, 0, 0, time.UTC),
				},
				{
					Title:        "WebSockets feed: schema change preview",
					URL:          "https://github.com/bitcoinrealtoken/integrations/discussions/8",
					Posts:        11,
					LastActivity: time.Date(2025, 10, 20, 13, 5, 0, 0, time.UTC),
				},
			},
		},
		{
			Name:        "Community Proposals",
			Description: "Submit BRT improvement proposals, grant ideas, and feedback on roadmap priorities.",
			CreateURL:   "https://github.com/bitcoinrealtoken/integrations/issues/new?title=%5BProposal%5D+",
			Topics: []ForumTopic{
				{
					Title:        "Proposal #18: Collateral yield streaming to treasury",
					URL:          "https://github.com/bitcoinrealtoken/integrations/discussions/11",
					Posts:        42,
					LastActivity: time.Date(2025, 10, 23, 22, 0, 0, 0, time.UTC),
				},
				{
					Title:        "Grant request: hardware wallet support",
					URL:          "https://github.com/bitcoinrealtoken/integrations/discussions/7",
					Posts:        29,
					LastActivity: time.Date(2025, 10, 18, 18, 10, 0, 0, time.UTC),
				},
			},
		},
	}
)

// Run starts the HTTP server and blocks until the context is cancelled or an error occurs.
func Run(ctx context.Context, cfg Config) error {
	if cfg.ListenAddr == "" {
		cfg.ListenAddr = ":8080"
	}
	if cfg.ReloadInterval == 0 {
		cfg.ReloadInterval = 30 * time.Second
	}

	if err := loadState(cfg.DataPath); err != nil {
		return fmt.Errorf("load state: %w", err)
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/", handleRoot)
	mux.HandleFunc("/proof-of-reserves", handleProof)
	mux.HandleFunc("/forum", handleForum)
	mux.HandleFunc("/api/proof-of-reserves", handleAPIProof)
	mux.HandleFunc("/healthz", handleHealth)

	assetsFS, err := fs.Sub(embeddedStatic, "static/public")
	if err != nil {
		return fmt.Errorf("prepare assets fs: %w", err)
	}
	mux.Handle("/assets/", http.StripPrefix("/assets/", http.FileServer(http.FS(assetsFS))))

	srv := &http.Server{
		Addr:    cfg.ListenAddr,
		Handler: loggingMiddleware(mux),
	}

	errCh := make(chan error, 1)
	go func() {
		if cfg.DataPath != "" {
			ticker := time.NewTicker(cfg.ReloadInterval)
			defer ticker.Stop()
			for {
				select {
				case <-ctx.Done():
					return
				case <-ticker.C:
					if err := loadState(cfg.DataPath); err != nil {
						errCh <- fmt.Errorf("reload state: %w", err)
					}
				}
			}
		}
	}()

	go func() {
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			errCh <- err
		}
	}()

	select {
	case <-ctx.Done():
		shutdownCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		_ = srv.Shutdown(shutdownCtx)
		return nil
	case err := <-errCh:
		shutdownCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		_ = srv.Shutdown(shutdownCtx)
		return err
	}
}

func loadState(path string) error {
	var reader io.ReadCloser
	var err error

	switch {
	case path != "":
		reader, err = os.Open(filepath.Clean(path))
	default:
		reader, err = embeddedData.Open("data/latest.json")
	}
	if err != nil {
		return err
	}
	defer reader.Close()

	data, err := io.ReadAll(reader)
	if err != nil {
		return err
	}

	var raw rawProof
	if err := json.Unmarshal(data, &raw); err != nil {
		return err
	}

	parsedTime, err := time.Parse(time.RFC3339, raw.UpdatedAt)
	if err != nil {
		return fmt.Errorf("parse updated_at: %w", err)
	}

	stateMu.Lock()
	defer stateMu.Unlock()
	state = ProofOfReserves{
		UpdatedAt:         parsedTime,
		CollateralRatio:   raw.CollateralRatio,
		MaxSupply:         raw.MaxSupply,
		CirculatingSupply: raw.CirculatingSupply,
		BTCLocked:         raw.BTCLocked,
		ReserveAddresses:  cloneAddresses(raw.ReserveAddresses),
		Attestations:      cloneAttestations(raw.Attestations),
		PendingMints:      cloneEvents(raw.PendingMints),
		RecentBurns:       cloneEvents(raw.RecentBurns),
	}

	return nil
}

func cloneAddresses(in []ReserveAddress) []ReserveAddress {
	out := make([]ReserveAddress, len(in))
	copy(out, in)
	return out
}

func cloneAttestations(in []Attestation) []Attestation {
	out := make([]Attestation, len(in))
	copy(out, in)
	return out
}

func cloneEvents(in []SupplyEvent) []SupplyEvent {
	out := make([]SupplyEvent, len(in))
	copy(out, in)
	return out
}

func currentState() ProofOfReserves {
	stateMu.RLock()
	defer stateMu.RUnlock()

	return ProofOfReserves{
		UpdatedAt:         state.UpdatedAt,
		CollateralRatio:   state.CollateralRatio,
		MaxSupply:         state.MaxSupply,
		CirculatingSupply: state.CirculatingSupply,
		BTCLocked:         state.BTCLocked,
		ReserveAddresses:  cloneAddresses(state.ReserveAddresses),
		Attestations:      cloneAttestations(state.Attestations),
		PendingMints:      cloneEvents(state.PendingMints),
		RecentBurns:       cloneEvents(state.RecentBurns),
	}
}

func getTemplates() *template.Template {
	tplOnce.Do(func() {
		funcMap := template.FuncMap{
			"formatNumber": func(v float64, precision int) string {
				format := fmt.Sprintf("%%.%df", precision)
				value := strings.TrimRight(strings.TrimRight(fmt.Sprintf(format, v), "0"), ".")
				if value == "" {
					return "0"
				}
				return value
			},
			"formatPercent": func(v float64) string {
				return fmt.Sprintf("%.2f%%", v*100)
			},
			"formatRelative": func(t time.Time) string {
				if t.IsZero() {
					return "never"
				}
				delta := time.Since(t)
				if delta < time.Minute {
					return "just now"
				}
				if delta < time.Hour {
					return fmt.Sprintf("%d minutes ago", int(delta.Minutes()))
				}
				if delta < 24*time.Hour {
					return fmt.Sprintf("%d hours ago", int(delta.Hours()))
				}
				return fmt.Sprintf("%d days ago", int(delta.Hours()/24))
			},
			"formatDate": func(s string) string {
				t, err := time.Parse(time.RFC3339, s)
				if err != nil {
					return s
				}
				return t.Format("02 Jan 2006")
			},
			"formatDateTime": func(s string) string {
				t, err := time.Parse(time.RFC3339, s)
				if err != nil {
					return s
				}
				return t.Format(time.RFC822)
			},
			"title": func(s string) string {
				s = strings.ReplaceAll(s, "-", " ")
				words := strings.Fields(s)
				for i, word := range words {
					if len(word) == 0 {
						continue
					}
					lower := strings.ToLower(word)
					words[i] = strings.ToUpper(lower[:1]) + lower[1:]
				}
				return strings.Join(words, " ")
			},
		}

		tpl = template.Must(template.New("layout.html").Funcs(funcMap).
			ParseFS(embeddedStatic, "static/templates/layout.html", "static/templates/proof.html", "static/templates/forum.html"))
	})
	return tpl
}

func handleRoot(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		http.NotFound(w, r)
		return
	}
	http.Redirect(w, r, "/proof-of-reserves", http.StatusFound)
}

func handleProof(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	state := currentState()
	data := struct {
		Proof ProofOfReserves
		Now   time.Time
	}{
		Proof: state,
		Now:   time.Now().UTC(),
	}

	if err := getTemplates().ExecuteTemplate(w, "proof", struct {
		Proof ProofOfReserves
		Now   time.Time
	}{
		Proof: data.Proof,
		Now:   data.Now,
	}); err != nil {
		http.Error(w, fmt.Sprintf("template error: %v", err), http.StatusInternalServerError)
	}
}

func handleForum(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	snapshot := currentState()
	data := struct {
		Proof ProofOfReserves
		Forum struct {
			Categories []ForumCategory
		}
		Now time.Time
	}{
		Proof: snapshot,
		Forum: struct{ Categories []ForumCategory }{Categories: forumContent},
		Now:   time.Now().UTC(),
	}

	if err := getTemplates().ExecuteTemplate(w, "forum", data); err != nil {
		http.Error(w, fmt.Sprintf("template error: %v", err), http.StatusInternalServerError)
	}
}

func handleAPIProof(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	snapshot := currentState()
	response := struct {
		UpdatedAt         string           `json:"updated_at"`
		CollateralRatio   float64          `json:"collateral_ratio"`
		MaxSupply         float64          `json:"max_supply"`
		CirculatingSupply float64          `json:"circulating_supply"`
		BTCLocked         float64          `json:"btc_locked"`
		ReserveAddresses  []ReserveAddress `json:"reserve_addresses"`
		Attestations      []Attestation    `json:"attestations"`
		PendingMints      []SupplyEvent    `json:"pending_mints"`
		RecentBurns       []SupplyEvent    `json:"recent_burns"`
	}{
		UpdatedAt:         snapshot.UpdatedAt.Format(time.RFC3339),
		CollateralRatio:   snapshot.CollateralRatio,
		MaxSupply:         snapshot.MaxSupply,
		CirculatingSupply: snapshot.CirculatingSupply,
		BTCLocked:         snapshot.BTCLocked,
		ReserveAddresses:  snapshot.ReserveAddresses,
		Attestations:      snapshot.Attestations,
		PendingMints:      snapshot.PendingMints,
		RecentBurns:       snapshot.RecentBurns,
	}

	w.Header().Set("Content-Type", "application/json")
	encoder := json.NewEncoder(w)
	encoder.SetIndent("", "  ")
	if err := encoder.Encode(response); err != nil {
		http.Error(w, fmt.Sprintf("encode response: %v", err), http.StatusInternalServerError)
	}
}

func handleHealth(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	io.WriteString(w, `{"status":"ok"}`)
}

func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		ww := &responseWriter{ResponseWriter: w, status: http.StatusOK}
		next.ServeHTTP(ww, r)
		fmt.Printf("%s %s %d %s\n", r.Method, r.URL.Path, ww.status, time.Since(start).Round(time.Millisecond))
	})
}

type responseWriter struct {
	http.ResponseWriter
	status int
}

func (rw *responseWriter) WriteHeader(code int) {
	rw.status = code
	rw.ResponseWriter.WriteHeader(code)
}
