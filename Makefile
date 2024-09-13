.DEFAULT_GOAL := cli-debug

RUN_GUI = cd cmd/flower && wails dev
RUN_CLI = go run ./cmd/flwr $(ARGS)

gui: gui-debug
cli: cli-debug

gui-debug:
	FLDEBUG=1 $(RUN_GUI)

cli-debug:
	FLDEBUG=1 $(RUN_CLI)

gui-release:
	$(RUN_GUI)

cli-release:
	$(RUN_CLI)
