package info

import (
	"fmt"
	"strings"

	"github.com/trustwallet/go-primitives/coin"
)

//nolint:gochecknoglobals
var (
	requiredCoinFields = []string{
		"name", "type", "symbol", "decimals",
		"description", "website", "explorer", "status",
	}

	requiredAssetFields = []string{
		"name", "type", "symbol", "decimals",
		"description", "website", "explorer", "status", "id",
	}

	allowedStatusValues = []string{"active", "spam", "abandoned"}

	allowedLinkKeys = map[string]string{
		"github":        "https://github.com/",
		"whitepaper":    "",
		"twitter":       "https://twitter.com/",
		"telegram":      "https://t.me/",
		"telegram_news": "https://t.me/", // Read-only announcement channel.
		"medium":        "",              // URL contains 'medium.com'.
		"discord":       "https://discord.com/",
		"reddit":        "https://reddit.com/",
		"facebook":      "https://facebook.com/",
		"youtube":       "https://youtube.com/",
		"coinmarketcap": "https://coinmarketcap.com/",
		"coingecko":     "https://coingecko.com/",
		"blog":          "", // Blog, other than medium.
		"forum":         "", // Community site.
		"docs":          "",
		"source_code":   "", // Other than github.
	}

	whiteSpaceCharacters = []string{"\n", "  "}
)

func explorerURLAlternatives(chain, name string) []string {
	var altUrls []string

	if name != "" {
		nameNorm := strings.ReplaceAll(strings.ReplaceAll(strings.ReplaceAll(
			strings.ToLower(name), " ", ""), ")", ""), "(", "")

		if strings.ToLower(chain) == coin.Coins[coin.ETHEREUM].Name {
			altUrls = append(altUrls, fmt.Sprintf("https://etherscan.io/token/%s", nameNorm))
		}

		altUrls = append(altUrls, fmt.Sprintf("https://explorer.%s.io", nameNorm))
		altUrls = append(altUrls, fmt.Sprintf("https://scan.%s.io", nameNorm))
	}

	return altUrls
}

func linkNameAllowed(str string) bool {
	if _, exists := allowedLinkKeys[str]; !exists {
		return false
	}

	return true
}

func supportedLinkNames() []string {
	names := make([]string, 0, len(allowedLinkKeys))
	for k := range allowedLinkKeys {
		names = append(names, k)
	}

	return names
}
