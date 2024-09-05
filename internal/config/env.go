package config

import "os"

var Debug = false

func init() {
	if os.Getenv("FLDEBUG") == "1" {
		Debug = true
	}
}
