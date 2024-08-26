.DEFAULT_GOAL := dev

dev:
	go run -tags dev .

run:
	go run -tags prod .

dbm:
	go run cmd/dbmanager/main.go
