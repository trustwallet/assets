package info

import (
	"encoding/json"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"testing"

	"github.com/trustwallet/go-primitives/coin"
)

// repoRoot returns the absolute path to the repository root.
func repoRoot(t *testing.T) string {
	t.Helper()

	_, filename, _, ok := runtime.Caller(0)
	if !ok {
		t.Fatal("unable to determine caller file")
	}

	// internal/info/twt_info_test.go -> repo root is two directories up
	return filepath.Join(filepath.Dir(filename), "..", "..")
}

// loadAssetInfo reads and unmarshals an info.json from the given path relative to the repo root.
func loadAssetInfo(t *testing.T, relPath string) AssetModel {
	t.Helper()

	fullPath := filepath.Join(repoRoot(t), relPath)

	data, err := os.ReadFile(fullPath)
	if err != nil {
		t.Fatalf("failed to read %s: %v", relPath, err)
	}

	var model AssetModel
	if err := json.Unmarshal(data, &model); err != nil {
		t.Fatalf("failed to unmarshal %s: %v", relPath, err)
	}

	return model
}

// ptr returns a pointer to the given string.
func ptr(s string) *string {
	return &s
}

// intPtr returns a pointer to the given int.
func intPtr(i int) *int {
	return &i
}

// TestTWTInfoJSON_ValidJSON verifies that all modified TWT info.json files are valid JSON.
func TestTWTInfoJSON_ValidJSON(t *testing.T) {
	files := []string{
		"blockchains/binance/assets/TWT-8C2/info.json",
		"blockchains/smartchain/assets/0x4B0F1812e5Df2A09796481Ff14017e6005508003/info.json",
		"blockchains/solana/assets/HZNpqL7RT9gxf9eWoWsWzC5DfjzQ41XTQgEA7p3VzaaD/info.json",
	}

	for _, f := range files {
		t.Run(f, func(t *testing.T) {
			fullPath := filepath.Join(repoRoot(t), f)

			data, err := os.ReadFile(fullPath)
			if err != nil {
				t.Fatalf("failed to read file: %v", err)
			}

			if !json.Valid(data) {
				t.Errorf("file contains invalid JSON: %s", f)
			}
		})
	}
}

// TestTWTInfoJSON_RequiredKeys verifies that all modified TWT info.json files have required fields.
func TestTWTInfoJSON_RequiredKeys(t *testing.T) {
	files := []string{
		"blockchains/binance/assets/TWT-8C2/info.json",
		"blockchains/smartchain/assets/0x4B0F1812e5Df2A09796481Ff14017e6005508003/info.json",
		"blockchains/solana/assets/HZNpqL7RT9gxf9eWoWsWzC5DfjzQ41XTQgEA7p3VzaaD/info.json",
	}

	for _, f := range files {
		t.Run(f, func(t *testing.T) {
			model := loadAssetInfo(t, f)

			if err := ValidateAssetRequiredKeys(model); err != nil {
				t.Errorf("missing required keys: %v", err)
			}
		})
	}
}

// TestTWTInfoJSON_CoinMarketCapLink verifies that all TWT info.json files contain
// a correctly formatted CoinMarketCap link.
func TestTWTInfoJSON_CoinMarketCapLink(t *testing.T) {
	files := []string{
		"blockchains/binance/assets/TWT-8C2/info.json",
		"blockchains/smartchain/assets/0x4B0F1812e5Df2A09796481Ff14017e6005508003/info.json",
		"blockchains/solana/assets/HZNpqL7RT9gxf9eWoWsWzC5DfjzQ41XTQgEA7p3VzaaD/info.json",
	}

	expectedCMCURL := "https://coinmarketcap.com/currencies/trust-wallet-token/"

	for _, f := range files {
		t.Run(f, func(t *testing.T) {
			model := loadAssetInfo(t, f)

			var found bool
			for _, link := range model.Links {
				if link.Name != nil && *link.Name == "coinmarketcap" {
					found = true
					if link.URL == nil {
						t.Error("coinmarketcap link has nil URL")
						break
					}
					if *link.URL != expectedCMCURL {
						t.Errorf("coinmarketcap URL = %q, want %q", *link.URL, expectedCMCURL)
					}
					break
				}
			}

			if !found {
				t.Error("coinmarketcap link not found in links array")
			}
		})
	}
}

