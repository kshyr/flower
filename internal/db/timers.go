package db

import (
	"database/sql"

	"github.com/qustavo/dotsql"
)

type TimersTable struct {
	DB  *sql.DB
	dot *dotsql.DotSql
}

func (t TimersTable) CreateTable() (sql.Result, error) {
	return t.dot.Exec(t.DB, "create-timers-table")
}

func (t TimersTable) TableExists() bool {
	_, err := t.DB.Exec(`SELECT 1 FROM timers LIMIT 1`)
	if err != nil {
		return false
	}
	return true
}

func (t TimersTable) DropTable() (sql.Result, error) {
	return t.dot.Exec(t.DB, "drop-timers-table")
}

func (t TimersTable) Add(name string, duration int) (sql.Result, error) {
	return t.dot.Exec(t.DB, "add-timer", name, duration)
}

func (t TimersTable) GetTimers() (*sql.Rows, error) {
	return t.dot.Query(t.DB, "get-timers")
}
