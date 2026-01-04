package manager

import (
	"bytes"
	"strings"
	"testing"
)

func TestWeb3CommandRuns(t *testing.T) {
	InitCommands()

	output := new(bytes.Buffer)
	rootCmd.SetOut(output)
	rootCmd.SetErr(output)
	rootCmd.SetArgs([]string{"web3"})

	if err := rootCmd.Execute(); err != nil {
		t.Fatalf("web3 command returned error: %v", err)
	}

	if !strings.Contains(output.String(), "web3 application running") {
		t.Fatalf("web3 command output %q, expected it to contain %q", output.String(), "web3 application running")
	}
}
