package main

import (
	"github.com/block-wallet/assets/internal/manager"
)

func main() {
	manager.InitCommands()
	manager.Execute()
}
