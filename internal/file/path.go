package file

import (
	"fmt"
	"os"
	"path/filepath"
	"regexp"

	"github.com/trustwallet/assets-go-libs/strings"
	"github.com/trustwallet/go-primitives/coin"
)

var (
	regexAssetInfoFile = regexp.MustCompile(`./blockchains/(\w+[\-]\w+|\w+)/assets/(\w+[\-]\w+|\w+)/info.json$`)
	regexAssetLogoFile = regexp.MustCompile(`./blockchains/(\w+[\-]\w+|\w+)/assets/(\w+[\-]\w+|\w+)/logo.png$`)

	regexChainInfoFile = regexp.MustCompile(`./blockchains/(\w+[\-]\w+|\w+)/info/info.json$`)
	regexChainLogoFile = regexp.MustCompile(`./blockchains/(\w+[\-]\w+|\w+)/info/logo.png$`)

	regexTokenListFile = regexp.MustCompile(`./blockchains/(\w+[\-]\w+|\w+)/tokenlist.json$`)

	regexValidatorsAssetLogo = regexp.MustCompile(
		`./blockchains/(\w+[\-]\w+|\w+)/validators/assets/(\w+[\-]\w+|\w+)/logo.png$`)
	regexValidatorsList = regexp.MustCompile(`./blockchains/(\w+[\-]\w+|\w+)/validators/list.json$`)

	regexDappsLogo = regexp.MustCompile(`./dapps/[a-zA-Z-.]+\.png$`)
)

var (
	regexAssetFolder  = regexp.MustCompile(`./blockchains/(\w+[\-]\w+|\w+)/assets/(\w+[\-]\w+|\w+)$`)
	regexAssetsFolder = regexp.MustCompile(`./blockchains/(\w+[\-]\w+|\w+)/assets$`)

	regexValidatorsFolder      = regexp.MustCompile(`./blockchains/(\w+[\-]\w+|\w+)/validators$`)
	regexValidatorsAssetFolder = regexp.MustCompile(
		`./blockchains/(\w+[\-]\w+|\w+)/validators/assets/(\w+[\-]\w+|\w+)$`)
	regexValidatorsAssetsFolder = regexp.MustCompile(`./blockchains/(\w+[\-]\w+|\w+)/validators/assets$`)

	regexChainFolder     = regexp.MustCompile(`./blockchains/(\w+[^/])$`)
	regexChainInfoFolder = regexp.MustCompile(`./blockchains/(\w+[\-]\w+|\w+)/info$`)
	regexChainsFolder    = regexp.MustCompile(`./blockchains$`)

	regexDappsFolder = regexp.MustCompile(`./dapps$`)
	regexRoot        = regexp.MustCompile(`./$`)
)

var regexes = map[string]*regexp.Regexp{
	TypeAssetInfoFile: regexAssetInfoFile,
	TypeAssetLogoFile: regexAssetLogoFile,

	TypeChainInfoFile: regexChainInfoFile,
	TypeChainLogoFile: regexChainLogoFile,

	TypeTokenListFile: regexTokenListFile,

	TypeValidatorsListFile: regexValidatorsList,
	TypeValidatorsLogoFile: regexValidatorsAssetLogo,

	TypeDappsLogoFile: regexDappsLogo,

	TypeAssetFolder:  regexAssetFolder,
	TypeAssetsFolder: regexAssetsFolder,

	TypeChainFolder:     regexChainFolder,
	TypeChainsFolder:    regexChainsFolder,
	TypeChainInfoFolder: regexChainInfoFolder,

	TypeDappsFolder: regexDappsFolder,
	TypeRootFolder:  regexRoot,

	TypeValidatorsFolder:       regexValidatorsFolder,
	TypeValidatorsAssetsFolder: regexValidatorsAssetsFolder,
	TypeValidatorsAssetFolder:  regexValidatorsAssetFolder,
}

type Path struct {
	path     string
	chain    coin.Coin
	asset    string
	fileType string
}

func NewPath(path string) *Path {
	p := Path{path: path}

	fileType, reg := defineFileType(path)
	if reg == nil {
		p.fileType = TypeUnknown

		return &p
	}

	match := reg.FindStringSubmatch(path)
	if fileType != TypeUnknown {
		p.fileType = fileType
	}

	if len(match) >= 2 {
		chain, err := coin.GetCoinForId(match[1])
		if err != nil {
			p.chain = coin.Coin{Handle: match[1]}
		} else {
			p.chain = chain
		}
	}

	if len(match) == 3 {
		p.asset = match[2]
	}

	return &p
}

func (p Path) Type() string {
	return p.fileType
}

func (p Path) String() string {
	return p.path
}

func (p Path) Chain() coin.Coin {
	return p.chain
}

func (p Path) Asset() string {
	return p.asset
}

func defineFileType(p string) (string, *regexp.Regexp) {
	for t, r := range regexes {
		if r.MatchString(p) {
			return t, r
		}
	}

	return TypeUnknown, nil
}

func ReadLocalFileStructure(root string, filesToSkip []string) ([]string, error) {
	var paths = []string{"./"}
	err := filepath.Walk(root,
		func(path string, info os.FileInfo, err error) error {
			if err != nil {
				return err
			}

			if strings.Contains(path, filesToSkip) {
				return nil
			}

			paths = append(paths, fmt.Sprintf("./%s", path))

			return nil
		})

	if err != nil {
		return nil, err
	}

	return paths, nil
}
