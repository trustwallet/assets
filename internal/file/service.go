package file

import (
	"github.com/trustwallet/go-primitives/coin"
)

type AssetFile struct {
	path *Path
}

func NewAssetFile(path string) *AssetFile {
	return &AssetFile{path: NewPath(path)}
}

func (i *AssetFile) Path() string {
	return i.path.String()
}

func (i *AssetFile) Type() string {
	return i.path.fileType
}

func (i *AssetFile) Chain() coin.Coin {
	return i.path.chain
}

func (i *AssetFile) Asset() string {
	return i.path.asset
}
