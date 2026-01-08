package info

import (
	"github.com/trustwallet/assets-go-libs/validation"
)

func ValidateCoin(c CoinModel, allowedTags []string) error {
	if err := ValidateCoinRequiredKeys(c); err != nil {
		return err
	}

	// All fields validated for nil and can be safety used.
	compErr := validation.NewErrComposite()
	if c.Type != nil {
		if err := ValidateCoinType(*c.Type); err != nil {
			compErr.Append(err)
		}
	} else {
		compErr.Append(validation.NewErr("Type is nil"))
	}

	if c.Decimals != nil {
		if err := ValidateDecimals(*c.Decimals); err != nil {
			compErr.Append(err)
		}
	} else {
		compErr.Append(validation.NewErr("Decimals is nil"))
	}

	if c.Status != nil {
		if err := ValidateStatus(*c.Status); err != nil {
			compErr.Append(err)
		}
	} else {
		compErr.Append(validation.NewErr("Status is nil"))
	}

	if err := ValidateTags(c.Tags, allowedTags); err != nil {
		compErr.Append(err)
	}

	if c.Description != nil {
		if err := ValidateDescription(*c.Description); err != nil {
			compErr.Append(err)
		}
	} else {
		compErr.Append(validation.NewErr("Description is nil"))
	}

	if c.Description != nil && c.Website != nil {
		if err := ValidateDescriptionWebsite(*c.Description, *c.Website); err != nil {
			compErr.Append(err)
		}
	} else {
		if c.Description == nil {
			compErr.Append(validation.NewErr("Description is nil for website validation"))
		}
		if c.Website == nil {
			compErr.Append(validation.NewErr("Website is nil for description website validation"))
		}
	}

	if err := ValidateLinks(c.Links); err != nil {
		compErr.Append(err)
	}

	if compErr.Len() > 0 {
		return compErr
	}

	return nil
}
