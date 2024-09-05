package config

import (
	"fmt"
	"log"
	"os"
	"os/user"
	"strings"

	"github.com/BurntSushi/toml"
	"github.com/adrg/xdg"
)

const (
	targetConfigDir      = "flower"
	targetConfigFileName = "flower.toml"
)

type Config struct {
	UserName string `toml:"user_name"`
}

func NewConfig() (Config, error) {
	configPath, err := getValidConfigPath()
	if err != nil {
		return Config{}, err
	}
	fmt.Println(configPath)

	var config Config
	if configExists(configPath) {
		meta, err := toml.DecodeFile(configPath, &config)
		fmt.Println(meta)
		if err != nil {
			return Config{}, err
		}
	} else {
		config = defaultConfig()
		toml, err := toml.Marshal(config)
		if err != nil {
			return config, err
		}

		err = os.WriteFile(configPath, toml, 0644)
		if err != nil {
			return config, err
		}
	}

	return config, nil
}

func defaultConfig() Config {
	return Config{
		UserName: GetOsUserFirstName(),
	}
}

func getValidConfigPath() (string, error) {
	targetPath := fmt.Sprintf("%s/%s", targetConfigDir, targetConfigFileName)
	path, err := xdg.ConfigFile(targetPath)
	if err != nil {
		return "", err
	}
	return path, nil
}

func GetOsUserFirstName() string {
	currentUser, err := user.Current()
	if err != nil {
		log.Fatal("couldn't fetch current user")
	}

	return strings.Split(currentUser.Name, " ")[0]
}

func configExists(configPath string) bool {
	_, err := os.Stat(configPath)
	if os.IsNotExist(err) {
		return false
	}
	return err == nil
}
