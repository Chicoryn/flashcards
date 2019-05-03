import { pool } from '../db/index';

export default class Card {
    constructor(row) {
        this.id = row['id'];
        this.question = row['question'];
        this.answer = row['answer'];
    }

    static async create(question, answer) {
        let result = await pool.query(
            'INSERT INTO cards (question, answer) VALUES ($1, $2)',
            [question, answer]
        );

        return result.rowCount > 0;
    }

    static async update(id, question, answer) {
        let result = await pool.query(
            'UPDATE cards SET question = $2, answer = $3 WHERE id = $1',
            [id, question, answer]
        );

        return result.rowCount > 0;
    }

    static async destroy(id) {
        let result = await pool.query(
            'DELETE FROM cards WHERE id = $1',
            [id]
        );

        return result.rowCount > 0;
    }

    static async getAll() {
        let result = await pool.query(
            'SELECT * FROM cards ORDER BY id'
        );

        return result.rows.map(row => new Card(row));
    }
}