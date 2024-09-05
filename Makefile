.DEFAULT_GOAL := debug

debug:
	FLDEBUG=1 go run .

release:
	go run .

dbm:
	go run cmd/dbmanager/main.go
