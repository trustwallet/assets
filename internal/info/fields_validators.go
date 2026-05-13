package info

import (
	"fmt"
	"strings"

	str "github.com/trustwallet/assets-go-libs/strings"
	"github.com/trustwallet/assets-go-libs/validation"
	"github.com/trustwallet/go-primitives/coin"
	"github.com/trustwallet/go-primitives/types"
)

// Asset info specific validators.

func ValidateAssetRequiredKeys(a AssetModel) error {
	var fields []string
	if a.Name != nil && !isEmpty(*a.Name) {
		fields = append(fields, "name")
	}
	if a.Symbol != nil && !isEmpty(*a.Symbol) {
		fields = append(fields, "symbol")
	}
	if a.Type != nil && !isEmpty(*a.Type) {
		fields = append(fields, "type")
	}
	if a.Decimals != nil {
		fields = append(fields, "decimals")
	}
	if a.Description != nil && !isEmpty(*a.Description) {
		fields = append(fields, "description")
	}
	if a.Website != nil {
		fields = append(fields, "website")
	}
	if a.Explorer != nil && !isEmpty(*a.Explorer) {
		fields = append(fields, "explorer")
	}
	if a.Status != nil && !isEmpty(*a.Status) {
		fields = append(fields, "status")
	}
	if a.ID != nil && !isEmpty(*a.ID) {
		fields = append(fields, "id")
	}

	if len(fields) != len(requiredAssetFields) {
		return fmt.Errorf("%w: %s", validation.ErrMissingField,
			strings.Join(str.Difference(requiredAssetFields, fields), ", "))
	}

	return nil
}

func ValidateAssetType(assetType string, chain coin.Coin) error {
	chainFromType, err := types.GetChainFromAssetType(assetType)
	if err != nil {
		return fmt.Errorf("failed to get chain from asset type: %w", err)
	}

	if chainFromType != chain {
		return fmt.Errorf("%w: asset type field", validation.ErrInvalidField)
	}

	if strings.ToUpper(assetType) != assetType {
		return fmt.Errorf("%w: asset type should be ALLCAPS", validation.ErrInvalidField)
	}

	return nil
}

func ValidateAssetID(id, address string) error {
	if id != address {
		if !strings.EqualFold(id, address) {
			return fmt.Errorf("%w: invalid id field", validation.ErrInvalidField)
		}

		return fmt.Errorf("%w: invalid case for id field", validation.ErrInvalidField)
	}

	return nil
}

func ValidateAssetDecimalsAccordingType(assetType string, decimals int) error {
	if assetType == "BEP2" && decimals != 8 {
		return fmt.Errorf("%w: invalid decimals field, BEP2 tokens have 8 decimals", validation.ErrInvalidField)
	}

	return nil
}

// CoinModel info specific validators.

func ValidateCoinRequiredKeys(c CoinModel) error {
	var fields []string
	if c.Name != nil && !isEmpty(*c.Name) {
		fields = append(fields, "name")
	}
	if c.Symbol != nil && !isEmpty(*c.Symbol) {
		fields = append(fields, "symbol")
	}
	if c.Type != nil && !isEmpty(*c.Type) {
		fields = append(fields, "type")
	}
	if c.Decimals != nil {
		fields = append(fields, "decimals")
	}
	if c.Description != nil && !isEmpty(*c.Description) {
		fields = append(fields, "description")
	}
	if c.Website != nil && !isEmpty(*c.Website) {
		fields = append(fields, "website")
	}
	if c.Explorer != nil && !isEmpty(*c.Explorer) {
		fields = append(fields, "explorer")
	}
	if c.Status != nil && !isEmpty(*c.Status) {
		fields = append(fields, "status")
	}

	if len(fields) != len(requiredCoinFields) {
		return fmt.Errorf("%w: %s", validation.ErrMissingField,
			strings.Join(str.Difference(requiredCoinFields, fields), ", "))
	}

	return nil
}

func ValidateLinks(links []Link) error {
	if len(links) < 2 {
		return nil
	}

	for _, l := range links {
		if l.Name == nil || l.URL == nil {
			return fmt.Errorf("%w: missing required fields links.url and links.name", validation.ErrMissingField)
		}

		if !linkNameAllowed(*l.Name) {
			return fmt.Errorf("invalid value for links.name filed, allowed only: %s",
				strings.Join(supportedLinkNames(), ", "))
		}

		prefix := allowedLinkKeys[*l.Name]
		if prefix != "" {
			if !strings.HasPrefix(*l.URL, prefix) {
				return fmt.Errorf("invalid value '%s' for %s link url, allowed only with prefix: %s",
					*l.URL, *l.Name, prefix)
			}
		}

		if !strings.HasPrefix(*l.URL, "https://") {
			return fmt.Errorf("invalid value for links.url field, allowed only with https:// prefix")
		}

		if *l.Name == "medium" {
			if !strings.Contains(*l.URL, "medium.com") {
				return fmt.Errorf("invalid value for links.url field, should contain medium.com")
			}
		}
	}

	return nil
}

func ValidateCoinType(assetType string) error {
	if assetType != "coin" {
		return fmt.Errorf("%w: only \"coin\" type allowed for coin field", validation.ErrInvalidField)
	}

	return nil
}

func ValidateTags(tags, allowedTags []string) error {
	for _, t := range tags {
		if !str.Contains(t, allowedTags) {
			return fmt.Errorf("%w: tag '%s' not allowed", validation.ErrInvalidField, t)
		}
	}

	return nil
}

// Both infos can be validated by this validators.

func ValidateDecimals(decimals int) error {
	if decimals > 30 || decimals < 0 {
		return fmt.Errorf("%w: decimals field", validation.ErrInvalidField)
	}

	return nil
}

func ValidateStatus(status string) error {
	for _, f := range allowedStatusValues {
		if f == status {
			return nil
		}
	}

	return fmt.Errorf("%w: allowed status field values: %s", validation.ErrInvalidField,
		strings.Join(allowedStatusValues, ", "))
}

func ValidateDescription(description string) error {
	if len(description) > 600 {
		return fmt.Errorf("%w: invalid length for description field", validation.ErrInvalidField)
	}

	for _, ch := range whiteSpaceCharacters {
		if strings.Contains(description, ch) {
			return fmt.Errorf("%w: description contains not allowed characters (new line, double space)",
				validation.ErrInvalidField)
		}
	}

	return nil
}

func ValidateDescriptionWebsite(description, website string) error {
	if description != "-" && website == "" {
		return fmt.Errorf("%w: website field", validation.ErrMissingField)
	}

	return nil
}

func ValidateExplorer(explorer, name string, chain coin.Coin, addr, tokenType string) error {
	// explorer url is composed with values outside info.json.
	if chain == coin.Nativeinjective() {
		return nil
	}

	explorerExpected, err := coin.GetCoinExploreURL(chain, addr, tokenType)
	if err != nil {
		explorerExpected = ""
	}

	explorerActual := explorer

	if !strings.EqualFold(explorerActual, explorerExpected) {
		explorerAlt := explorerURLAlternatives(chain.Handle, name)
		if len(explorerAlt) == 0 {
			return nil
		}

		var matchCount int

		for _, e := range explorerAlt {
			if strings.EqualFold(e, explorerActual) {
				matchCount++
			}
		}

		if matchCount == 0 {
			return fmt.Errorf("invalid value for explorer field, %s insted of %s", explorerActual, explorerExpected)
		}
	}

	return nil
}

func isEmpty(field string) bool {
	return field == ""
}
