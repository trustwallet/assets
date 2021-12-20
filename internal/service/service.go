package service

import (
	"github.com/trustwallet/assets-go-libs/validation"
	"github.com/trustwallet/assets/internal/file"
	"github.com/trustwallet/assets/internal/processor"

	log "github.com/sirupsen/logrus"
)

type Service struct {
	fileService      *file.Service
	processorService *processor.Service
}

func NewService(fs *file.Service, cs *processor.Service) *Service {
	return &Service{
		fileService:      fs,
		processorService: cs,
	}
}

func (s *Service) RunJob(paths []string, job func(*file.AssetFile)) {
	for _, path := range paths {
		f := s.fileService.GetAssetFile(path)
		job(f)
	}
}

func (s *Service) Check(f *file.AssetFile) {
	validator := s.processorService.GetValidator(f)

	if validator != nil {
		if err := validator.Run(f); err != nil {
			// TODO: somehow return an error from Check if there are any errors.
			HandleError(err, f, validator.Name)
		}
	}
}

func (s *Service) Fix(f *file.AssetFile) {
	fixers := s.processorService.GetFixers(f)

	for _, fixer := range fixers {
		if err := fixer.Run(f); err != nil {
			HandleError(err, f, fixer.Name)
		}
	}
}

func (s *Service) RunUpdateAuto() {
	updaters := s.processorService.GetUpdatersAuto()
	s.runUpdaters(updaters)
}

func (s *Service) RunUpdateManual() {
	updaters := s.processorService.GetUpdatersManual()
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

func HandleError(err error, info *file.AssetFile, valName string) {
	errors := UnwrapComposite(err)

	for _, err := range errors {
		log.WithFields(log.Fields{
			"type":       info.Type(),
			"chain":      info.Chain().Handle,
			"asset":      info.Asset(),
			"path":       info.Path(),
			"validation": valName,
		}).Error(err)
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
