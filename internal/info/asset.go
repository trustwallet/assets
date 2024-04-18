package info

import (
	"github.com/trustwallet/assets-go-libs/validation"
	"github.com/trustwallet/go-primitives/coin"
)

func ValidateAsset(a AssetModel, chain coin.Coin, addr string) error {
	if err := ValidateAssetRequiredKeys(a); err != nil {
		return err
	}

	// All fields validated for nil and can be safety used.
	compErr := validation.NewErrComposite()
	if err := ValidateAssetType(*a.Type, chain); err != nil {
		compErr.Append(err)
	}

	if err := ValidateAssetID(*a.ID, addr); err != nil {
		compErr.Append(err)
	}

	if err := ValidateDecimals(*a.Decimals); err != nil {
		compErr.Append(err)
	}

	if err := ValidateAssetDecimalsAccordingType(*a.Type, *a.Decimals); err != nil {
		compErr.Append(err)
	}

	if err := ValidateStatus(*a.Status); err != nil {
		compErr.Append(err)
	}

	if err := ValidateDescription(*a.Description); err != nil {
		compErr.Append(err)
	}

	if err := ValidateDescriptionWebsite(*a.Description, *a.Website); err != nil {
		compErr.Append(err)
	}

	if err := ValidateLinks(a.Links); err != nil {
		compErr.Append(err)
	}

	if compErr.Len() > 0 {
		return compErr
	}

	return nil
}
