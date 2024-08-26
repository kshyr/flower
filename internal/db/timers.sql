--name: create-timers-table
CREATE TABLE timers (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL,
	duration INTEGER NOT NULL,
	created_at DATE NOT NULL,
	updated_at DATE NOT NULL
);

--name: add-timer
INSERT INTO timers
(name, duration, created_at, updated_at)
VALUES(?, ?,
    DATETIME('now', 'localtime'),
    DATETIME('now', 'localtime'));

--name: get-timers
SELECT * FROM timers;

--name: drop-timers-table
DROP TABLE timers;
