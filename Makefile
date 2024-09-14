.DEFAULT_GOAL := cli-debug

RUN_GUI = cd desktop && wails dev
BUILD_GUI = cd desktop && wails build
RUN_CLI = cd cli go run . $(ARGS)

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

gui-build:
	$(BUILD_GUI)
