package main

import (
	"fmt"
	"log"

	tea "github.com/charmbracelet/bubbletea"
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

func main() {
	f, err := tea.LogToFile("debug.log", "debug")
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()

	db, err := database.NewDB()
	if err != nil {
		panic("oh no")
	}

	r, err := db.Exec(`
        CREATE TABLE "times" (
            "id" INTEGER,
            "duration" INTEGER,
            "created" DATE,
            "breaks_total_time" INTEGER,
            "logs" TEXT,
            PRIMARY KEY("id" AUTOINCREMENT)
        )
    `)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println(r)
}