// TestTWTInfoJSON_LinksValidation runs the ValidateLinks validator on each modified TWT info.json.
func TestTWTInfoJSON_LinksValidation(t *testing.T) {
	files := []string{
		"blockchains/binance/assets/TWT-8C2/info.json",
		"blockchains/smartchain/assets/0x4B0F1812e5Df2A09796481Ff14017e6005508003/info.json",
		"blockchains/solana/assets/HZNpqL7RT9gxf9eWoWsWzC5DfjzQ41XTQgEA7p3VzaaD/info.json",
	}

	for _, f := range files {
		t.Run(f, func(t *testing.T) {
			model := loadAssetInfo(t, f)

			if err := ValidateLinks(model.Links); err != nil {
				t.Errorf("links validation failed: %v", err)
			}
		})
	}
}

// TestTWTInfoJSON_StatusValidation verifies each TWT info.json has a valid status.
func TestTWTInfoJSON_StatusValidation(t *testing.T) {
	files := []string{
		"blockchains/binance/assets/TWT-8C2/info.json",
		"blockchains/smartchain/assets/0x4B0F1812e5Df2A09796481Ff14017e6005508003/info.json",
		"blockchains/solana/assets/HZNpqL7RT9gxf9eWoWsWzC5DfjzQ41XTQgEA7p3VzaaD/info.json",
	}

	for _, f := range files {
		t.Run(f, func(t *testing.T) {
			model := loadAssetInfo(t, f)

			if model.Status == nil {
				t.Fatal("status field is nil")
			}

			if err := ValidateStatus(*model.Status); err != nil {
				t.Errorf("status validation failed: %v", err)
			}
		})
	}
}

// TestTWTInfoJSON_DescriptionValidation verifies each TWT info.json has a valid description.
func TestTWTInfoJSON_DescriptionValidation(t *testing.T) {
	files := []string{
		"blockchains/binance/assets/TWT-8C2/info.json",
		"blockchains/smartchain/assets/0x4B0F1812e5Df2A09796481Ff14017e6005508003/info.json",
		"blockchains/solana/assets/HZNpqL7RT9gxf9eWoWsWzC5DfjzQ41XTQgEA7p3VzaaD/info.json",
	}

	for _, f := range files {
		t.Run(f, func(t *testing.T) {
			model := loadAssetInfo(t, f)

			if model.Description == nil {
				t.Fatal("description field is nil")
			}

			if err := ValidateDescription(*model.Description); err != nil {
				t.Errorf("description validation failed: %v", err)
			}
		})
	}
}

// TestTWTInfoJSON_DecimalsValidation verifies each TWT info.json has valid decimals.
func TestTWTInfoJSON_DecimalsValidation(t *testing.T) {
	tests := []struct {
		name     string
		file     string
		wantType string
		wantDec  int
	}{
		{
			name:     "binance_BEP2",
			file:     "blockchains/binance/assets/TWT-8C2/info.json",
			wantType: "BEP2",
			wantDec:  8,
		},
		{
			name:     "smartchain_BEP20",
			file:     "blockchains/smartchain/assets/0x4B0F1812e5Df2A09796481Ff14017e6005508003/info.json",
			wantType: "BEP20",
			wantDec:  18,
		},
		{
			name:     "solana_SPL",
			file:     "blockchains/solana/assets/HZNpqL7RT9gxf9eWoWsWzC5DfjzQ41XTQgEA7p3VzaaD/info.json",
			wantType: "SPL",
			wantDec:  8,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			model := loadAssetInfo(t, tt.file)

			if model.Decimals == nil {
				t.Fatal("decimals field is nil")
			}
			if model.Type == nil {
				t.Fatal("type field is nil")
			}

			if *model.Type != tt.wantType {
				t.Errorf("type = %q, want %q", *model.Type, tt.wantType)
			}
			if *model.Decimals != tt.wantDec {
				t.Errorf("decimals = %d, want %d", *model.Decimals, tt.wantDec)
			}

			if err := ValidateDecimals(*model.Decimals); err != nil {
				t.Errorf("decimals validation failed: %v", err)
			}

			if err := ValidateAssetDecimalsAccordingType(*model.Type, *model.Decimals); err != nil {
				t.Errorf("decimals according to type validation failed: %v", err)
			}
		})
	}
}

