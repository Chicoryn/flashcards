import { Pool } from 'pg'

export let pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
});

pool.query(`
    CREATE TABLE IF NOT EXISTS cards (
        id SERIAL PRIMARY KEY,
        question TEXT,
        answer TEXT
    )
`).catch(err => {
    console.error("Could not create database table -- " + err);
});
