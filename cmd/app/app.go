package app

import (
	"fmt"
	"log"
	"os"

	tea "github.com/charmbracelet/bubbletea"
	"github.com/kshyr/flower/internal/config"
	database "github.com/kshyr/flower/internal/db"
	"github.com/kshyr/flower/internal/tui"
)

func Run() {
	cfg, err := config.NewConfig()
	if err != nil {
		log.Fatal(err)
	}

	if config.Debug {
		f, err := tea.LogToFile("debug.log", "help")
		if err != nil {
			fmt.Println("Couldn't open a file for logging:", err)
			os.Exit(1)
		}
		defer f.Close()
	}

	db, err := database.NewDB()
	if err != nil {
		panic("db initialization failed")
	}
	defer func() {
		err := db.Close()
		if err != nil {
			log.Fatal(err)
		}
	}()

	if config.Debug {
		db.DropTables()
		db.CreateTables()
	}

	tui.Run(cfg, db)
}
