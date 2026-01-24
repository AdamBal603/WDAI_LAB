import sqlite3
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
schema_path = BASE_DIR / "schema.sql"

connection = sqlite3.connect('lab4\\database.db')


with open(schema_path) as f:
    connection.executescript(f.read())

cur = connection.cursor()

cur.execute("INSERT INTO posts (title, content) VALUES (?, ?)",
            ('First Post', 'Content for the first post')
            )

cur.execute("INSERT INTO posts (title, content) VALUES (?, ?)",
            ('Second Post', 'Content for the second post')
            )

connection.commit()
connection.close()