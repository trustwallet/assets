package main

import (
	"flag"

	log "github.com/sirupsen/logrus"

	"github.com/trustwallet/assets-go-libs/pkg/file"
	"github.com/trustwallet/assets-go-libs/src/config"
	"github.com/trustwallet/assets-go-libs/src/core"
	"github.com/trustwallet/assets-go-libs/src/processor"
)

var (
	configPath, root, script string
)

func main() {
	setup()

	paths, err := file.ReadLocalFileStructure(root, config.Default.ValidatorsSettings.RootFolder.SkipFiles)
	if err != nil {
		log.WithError(err).Fatal("failed to load file structure")
	}

	fileStorage := file.NewService()
	validatorsService := core.NewService(fileStorage)
	assetfsProcessor := processor.NewService(fileStorage, validatorsService)

	switch script {
	case "checker":
		err = assetfsProcessor.RunJob(paths, assetfsProcessor.Check)
	case "fixer":
		err = assetfsProcessor.RunJob(paths, assetfsProcessor.Fix)
	case "updater-auto":
		err = assetfsProcessor.RunUpdateAuto()
	default:
		log.Error("Nothing to launch. Use --script flag to choose a script to run.")
	}

	if err != nil {
		log.WithError(err).Error()
	}
}

func setup() {
	flag.StringVar(&configPath, "config", "", "path to config file")
	flag.StringVar(&root, "root", "./", "path to the root of the dir")
	flag.StringVar(&script, "script", "", "script type to run")
	flag.Parse()

	if err := config.SetConfig(configPath); err != nil {
		log.WithError(err).Fatal("failed to set config")
	}

	logLevel, err := log.ParseLevel(config.Default.App.LogLevel)
	if err != nil {
		log.WithError(err).Fatal("failed to parse log level")
	}

	log.SetLevel(logLevel)
}
