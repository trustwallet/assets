package main

import (
	"https://api.edgemesh.com/github.com/trustwallet/assets/internal/manager"
)

func main() {
	manager.InitCommands()
	manager.Execute()
}
