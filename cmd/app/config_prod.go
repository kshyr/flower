//go:build prod

package app

import "github.com/kshyr/flower/internal/db"

func (d devEnv) recreateTables(db *db.DB) {}
