package db

import (
	"database/sql"
	_ "embed"
	"fmt"

	"github.com/adrg/xdg"
	"github.com/kshyr/flower/internal/config"
	_ "github.com/mattn/go-sqlite3"
	"github.com/qustavo/dotsql"
)

const (
	targetDataDir             = config.AppName
	targetDebugDataFileName   = config.AppName + ".debug.db"
	targetReleaseDataFileName = config.AppName + ".db"
)

type Tabler interface {
	CreateTable() (sql.Result, error)
	TableExists() bool
	DropTable() (sql.Result, error)
}

type DB struct {
	*sql.DB
	tables map[string]Tabler
	Timers *TimersTable
	Logs   *LogsTable
}

//go:embed timers.sql
var timersSQL string

//go:embed logs.sql
var logsSQL string

func NewDB() (*DB, error) {
	_db, err := openDB("sqlite3")
	if err != nil {
		return nil, err
	}

	tables := make(map[string]Tabler)
	timersTable := &TimersTable{
		DB:  _db,
		dot: mustLoadDotsql(timersSQL),
	}
	logsTable := &LogsTable{
		DB:  _db,
		dot: mustLoadDotsql(logsSQL),
	}
	tables["timers"] = timersTable
	tables["logs"] = logsTable

	db := &DB{
		_db,
		tables,
		timersTable,
		logsTable,
	}

	// create tables if they don't exist
	db.CreateTables()

	return db, nil
}

func (db *DB) CreateTables() error {
	for _, table := range db.tables {
		if !table.TableExists() {
			_, err := table.CreateTable()
			if err != nil {
				return err
			}
		}
	}
	return nil
}

func (db *DB) DropTables() error {
	for _, table := range db.tables {
		if table.TableExists() {
			_, err := table.DropTable()
			if err != nil {
				return err
			}
		}
	}
	return nil
}

func mustLoadDotsql(sqlString string) *dotsql.DotSql {
	dot, err := dotsql.LoadFromString(sqlString)
	if err != nil {
		panic(err)
	}
	return dot
}

func openDB(driverName string) (*sql.DB, error) {
	path, err := getDataFilePath()
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

func getDataFilePath() (string, error) {
	targetDataFileName := targetReleaseDataFileName
	if config.Debug {
		targetDataFileName = targetDebugDataFileName
	}
	targetPath := fmt.Sprintf("%s/%s", targetDataDir, targetDataFileName)
	path, err := xdg.DataFile(targetPath)
	if err != nil {
		return "", err
	}
	return path, nil
}

func mustGetInsertId(res sql.Result) int64 {
	id, err := res.LastInsertId()
	if err != nil {
		panic(err)
	}
	return id
}
