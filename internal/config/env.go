package config

import (
	"fmt"
	"os"
)

var Debug = false

func init() {
	if os.Getenv("FLDEBUG") == "1" {
		fmt.Println("Debug mode enabled")
		Debug = true
	}
}