// TestTWTInfoJSON_AssetIDValidation verifies that ID field matches the expected address.
func TestTWTInfoJSON_AssetIDValidation(t *testing.T) {
	tests := []struct {
		name    string
		file    string
		address string
	}{
		{
			name:    "binance",
			file:    "blockchains/binance/assets/TWT-8C2/info.json",
			address: "TWT-8C2",
		},
		{
			name:    "smartchain",
			file:    "blockchains/smartchain/assets/0x4B0F1812e5Df2A09796481Ff14017e6005508003/info.json",
			address: "0x4B0F1812e5Df2A09796481Ff14017e6005508003",
		},
		{
			name:    "solana",
			file:    "blockchains/solana/assets/HZNpqL7RT9gxf9eWoWsWzC5DfjzQ41XTQgEA7p3VzaaD/info.json",
			address: "HZNpqL7RT9gxf9eWoWsWzC5DfjzQ41XTQgEA7p3VzaaD",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			model := loadAssetInfo(t, tt.file)

			if model.ID == nil {
				t.Fatal("id field is nil")
			}

			if err := ValidateAssetID(*model.ID, tt.address); err != nil {
				t.Errorf("asset ID validation failed: %v", err)
			}
		})
	}
}

// TestTWTInfoJSON_FullAssetValidation runs the composite ValidateAsset validator on
// each modified TWT info.json.
func TestTWTInfoJSON_FullAssetValidation(t *testing.T) {
	tests := []struct {
		name    string
		file    string
		chain   coin.Coin
		address string
	}{
		{
			name:    "binance",
			file:    "blockchains/binance/assets/TWT-8C2/info.json",
			chain:   coin.Binance(),
			address: "TWT-8C2",
		},
		{
			name:    "smartchain",
			file:    "blockchains/smartchain/assets/0x4B0F1812e5Df2A09796481Ff14017e6005508003/info.json",
			chain:   coin.Smartchain(),
			address: "0x4B0F1812e5Df2A09796481Ff14017e6005508003",
		},
		{
			name:    "solana",
			file:    "blockchains/solana/assets/HZNpqL7RT9gxf9eWoWsWzC5DfjzQ41XTQgEA7p3VzaaD/info.json",
			chain:   coin.Solana(),
			address: "HZNpqL7RT9gxf9eWoWsWzC5DfjzQ41XTQgEA7p3VzaaD",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			model := loadAssetInfo(t, tt.file)

			if err := ValidateAsset(model, tt.chain, tt.address); err != nil {
				t.Errorf("full asset validation failed: %v", err)
			}
		})
	}
}

// TestSpamTokenInfoJSON verifies the new spam token entry is valid.
func TestSpamTokenInfoJSON(t *testing.T) {
	f := "blockchains/smartchain/assets/0xF11215614946E7990842b96F998B4797187D8888/info.json"

	t.Run("valid_json", func(t *testing.T) {
		fullPath := filepath.Join(repoRoot(t), f)
		data, err := os.ReadFile(fullPath)
		if err != nil {
			t.Fatalf("failed to read file: %v", err)
		}
		if !json.Valid(data) {
			t.Error("file contains invalid JSON")
		}
	})

	t.Run("required_keys", func(t *testing.T) {
		model := loadAssetInfo(t, f)
		if err := ValidateAssetRequiredKeys(model); err != nil {
			t.Errorf("missing required keys: %v", err)
		}
	})

	t.Run("status_is_spam", func(t *testing.T) {
		model := loadAssetInfo(t, f)
		if model.Status == nil {
			t.Fatal("status field is nil")
		}
		if *model.Status != "spam" {
			t.Errorf("status = %q, want %q", *model.Status, "spam")
		}
		if err := ValidateStatus(*model.Status); err != nil {
			t.Errorf("status validation failed: %v", err)
		}
	})

	t.Run("id_matches_address", func(t *testing.T) {
		model := loadAssetInfo(t, f)
		if model.ID == nil {
			t.Fatal("id field is nil")
		}
		if err := ValidateAssetID(*model.ID, "0xF11215614946E7990842b96F998B4797187D8888"); err != nil {
			t.Errorf("asset ID validation failed: %v", err)
		}
	})

	t.Run("type_is_BEP20", func(t *testing.T) {
		model := loadAssetInfo(t, f)
		if model.Type == nil {
			t.Fatal("type field is nil")
		}
		if *model.Type != "BEP20" {
			t.Errorf("type = %q, want %q", *model.Type, "BEP20")
		}
	})

	t.Run("decimals_valid", func(t *testing.T) {
		model := loadAssetInfo(t, f)
		if model.Decimals == nil {
			t.Fatal("decimals field is nil")
		}
		if err := ValidateDecimals(*model.Decimals); err != nil {
			t.Errorf("decimals validation failed: %v", err)
		}
	})

	t.Run("description_valid", func(t *testing.T) {
		model := loadAssetInfo(t, f)
		if model.Description == nil {
			t.Fatal("description field is nil")
		}
		if err := ValidateDescription(*model.Description); err != nil {
			t.Errorf("description validation failed: %v", err)
		}
	})

	t.Run("full_asset_validation", func(t *testing.T) {
		model := loadAssetInfo(t, f)
		if err := ValidateAsset(model, coin.Smartchain(), "0xF11215614946E7990842b96F998B4797187D8888"); err != nil {
			t.Errorf("full asset validation failed: %v", err)
		}
	})
}

