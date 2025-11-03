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
	BTCPriceUSD       float64          `json:"btc_price_usd"`
	BRTMarketPriceUSD float64          `json:"brt_market_price_usd"`
	LiquidityDepthUSD float64          `json:"liquidity_depth_usd"`
	TreasuryYieldBps  int              `json:"treasury_yield_bps"`
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
	BTCPriceUSD       float64
	BRTMarketPriceUSD float64
	NAVPerTokenUSD    float64
	PremiumDiscount   float64
	MarketCapUSD      float64
	FullyDilutedUSD   float64
	CollateralValue   float64
	LiquidityDepthUSD float64
	TreasuryYieldBps  int
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

func applyDefaults(cfg Config) Config {
	if cfg.ListenAddr == "" {
		cfg.ListenAddr = ":8080"
	}
	if cfg.ReloadInterval == 0 {
		cfg.ReloadInterval = 30 * time.Second
	}
	return cfg
}

func newMux() (*http.ServeMux, error) {
	mux := http.NewServeMux()
	mux.HandleFunc("/", handleRoot)
	mux.HandleFunc("/proof-of-reserves", handleProof)
	mux.HandleFunc("/forum", handleForum)
	mux.HandleFunc("/api/proof-of-reserves", handleAPIProof)
	mux.HandleFunc("/healthz", handleHealth)

	assetsFS, err := fs.Sub(embeddedStatic, "static/public")
	if err != nil {
		return nil, fmt.Errorf("prepare assets fs: %w", err)
	}
	mux.Handle("/assets/", http.StripPrefix("/assets/", http.FileServer(http.FS(assetsFS))))

	return mux, nil
}

func watchStateReload(ctx context.Context, dataPath string, interval time.Duration, errCh chan<- error) {
	if dataPath == "" {
		return
	}

	ticker := time.NewTicker(interval)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			if err := loadState(dataPath); err != nil {
				select {
				case errCh <- fmt.Errorf("reload state: %w", err):
				default:
				}
			}
		}
	}
}

func serveHTTP(srv *http.Server, errCh chan<- error) {
	if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
		errCh <- err
	}
}

func waitForShutdown(ctx context.Context, srv *http.Server, errCh <-chan error) error {
	select {
	case <-ctx.Done():
		gracefulShutdown(srv)
		return nil
	case err := <-errCh:
		gracefulShutdown(srv)
		return err
	}
}

func gracefulShutdown(srv *http.Server) {
	shutdownCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	_ = srv.Shutdown(shutdownCtx)
}

// Run starts the HTTP server and blocks until the context is canceled or an error occurs.
func Run(ctx context.Context, cfg Config) error {
	cfg = applyDefaults(cfg)

	if err := loadState(cfg.DataPath); err != nil {
		return fmt.Errorf("load state: %w", err)
	}

	mux, err := newMux()
	if err != nil {
		return err
	}

	srv := &http.Server{
		Addr:    cfg.ListenAddr,
		Handler: loggingMiddleware(mux),
	}

	errCh := make(chan error, 1)
	go watchStateReload(ctx, cfg.DataPath, cfg.ReloadInterval, errCh)
	go serveHTTP(srv, errCh)

	return waitForShutdown(ctx, srv, errCh)
}

func loadState(path string) error {
	reader, err := openStateSource(path)
	if err != nil {
		return err
	}
	defer reader.Close()

	data, err := io.ReadAll(reader)
	if err != nil {
		return err
	}

	raw, err := decodeProof(data)
	if err != nil {
		return err
	}

	proof, err := buildProof(raw)
	if err != nil {
		return err
	}

	setState(proof)
	return nil
}

func openStateSource(path string) (io.ReadCloser, error) {
	if path != "" {
		return os.Open(filepath.Clean(path))
	}
	return embeddedData.Open("data/latest.json")
}

func decodeProof(data []byte) (rawProof, error) {
	var raw rawProof
	if err := json.Unmarshal(data, &raw); err != nil {
		return rawProof{}, err
	}
	return raw, nil
}

func buildProof(raw rawProof) (ProofOfReserves, error) {
	parsedTime, err := time.Parse(time.RFC3339, raw.UpdatedAt)
	if err != nil {
		return ProofOfReserves{}, fmt.Errorf("parse updated_at: %w", err)
	}

	navPerToken := 0.0
	if raw.CirculatingSupply > 0 {
		navPerToken = (raw.BTCLocked * raw.BTCPriceUSD) / raw.CirculatingSupply
	}

	premiumDiscount := 0.0
	if navPerToken > 0 {
		premiumDiscount = (raw.BRTMarketPriceUSD - navPerToken) / navPerToken
	}

	proof := ProofOfReserves{
		UpdatedAt:         parsedTime,
		CollateralRatio:   raw.CollateralRatio,
		MaxSupply:         raw.MaxSupply,
		CirculatingSupply: raw.CirculatingSupply,
		BTCLocked:         raw.BTCLocked,
		BTCPriceUSD:       raw.BTCPriceUSD,
		BRTMarketPriceUSD: raw.BRTMarketPriceUSD,
		NAVPerTokenUSD:    navPerToken,
		PremiumDiscount:   premiumDiscount,
		MarketCapUSD:      raw.BRTMarketPriceUSD * raw.CirculatingSupply,
		FullyDilutedUSD:   raw.BRTMarketPriceUSD * raw.MaxSupply,
		CollateralValue:   raw.BTCLocked * raw.BTCPriceUSD,
		LiquidityDepthUSD: raw.LiquidityDepthUSD,
		TreasuryYieldBps:  raw.TreasuryYieldBps,
		ReserveAddresses:  cloneAddresses(raw.ReserveAddresses),
		Attestations:      cloneAttestations(raw.Attestations),
		PendingMints:      cloneEvents(raw.PendingMints),
		RecentBurns:       cloneEvents(raw.RecentBurns),
	}

	return proof, nil
}

