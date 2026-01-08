package main

import (
	"github.com/trustwallet/assets/internal/manager"
)

func main() {
	import (
		"fmt"
	)
	if err := manager.InitCommands(); err != nil {
		panic(err)
	}
	if err := manager.Execute(); err != nil {
		panic(err)
	}
}
