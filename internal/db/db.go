package db

import (
	"database/sql"
	"errors"
	"fmt"
	"log"

	"github.com/adrg/xdg"
	_ "github.com/mattn/go-sqlite3"
)

const (
	targetDataDir      = "flower"
	targetDataFileName = "flower.db"
)

type Tabler interface {
	CreateTable() (sql.Result, error)
	TableExists() bool
}

type DB struct {
	*sql.DB
}

func NewDB() (*DB, error) {
	println("hi")
	db, err := openDB("sqlite3")
	if err != nil {
		return nil, err
	}

	return &DB{
		db,
	}, nil
}

func openDB(driverName string) (*sql.DB, error) {
	path, err := DataFilePath()
	if err != nil {
		return nil, err
	}

	db, err := sql.Open(driverName, path)
	if err != nil {
		log.Fatal(err)
		return nil, err
	}

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
