package main

import (
	"github.com/trustwallet/assets/internal/manager"
)

func main() {
	manager.InitCommands()
	manager.Execute()
}
