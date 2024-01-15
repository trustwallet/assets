package service

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/trustwallet/assets-go-libs/file"
	"github.com/trustwallet/assets/internal/report"
	"github.com/trustwallet/go-primitives/coin"

	log "github.com/sirupsen/logrus"
)

type StagingAssetsService struct {
	fileService     *file.Service
	reportService   *report.Service
	paths           []string
	supportedChains map[uint]bool
}

type assetThatHasLogo struct {
	coin    uint
	address string
}

type stagingManifest struct {
	Data map[string][]string `json:"data"`
}

const stagingDirectory = "staging/assets"

func NewStagingAssetsService(fs *file.Service, rs *report.Service, paths []string) *StagingAssetsService {
	return &StagingAssetsService{
		fileService:   fs,
		reportService: rs,
		paths:         paths,
		supportedChains: map[uint]bool{
			coin.ETHEREUM:   true,
			coin.POLYGON:    true,
			coin.OPTIMISM:   true,
			coin.ARBITRUM:   true,
			coin.SMARTCHAIN: true,
			coin.BASE:       true,
			coin.AVALANCHEC: true,
		},
	}
}

func (s *StagingAssetsService) RunJob() {
	manifest := stagingManifest{
		Data: make(map[string][]string),
	}

	for _, path := range s.paths {
		f := s.fileService.GetAssetFile(path)
		s.reportService.IncTotalFiles()

		asset, err := s.copyLogoToStagingFolderForChain(f)
		if err != nil {
			s.handleError(err, f, "copyLogoToStaging")
		}

		if asset.coin != 0 && asset.address != "" {
			chain := coin.Coins[asset.coin].Handle
			manifest.Data[chain] = append(manifest.Data[chain], asset.address)
		}
	}

	reportMsg := s.reportService.GetReport()
	if s.reportService.IsFailed() {
		log.Fatal(reportMsg)
	}

	output, err := json.Marshal(manifest)
	if err != nil {
		log.Fatal(err)
	}

	err = os.WriteFile(fmt.Sprintf("%s/asset-logos-manifest.json", stagingDirectory), output, 0600)
	if err != nil {
		log.Fatal(err)
	}

	log.Info(reportMsg)
}

func (s *StagingAssetsService) copyLogoToStagingFolderForChain(f *file.AssetFile) (assetThatHasLogo, error) {
	var stagingAsset assetThatHasLogo

	if f.Type() == file.TypeAssetFolder {
		if !s.supportedChains[f.Chain().ID] {
			return stagingAsset, nil
		}

		logoPath := fmt.Sprintf("%s/logo.png", f.Path())

		if _, err := os.Stat(logoPath); err != nil {
			// Logo doesn't exist for this asset so we move on
			// nolint: nilerr
			return stagingAsset, nil
		}

		path, err := os.Getwd()
		if err != nil {
			return stagingAsset, err
		}

		chainName := f.Chain().Handle
		stagingPath := fmt.Sprintf("%s/%s/%s", path, stagingDirectory, chainName)
		err = os.MkdirAll(stagingPath, 0755)
		if err != nil {
			return stagingAsset, err
		}

		assetAddress := strings.ToLower(filepath.Base(f.Path()))

		// {WORKING_DIR}/staging/assets/ethereum/0xfoo.png
		stagingFilePath := fmt.Sprintf("%s/%s.png", stagingPath, assetAddress)
		err = os.Link(logoPath, stagingFilePath)
		if err != nil {
			return stagingAsset, err
		}

		stagingAsset.coin = f.Chain().ID
		stagingAsset.address = assetAddress

		log.WithField("from", logoPath).
			WithField("to", stagingFilePath).
			Debug("Copying to staging folder")

		return stagingAsset, nil
	}

	return stagingAsset, nil
}

func (s *StagingAssetsService) handleError(err error, info *file.AssetFile, valName string) {
	errors := UnwrapComposite(err)

	for _, err := range errors {
		log.WithFields(
			log.Fields{
				"type":       info.Type(),
				"chain":      info.Chain().Handle,
				"asset":      info.Asset(),
				"path":       info.Path(),
				"validation": valName,
			},
		).Error(err)

		s.reportService.IncErrors()
	}
}
