package info

type (
	CoinModel struct {
		Name        *string  `json:"name,omitempty"`
		Website     *string  `json:"website,omitempty"`
		Description *string  `json:"description,omitempty"`
		Explorer    *string  `json:"explorer,omitempty"`
		Research    string   `json:"research,omitempty"`
		Symbol      *string  `json:"symbol,omitempty"`
		Type        *string  `json:"type,omitempty"`
		Decimals    *int     `json:"decimals,omitempty"`
		Status      *string  `json:"status,omitempty"`
		Tags        []string `json:"tags,omitempty"`
		Links       []Link   `json:"links,omitempty"`
	}

	AssetModel struct {
		Name          *string  `json:"name,omitempty"`
		Symbol        *string  `json:"symbol,omitempty"`
		Type          *string  `json:"type,omitempty"`
		Decimals      *int     `json:"decimals,omitempty"`
		Description   *string  `json:"description,omitempty"`
		Website       *string  `json:"website,omitempty"`
		Explorer      *string  `json:"explorer,omitempty"`
		Research      string   `json:"research,omitempty"`
		Status        *string  `json:"status,omitempty"`
		ID            *string  `json:"id,omitempty"`
		Links         []Link   `json:"links,omitempty"`
		ShortDesc     *string  `json:"short_desc,omitempty"`
		Audit         *string  `json:"audit,omitempty"`
		AuditReport   *string  `json:"audit_report,omitempty"`
		Tags          []string `json:"tags,omitempty"`
		Code          *string  `json:"code,omitempty"`
		Ticker        *string  `json:"ticker,omitempty"`
		ExplorerEth   *string  `json:"explorer-ETH,omitempty"`
		Address       *string  `json:"address,omitempty"`
		Twitter       *string  `json:"twitter,omitempty"`
		CoinMarketcap *string  `json:"coinmarketcap,omitempty"`
		DataSource    *string  `json:"data_source,omitempty"`
	}

	Link struct {
		Name *string `json:"name,omitempty"`
		URL  *string `json:"url,omitempty"`
	}
)

func (a *AssetModel) GetStatus() string {
	if a.Status == nil {
		return ""
	}

	return *a.Status
}
