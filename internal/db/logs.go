package db

import (
	"database/sql"

	"github.com/qustavo/dotsql"
)

type LogsTable struct {
	DB  *sql.DB
	dot *dotsql.DotSql
}

func (l LogsTable) CreateTable() (sql.Result, error) {
	return l.DB.Exec(`CREATE TABLE logs (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		message TEXT,
		created_at DATE
	)`)
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
