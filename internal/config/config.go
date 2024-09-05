package config

import (
	"fmt"
	"os"
	"os/user"
	"strings"

	"github.com/BurntSushi/toml"
	"github.com/adrg/xdg"
)

const (
	AppName              = "flower"
	targetConfigDir      = AppName
	targetConfigFileName = AppName + ".toml"
	fallbackUserName     = AppName
)

type Config struct {
	UserName string `toml:"user_name"`
}

func NewConfig() (Config, error) {
	configPath, err := getValidConfigPath()
	if err != nil {
		return Config{}, err
	}

	var config Config
	if configExists(configPath) {
		_, err := toml.DecodeFile(configPath, &config)
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
	userName, err := getOsUserFirstName()
	if err != nil {
		userName = fallbackUserName
	}

	return Config{
		UserName: userName,
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

func getOsUserFirstName() (string, error) {
	currentUser, err := user.Current()
	if err != nil {
		return "", err
	}

	return strings.Split(currentUser.Name, " ")[0], nil
}

func configExists(configPath string) bool {
	_, err := os.Stat(configPath)
	if os.IsNotExist(err) {
		return false
	}
	return err == nil
}
