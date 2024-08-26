package config

import (
	"log"
	"os/user"
	"strings"
)

type Config struct {
	Name string
}

func GetUserFirstName() string {
	currentUser, err := user.Current()
	if err != nil {
		log.Fatal("couldn't fetch current user")
	}

	return strings.Split(currentUser.Name, " ")[0]
}