// TestValidateLinks_CoinMarketCapPrefix validates the coinmarketcap URL prefix rule.
func TestValidateLinks_CoinMarketCapPrefix(t *testing.T) {
	tests := []struct {
		name    string
		links   []Link
		wantErr bool
	}{
		{
			name: "valid_coinmarketcap_link",
			links: []Link{
				{Name: ptr("github"), URL: ptr("https://github.com/trustwallet")},
				{Name: ptr("coinmarketcap"), URL: ptr("https://coinmarketcap.com/currencies/trust-wallet-token/")},
			},
			wantErr: false,
		},
		{
			name: "invalid_coinmarketcap_prefix",
			links: []Link{
				{Name: ptr("github"), URL: ptr("https://github.com/trustwallet")},
				{Name: ptr("coinmarketcap"), URL: ptr("https://example.com/currencies/trust-wallet-token/")},
			},
			wantErr: true,
		},
		{
			name: "coinmarketcap_without_https",
			links: []Link{
				{Name: ptr("github"), URL: ptr("https://github.com/trustwallet")},
				{Name: ptr("coinmarketcap"), URL: ptr("http://coinmarketcap.com/currencies/trust-wallet-token/")},
			},
			wantErr: true,
		},
		{
			name: "multiple_valid_links_with_cmc",
			links: []Link{
				{Name: ptr("github"), URL: ptr("https://github.com/trustwallet")},
				{Name: ptr("x"), URL: ptr("https://x.com/trustwallet")},
				{Name: ptr("reddit"), URL: ptr("https://reddit.com/r/trustapp")},
				{Name: ptr("coinmarketcap"), URL: ptr("https://coinmarketcap.com/currencies/trust-wallet-token/")},
			},
			wantErr: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := ValidateLinks(tt.links)
			if (err != nil) != tt.wantErr {
				t.Errorf("ValidateLinks() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

// TestValidateLinks_AllLinkTypes validates various allowed link types.
func TestValidateLinks_AllLinkTypes(t *testing.T) {
	tests := []struct {
		name    string
		links   []Link
		wantErr bool
	}{
		{
			name: "valid_github_and_x",
			links: []Link{
				{Name: ptr("github"), URL: ptr("https://github.com/trustwallet")},
				{Name: ptr("x"), URL: ptr("https://x.com/trustwallet")},
			},
			wantErr: false,
		},
		{
			name: "invalid_link_name",
			links: []Link{
				{Name: ptr("github"), URL: ptr("https://github.com/trustwallet")},
				{Name: ptr("twitter"), URL: ptr("https://twitter.com/trustwallet")},
			},
			wantErr: true,
		},
		{
			name: "nil_link_name",
			links: []Link{
				{Name: ptr("github"), URL: ptr("https://github.com/trustwallet")},
				{Name: nil, URL: ptr("https://example.com")},
			},
			wantErr: true,
		},
		{
			name: "nil_link_url",
			links: []Link{
				{Name: ptr("github"), URL: ptr("https://github.com/trustwallet")},
				{Name: ptr("x"), URL: nil},
			},
			wantErr: true,
		},
		{
			name: "single_link_skips_validation",
			links: []Link{
				{Name: ptr("github"), URL: ptr("https://github.com/trustwallet")},
			},
			wantErr: false,
		},
		{
			name: "empty_links_skips_validation",
			links: []Link{},
			wantErr: false,
		},
		{
			name: "github_wrong_prefix",
			links: []Link{
				{Name: ptr("github"), URL: ptr("https://gitlab.com/trustwallet")},
				{Name: ptr("x"), URL: ptr("https://x.com/trustwallet")},
			},
			wantErr: true,
		},
		{
			name: "reddit_valid_prefix",
			links: []Link{
				{Name: ptr("github"), URL: ptr("https://github.com/trustwallet")},
				{Name: ptr("reddit"), URL: ptr("https://reddit.com/r/trustapp")},
			},
			wantErr: false,
		},
		{
			name: "coingecko_valid",
			links: []Link{
				{Name: ptr("github"), URL: ptr("https://github.com/trustwallet")},
				{Name: ptr("coingecko"), URL: ptr("https://coingecko.com/en/coins/trust-wallet-token")},
			},
			wantErr: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := ValidateLinks(tt.links)
			if (err != nil) != tt.wantErr {
				t.Errorf("ValidateLinks() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

// TestTWTInfoJSON_ConsistentData verifies that all TWT info.json files across chains
// have consistent name, symbol, and description.
func TestTWTInfoJSON_ConsistentData(t *testing.T) {
	files := []string{
		"blockchains/binance/assets/TWT-8C2/info.json",
		"blockchains/smartchain/assets/0x4B0F1812e5Df2A09796481Ff14017e6005508003/info.json",
		"blockchains/solana/assets/HZNpqL7RT9gxf9eWoWsWzC5DfjzQ41XTQgEA7p3VzaaD/info.json",
	}

	var (
		expectedName   = "Trust Wallet"
		expectedSymbol = "TWT"
		expectedDesc   = "Utility token to increase adoption of cryptocurrency."
	)

	for _, f := range files {
		t.Run(f, func(t *testing.T) {
			model := loadAssetInfo(t, f)

			if model.Name == nil || *model.Name != expectedName {
				t.Errorf("name = %v, want %q", model.Name, expectedName)
			}
			if model.Symbol == nil || *model.Symbol != expectedSymbol {
				t.Errorf("symbol = %v, want %q", model.Symbol, expectedSymbol)
			}
			if model.Description == nil || *model.Description != expectedDesc {
				t.Errorf("description = %v, want %q", model.Description, expectedDesc)
			}
		})
	}
}

// TestTWTInfoJSON_AllLinksHaveHTTPS verifies all links use HTTPS.
func TestTWTInfoJSON_AllLinksHaveHTTPS(t *testing.T) {
	files := []string{
		"blockchains/binance/assets/TWT-8C2/info.json",
		"blockchains/smartchain/assets/0x4B0F1812e5Df2A09796481Ff14017e6005508003/info.json",
		"blockchains/solana/assets/HZNpqL7RT9gxf9eWoWsWzC5DfjzQ41XTQgEA7p3VzaaD/info.json",
	}

	for _, f := range files {
		t.Run(f, func(t *testing.T) {
			model := loadAssetInfo(t, f)

			for _, link := range model.Links {
				if link.URL == nil {
					t.Error("link URL is nil")
					continue
				}
				if !strings.HasPrefix(*link.URL, "https://") {
					t.Errorf("link %q URL %q does not use HTTPS", *link.Name, *link.URL)
				}
			}
		})
	}
}

// TestTWTInfoJSON_NoDuplicateLinks verifies no duplicate link names exist.
func TestTWTInfoJSON_NoDuplicateLinks(t *testing.T) {
	files := []string{
		"blockchains/binance/assets/TWT-8C2/info.json",
		"blockchains/smartchain/assets/0x4B0F1812e5Df2A09796481Ff14017e6005508003/info.json",
		"blockchains/solana/assets/HZNpqL7RT9gxf9eWoWsWzC5DfjzQ41XTQgEA7p3VzaaD/info.json",
	}

	for _, f := range files {
		t.Run(f, func(t *testing.T) {
			model := loadAssetInfo(t, f)

			seen := make(map[string]bool)
			for _, link := range model.Links {
				if link.Name == nil {
					continue
				}
				if seen[*link.Name] {
					t.Errorf("duplicate link name: %q", *link.Name)
				}
				seen[*link.Name] = true
			}
		})
	}
}

// TestDeletedAssets_LogoFilesRemoved verifies the deleted logo files no longer exist.
func TestDeletedAssets_LogoFilesRemoved(t *testing.T) {
	deletedFiles := []string{
		"blockchains/ethereum/assets/0x57e299eE8F1C5A92A9Ed54F934ACC7FF5F159699/logo.png",
		"blockchains/tron/assets/1001411/logo.png",
	}

	for _, f := range deletedFiles {
		t.Run(f, func(t *testing.T) {
			fullPath := filepath.Join(repoRoot(t), f)
			if _, err := os.Stat(fullPath); err == nil {
				t.Errorf("expected file to be deleted but it still exists: %s", f)
			} else if !os.IsNotExist(err) {
				t.Errorf("unexpected error checking file: %v", err)
			}
		})
	}
}
