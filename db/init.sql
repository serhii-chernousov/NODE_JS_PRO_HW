CREATE TABLE IF NOT EXISTS users (
	id serial PRIMARY KEY,
	name text NOT NULL
);

INSERT INTO users (name)
SELECT v.name
FROM (VALUES ('Alice'), ('Bob'), ('Charlie')) AS v(name)
WHERE NOT EXISTS (SELECT 1 FROM users LIMIT 1);
