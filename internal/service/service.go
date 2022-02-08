package service

import (
	"github.com/trustwallet/assets-go-libs/validation"
	"github.com/trustwallet/assets/internal/file"
	"github.com/trustwallet/assets/internal/processor"
	"github.com/trustwallet/assets/internal/report"

	log "github.com/sirupsen/logrus"
)

type Service struct {
	fileService      *file.Service
	processorService *processor.Service
	reportService    *report.Service
	paths            []string
}

func NewService(fs *file.Service, cs *processor.Service, rs *report.Service, paths []string) *Service {
	return &Service{
		fileService:      fs,
		processorService: cs,
		reportService:    rs,
		paths:            paths,
	}
}

func (s *Service) RunJob(job func(*file.AssetFile)) {
	for _, path := range s.paths {
		f := s.fileService.GetAssetFile(path)
		s.reportService.IncTotalFiles()
		job(f)
	}

	reportMsg := s.reportService.GetReport()
	if s.reportService.IsFailed() {
		log.Fatal(reportMsg)
	} else {
		log.Info(reportMsg)
	}
}

func (s *Service) Check(f *file.AssetFile) {
	validators := s.processorService.GetValidator(f)

	for _, validator := range validators {
		if err := validator.Run(f); err != nil {
			s.handleError(err, f, validator.Name)
		}
	}
}

func (s *Service) Fix(f *file.AssetFile) {
	fixers := s.processorService.GetFixers(f)

	for _, fixer := range fixers {
		if err := fixer.Run(f); err != nil {
			s.handleError(err, f, fixer.Name)
		}
	}
}

func (s *Service) RunUpdateAuto() {
	updaters := s.processorService.GetUpdatersAuto()
	s.runUpdaters(updaters)
}

func (s *Service) runUpdaters(updaters []processor.Updater) {
	for _, updater := range updaters {
		err := updater.Run()
		if err != nil {
			log.WithError(err).Error()
		}
	}
}

func (s *Service) handleError(err error, info *file.AssetFile, valName string) {
	errors := UnwrapComposite(err)

	for _, err := range errors {
		log.WithFields(log.Fields{
			"type":       info.Type(),
			"chain":      info.Chain().Handle,
			"asset":      info.Asset(),
			"path":       info.Path(),
			"validation": valName,
		}).Error(err)

		s.reportService.IncErrors()
	}
}

func UnwrapComposite(err error) []error {
	compErr, ok := err.(*validation.ErrComposite)
	if !ok {
		return []error{err}
	}

	var errors []error
	for _, e := range compErr.GetErrors() {
		errors = append(errors, UnwrapComposite(e)...)
	}

	return errors
}
