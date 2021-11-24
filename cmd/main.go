package main

import (
	"flag"
	"os"

	log "github.com/sirupsen/logrus"

	"github.com/trustwallet/assets-go-libs/pkg/file"
	"github.com/trustwallet/assets-go-libs/src/config"
	"github.com/trustwallet/assets-go-libs/src/processor"
	"github.com/trustwallet/assets-go-libs/src/reporter"
	"github.com/trustwallet/assets-go-libs/src/validator"
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

	fileStorage := file.NewFileService()
	validatorsService := validator.NewService(fileStorage)
	reportService := reporter.NewReportService()
	assetfsProcessor := processor.NewService(fileStorage, validatorsService, reportService)

	switch script {
	case "sanity-check":
		err = assetfsProcessor.RunSanityCheck(paths)
	default:
		log.Error("Nothing to launch. Use --script flag to choose a script to run.")
	}

	if err != nil {
		log.WithError(err).Error()
	}

	reports := reportService.GetReports()
	for key, report := range reports {
		log.WithFields(log.Fields{
			"total_files": report.TotalFiles,
			"errors":      report.Errors,
			"warnings":    report.Warnings,
			"fixed":       report.Fixed,
		}).Info(key)

		if report.Errors > 0 {
			os.Exit(1)
		}
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
