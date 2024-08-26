--name: create-logs-table
CREATE TABLE logs (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	message TEXT NOT NULL,
	timer_id INTEGER NOT NULL,
	created_at DATE NOT NULL,
	updated_at DATE NOT NULL,
	FOREIGN KEY(timer_id) REFERENCES timers(id)
);

--name: add-log
INSERT INTO logs
(message, timer_id, created_at, updated_at)
VALUES(?, ?,
    DATETIME('now', 'localtime'),
    DATETIME('now', 'localtime'));

--name: get-logs
SELECT * FROM logs;

--name: get-logs-by-timer-id
SELECT * FROM logs WHERE timer_id = ?;

--name: drop-logs-table
DROP TABLE logs;
