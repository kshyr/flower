package tui

import (
	"fmt"
	"log"
	"strconv"
	"strings"

	"github.com/charmbracelet/bubbles/textarea"
	"github.com/charmbracelet/bubbles/textinput"
	"github.com/charmbracelet/bubbles/viewport"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
	"github.com/kshyr/flower/internal/config"
	"github.com/kshyr/flower/internal/db"
)

func Run(cfg config.Config, db *db.DB) {
	p := tea.NewProgram(initialModel(cfg, db))
	if _, err := p.Run(); err != nil {
		log.Fatal(err)
	}
}

type (
	errMsg error
)

type model struct {
	cfg         config.Config
	db          *db.DB
	help        Help
	viewport    viewport.Model
	messages    []string
	textinput   textinput.Model
	senderStyle lipgloss.Style
	err         error
}

func initialModel(cfg config.Config, db *db.DB) model {
	ti := textinput.New()
	ti.Placeholder = "Pikachu"
	ti.Focus()
	ti.CharLimit = 156
	ti.Width = 20

	vp := viewport.New(30, 10)
	vp.SetContent(`Welcome to the chat room!
Type a message and press Enter to send.`)

	help := NewHelp()

	return model{
		cfg:         cfg,
		db:          db,
		help:        help,
		textinput:   ti,
		messages:    []string{},
		viewport:    vp,
		senderStyle: lipgloss.NewStyle().Foreground(lipgloss.Color("5")),
		err:         nil,
	}
}

type View int

const (
	ViewSidebar View = iota
	ViewMainViewport
	ViewMessageCenter
	ViewConsole
	ViewHelp
	ViewControlGuide
)

func (m model) Init() tea.Cmd {
	return textarea.Blink
}

func (m model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	var (
		tiCmd tea.Cmd
		vpCmd tea.Cmd
		hpCmd tea.Cmd
	)

	m.textinput, tiCmd = m.textinput.Update(msg)
	m.viewport, vpCmd = m.viewport.Update(msg)
	var helpModel tea.Model
	helpModel, hpCmd = m.help.Update(msg)
	m.help = helpModel.(Help)

	switch msg := msg.(type) {
	case tea.KeyMsg:
		switch msg.Type {
		case tea.KeyCtrlC, tea.KeyEsc:
			fmt.Println(m.textinput.Value())
			return m, tea.Quit
		case tea.KeyEnter:
			m.messages = append(m.messages, m.senderStyle.Render("You: ")+strconv.Itoa(m.viewport.Height))
			m.viewport.SetContent(strings.Join(m.messages, "\n"))
			m.textinput.Reset()
			m.viewport.GotoBottom()
		}

	// We handle errors just like any other message
	case errMsg:
		m.err = msg
		return m, nil
	}

	return m, tea.Batch(tiCmd, vpCmd, hpCmd)
}

func (m model) View() string {
	return fmt.Sprintf(
		"\n\n%s\n\n%s\n\n%s",
		m.viewport.View(),
		m.textinput.View(),
		m.help.View(),
	) + "\n\n"
}
