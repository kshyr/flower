package app

import (
	"fmt"
	"log"
	"strings"

	tea "github.com/charmbracelet/bubbletea"
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
	fmt.Printf("Hi %s!\n", config.GetUserFirstName())

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

	dev.recreateTables(db)

	id, err := db.Timers.Add("timer1", 10)
	if err != nil {
		panic("timer1 insert failed")
	}

	_, err = db.Logs.Add("hey it's my log1 for timer1", id)
	if err != nil {
		panic("log1 insert failed")
	}

	_, err = db.Logs.Add("hey it's my log2 for timer1", id)
	if err != nil {
		panic("log2 insert failed")
	}

	logs, err := db.Logs.GetAll()
	if err != nil {
		log.Fatal("oops:", err)
	}

	msgs := make([]string, len(logs))
	for i, log := range logs {
		msgs[i] = log.Message
	}

	msgsString := strings.Join(msgs, ", ")
	fmt.Println(msgsString)
}
