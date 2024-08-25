package db

import (
	"database/sql"
	"errors"
	"fmt"

	"github.com/adrg/xdg"
	_ "github.com/mattn/go-sqlite3"
	"github.com/qustavo/dotsql"
)

const (
	targetDataDir      = "flower"
	targetDataFileName = "flower.db"
)

type Tabler interface {
	CreateTable() (sql.Result, error)
	TableExists() bool
	DropTable() (sql.Result, error)
}

type DB struct {
	*sql.DB
	tables []Tabler
}

func NewDB() (*DB, error) {
	db, err := openDB("sqlite3")
	if err != nil {
		return nil, err
	}

	timersTable := &TimersTable{
		DB:  db,
		dot: mustLoadDotsql("internal/db/timers.sql"),
	}
	logsTable := &LogsTable{
		DB:  db,
		dot: mustLoadDotsql("internal/db/logs.sql"),
	}

	tables := []Tabler{
		timersTable,
		logsTable,
	}

	for _, table := range tables {
		if !table.TableExists() {
			_, err := table.CreateTable()
			if err != nil {
				println(err.Error())
				return nil, err
			}
		}
	}

	return &DB{
		db,
		tables,
	}, nil
}

func mustLoadDotsql(path string) *dotsql.DotSql {
	dot, err := dotsql.LoadFromFile(path)
	if err != nil {
		panic(err)
	}

	return dot
}

func openDB(driverName string) (*sql.DB, error) {
	path, err := DataFilePath()
	if err != nil {
		return nil, err
	}

	db, err := sql.Open(driverName, path)
	if err != nil {
		return nil, err
	}

	fmt.Printf("Database opened at %s\n", path)

	return db, nil
}

func targetDataFilePath() string {
	return fmt.Sprintf("%s/%s", targetDataDir, targetDataFileName)
}

func DataFilePath() (string, error) {
	path, err := xdg.DataFile(targetDataFilePath())
	if err != nil {
		return "", err
	}

	if path != fmt.Sprintf("%s/%s", xdg.DataHome, targetDataFilePath()) {
		return "", errors.New("resolved data file path contra")
	}

	return path, nil
}
