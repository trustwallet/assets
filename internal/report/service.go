package report

import (
    "encoding/json"
    "fmt"
)

// ErrorDetail represents a single validation/fix error with useful context.
type ErrorDetail struct {
    Type       string `json:"type"`
    Chain      string `json:"chain"`
    Asset      string `json:"asset"`
    Path       string `json:"path"`
    Validation string `json:"validation"`
    Error      string `json:"error"`
}

type Service struct {
    errors     int
    totalFiles int
    details    []ErrorDetail
}

func NewService() *Service {
    return &Service{}
}

func (s *Service) IncErrors() {
    s.errors += 1
}

func (s *Service) AddErrorDetail(detail ErrorDetail) {
    s.details = append(s.details, detail)
    s.errors += 1
}

func (s *Service) IncTotalFiles() {
    s.totalFiles += 1
}

func (s Service) IsFailed() bool {
    return s.errors > 0
}

func (s Service) GetReport() string {
    return fmt.Sprintf("Total files: %d, errors: %d", s.totalFiles, s.errors)
}

// BuildJSONReport returns a formatted JSON report with a summary and details.
func (s Service) BuildJSONReport() ([]byte, error) {
    payload := struct {
        TotalFiles int           `json:"total_files"`
        Errors     int           `json:"errors"`
        Details    []ErrorDetail `json:"details,omitempty"`
    }{
        TotalFiles: s.totalFiles,
        Errors:     s.errors,
        Details:    s.details,
    }

    return json.MarshalIndent(payload, "", "  ")
}
