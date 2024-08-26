//go:build dev

package app

import "github.com/kshyr/flower/internal/db"

func (d devEnv) recreateTables(db *db.DB) {
	db.DropTables()
	db.CreateTables()
}
