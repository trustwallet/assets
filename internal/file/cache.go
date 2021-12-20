package file

import (
	"path/filepath"
	"strings"
	"sync"
)

type Service struct {
	mu    *sync.RWMutex
	cache map[string]*AssetFile
}

func NewService(filePaths ...string) *Service {
	var filesMap = make(map[string]*AssetFile)

	for _, path := range filePaths {
		assetFile := NewAssetFile(path)
		filesMap[path] = assetFile
	}

	return &Service{
		mu:    &sync.RWMutex{},
		cache: filesMap,
	}
}

func (f *Service) GetAssetFile(path string) *AssetFile {
	f.mu.RLock()
	defer f.mu.RUnlock()

	return f.getFile(path)
}

func (f *Service) UpdateFile(file *AssetFile, newFileBaseName string) {
	f.mu.RLock()
	defer f.mu.RUnlock()

	oldFileBaseName := filepath.Base(file.Path())

	for path := range f.cache {
		if strings.Contains(path, oldFileBaseName) {
			newPath := strings.ReplaceAll(path, oldFileBaseName, newFileBaseName)
			f.cache[path] = NewAssetFile(newPath)
		}
	}
}

func (f *Service) getFile(path string) *AssetFile {
	if file, exists := f.cache[path]; exists {
		return file
	}

	assetF := NewAssetFile(path)
	f.cache[path] = assetF

	return assetF
}
