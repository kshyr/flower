.DEFAULT_GOAL := run

run:
	go run cmd/flower/main.go

dbm:
	go run cmd/dbmanager/main.go
