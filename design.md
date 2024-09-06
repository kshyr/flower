## Commands
- `time`:
  - `<time string>` - e.g `1h 30m 10s`, `1h 30m`, `1h`, `30m`, `10s`
  - `reset` - resets the timer
  - `pause` - pauses the timer
  - `resume` - resumes the timer
  - `break` - toggles break mode
  - `end` - ends the timer and prints log entries
- `log`
  - `list` - lists all log entries
- `daily`


## UI
I am thinking of a viewport panel that displays main content - let's call it Viewport.
Content displayed is controlled by console prompt - let's call it Console.
There might also be a TUI Menu that can be used to navigate between different views or it could be a dynamic panel/sidebar per view - let's call it Sidebar.
And there should be an output panel that will display the output of the commands or errors - let's call it MessageCenter.
Might look like this:
SSSSVVVVVVVVVVVV
SSSSVVVVVVVVVVVV
SSSSVVVVVVVVVVVV
SSSSVVVVVVVVVVVV
MMMMMMMMMMMMMMMM
CCCCCCCCCCCCCCCC
