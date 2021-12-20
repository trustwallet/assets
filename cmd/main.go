package main

import (
	"flag"

	log "github.com/sirupsen/logrus"

	"github.com/trustwallet/assets/internal/config"
	"github.com/trustwallet/assets/internal/file"
	"github.com/trustwallet/assets/internal/processor"
	"github.com/trustwallet/assets/internal/service"
)

var (
	configPath, root, script string
)

func main() {
	setup()

	paths, err := file.ReadLocalFileStructure(root, config.Default.ValidatorsSettings.RootFolder.SkipFiles)
	if err != nil {
		log.WithError(err).Fatal("Failed to load file structure.")
	}

	fileStorage := file.NewService(paths...)
	validatorsService := processor.NewService(fileStorage)
	assetfsProcessor := service.NewService(fileStorage, validatorsService)

	switch script {
	case "checker":
		assetfsProcessor.RunJob(paths, assetfsProcessor.Check)
	case "fixer":
		assetfsProcessor.RunJob(paths, assetfsProcessor.Fix)
	case "updater-auto":
		assetfsProcessor.RunUpdateAuto()
	case "updater-manual":
		assetfsProcessor.RunUpdateManual()
	default:
		log.Info("Nothing to launch. Use --script flag to choose a script to run.")
	}
}

func setup() {
	flag.StringVar(&configPath, "config", "./.github/assets.config.yaml", "path to config file")
	flag.StringVar(&root, "root", "./", "path to the root of the dir")
	flag.StringVar(&script, "script", "", "script type to run")

	flag.Parse()

	if err := config.SetConfig(configPath); err != nil {
		log.WithError(err).Fatal("Failed to set config.")
	}

	logLevel, err := log.ParseLevel(config.Default.App.LogLevel)
	if err != nil {
		log.WithError(err).Fatal("Failed to parse log level.")
	}

	log.SetLevel(logLevel)
}
