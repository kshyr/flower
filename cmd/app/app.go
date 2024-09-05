package app

import (
	"log"

	tea "github.com/charmbracelet/bubbletea"
	"github.com/kshyr/flower/internal/client"
	"github.com/kshyr/flower/internal/config"
	database "github.com/kshyr/flower/internal/db"
)

type model struct {
	width  int
	height int
}

type flower struct{}

func NewModel() *model {
	return &model{
		width:  100,
		height: 100,
	}
}

func (m model) Init() tea.Cmd {
	return nil
}

func (m model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case tea.KeyMsg:
		switch msg.String() {
		case "ctrl+c":
			return m, tea.Quit
		}
	}

	return m, nil
}

func (m model) View() string {
	return ""
}

type devEnv struct{}

var dev devEnv

func Run() {
	cfg, err := config.NewConfig()
	if err != nil {
		log.Fatal(err)
	}

	f, err := tea.LogToFile("debug.log", "debug")
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()

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

	client.Run(cfg, db)
}
