package main

import (
	"log"

	database "github.com/kshyr/flower/internal/db"
)

const Ffffff = "d"

func main() {
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
}
