package db

import (
	"database/sql"
	"time"

	"github.com/qustavo/dotsql"
)

type TimersTable struct {
	DB  *sql.DB
	dot *dotsql.DotSql
}

type Timer struct {
	Id        int64
	Name      string
	Duration  time.Duration
	CreatedAt time.Time
	UpdatedAt time.Time
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

func (t TimersTable) Add(name string, duration int) (int64, error) {
	res, err := t.dot.Exec(t.DB, "add-timer", name, duration)
	if err != nil {
		return 0, err
	}

	id := mustGetInsertId(res)
	return id, nil
}

func (t TimersTable) GetAll() ([]Timer, error) {
	rows, err := t.dot.Query(t.DB, "get-timers")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	timers := make([]Timer, 0)
	for rows.Next() {
		var timer Timer
		err := rows.Scan(&timer.Id, &timer.Name, &timer.Duration, &timer.CreatedAt, &timer.UpdatedAt)
		if err != nil {
			return nil, err
		}
		timers = append(timers, timer)
	}

	return timers, nil
}
