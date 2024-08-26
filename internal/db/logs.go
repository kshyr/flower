package db

import (
	"database/sql"
	"time"

	"github.com/qustavo/dotsql"
)

type LogsTable struct {
	DB  *sql.DB
	dot *dotsql.DotSql
}

type Log struct {
	Id        int64
	Message   string
	TimerId   int64
	CreatedAt time.Time
	UpdatedAt time.Time
}

func (l LogsTable) CreateTable() (sql.Result, error) {
	return l.dot.Exec(l.DB, "create-logs-table")
}

func (l LogsTable) TableExists() bool {
	_, err := l.DB.Exec(`SELECT 1 FROM logs LIMIT 1`)
	if err != nil {
		return false
	}
	return true
}

func (l LogsTable) DropTable() (sql.Result, error) {
	return l.DB.Exec(`DROP TABLE logs`)
}

func (l LogsTable) Add(message string, timerId int64) (int64, error) {
	res, err := l.dot.Exec(l.DB, "add-log", message, timerId)
	if err != nil {
		return 0, err
	}

	id := mustGetInsertId(res)
	return id, nil
}

func (l LogsTable) GetAll() ([]Log, error) {
	rows, err := l.dot.Query(l.DB, "get-logs")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	logs := make([]Log, 0)
	for rows.Next() {
		log, err := scanLog(rows)
		if err != nil {
			return nil, err
		}
		logs = append(logs, log)
	}

	return logs, nil
}

func (l LogsTable) GetAllByTimerId(timerId int64) (*sql.Rows, error) {
	return l.dot.Query(l.DB, "get-logs-by-timer-id", timerId)
}

func scanLog(rows *sql.Rows) (Log, error) {
	var log Log
	err := rows.Scan(&log.Id, &log.Message, &log.TimerId, &log.CreatedAt, &log.UpdatedAt)
	return log, err
}