func setState(next ProofOfReserves) {
	stateMu.Lock()
	defer stateMu.Unlock()
	state = next
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
		BTCPriceUSD:       state.BTCPriceUSD,
		BRTMarketPriceUSD: state.BRTMarketPriceUSD,
		NAVPerTokenUSD:    state.NAVPerTokenUSD,
		PremiumDiscount:   state.PremiumDiscount,
		MarketCapUSD:      state.MarketCapUSD,
		FullyDilutedUSD:   state.FullyDilutedUSD,
		CollateralValue:   state.CollateralValue,
		LiquidityDepthUSD: state.LiquidityDepthUSD,
		TreasuryYieldBps:  state.TreasuryYieldBps,
		ReserveAddresses:  cloneAddresses(state.ReserveAddresses),
		Attestations:      cloneAttestations(state.Attestations),
		PendingMints:      cloneEvents(state.PendingMints),
		RecentBurns:       cloneEvents(state.RecentBurns),
	}
}

func templateFuncMap() template.FuncMap {
	return template.FuncMap{
		"formatNumber":        formatNumber,
		"formatPercent":       formatPercent,
		"formatSignedPercent": formatSignedPercent,
		"formatCurrency":      formatCurrency,
		"formatBPS":           formatBPS,
		"formatRelative":      formatRelative,
		"formatDate":          formatDate,
		"formatDateTime":      formatDateTime,
		"title":               title,
	}
}

func formatNumber(v float64, precision int) string {
	format := fmt.Sprintf("%%.%df", precision)
	value := strings.TrimRight(strings.TrimRight(fmt.Sprintf(format, v), "0"), ".")
	if value == "" {
		return "0"
	}
	return value
}

func formatPercent(v float64) string {
	return fmt.Sprintf("%.2f%%", v*100)
}

func formatSignedPercent(v float64) string {
	formatted := formatPercent(v)
	if v > 0 {
		return "+" + formatted
	}
	return formatted
}

func formatCurrency(v float64, precision int) string {
	if precision == 0 {
		rounded := int64(v + 0.5)
		if v < 0 {
			rounded = int64(v - 0.5)
		}
		return "$" + addCommas(fmt.Sprintf("%d", rounded))
	}

	s := fmt.Sprintf("%.*f", precision, v)
	if strings.Contains(s, ".") {
		s = strings.TrimRight(s, "0")
		s = strings.TrimRight(s, ".")
	}
	return "$" + addCommas(s)
}

func addCommas(s string) string {
	neg := ""
	if strings.HasPrefix(s, "-") {
		neg = "-"
		s = s[1:]
	}

	intPart := s
	fracPart := ""
	if dot := strings.Index(s, "."); dot != -1 {
		intPart = s[:dot]
		fracPart = s[dot:]
	}

	if len(intPart) <= 3 {
		return neg + intPart + fracPart
	}

	var builder strings.Builder
	for i, r := range intPart {
		if i != 0 && (len(intPart)-i)%3 == 0 {
			builder.WriteByte(',')
		}
		builder.WriteByte(byte(r))
	}

	return neg + builder.String() + fracPart
}

func formatBPS(v int) string {
	return fmt.Sprintf("%.2f%%", float64(v)/100.0)
}

func formatRelative(t time.Time) string {
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
}

func formatDate(s string) string {
	t, err := time.Parse(time.RFC3339, s)
	if err != nil {
		return s
	}
	return t.Format("02 Jan 2006")
}

func formatDateTime(s string) string {
	t, err := time.Parse(time.RFC3339, s)
	if err != nil {
		return s
	}
	return t.Format(time.RFC822)
}

func title(s string) string {
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
}

func getTemplates() *template.Template {
	tplOnce.Do(func() {
		tpl = template.Must(
			template.New("layout.html").Funcs(templateFuncMap()).ParseFS(
				embeddedStatic,
				"static/templates/layout.html",
				"static/templates/proof.html",
				"static/templates/forum.html",
			),
		)
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
		BTCPriceUSD       float64          `json:"btc_price_usd"`
		BRTMarketPriceUSD float64          `json:"brt_market_price_usd"`
		NAVPerTokenUSD    float64          `json:"nav_per_token_usd"`
		PremiumDiscount   float64          `json:"premium_discount"`
		MarketCapUSD      float64          `json:"market_cap_usd"`
		FullyDilutedUSD   float64          `json:"fully_diluted_value_usd"`
		CollateralValue   float64          `json:"collateral_value_usd"`
		LiquidityDepthUSD float64          `json:"liquidity_depth_usd"`
		TreasuryYieldBps  int              `json:"treasury_yield_bps"`
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
		BTCPriceUSD:       snapshot.BTCPriceUSD,
		BRTMarketPriceUSD: snapshot.BRTMarketPriceUSD,
		NAVPerTokenUSD:    snapshot.NAVPerTokenUSD,
		PremiumDiscount:   snapshot.PremiumDiscount,
		MarketCapUSD:      snapshot.MarketCapUSD,
		FullyDilutedUSD:   snapshot.FullyDilutedUSD,
		CollateralValue:   snapshot.CollateralValue,
		LiquidityDepthUSD: snapshot.LiquidityDepthUSD,
		TreasuryYieldBps:  snapshot.TreasuryYieldBps,
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
