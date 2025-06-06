const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('progress.db');

// Criar tabela de progresso
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS topic_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        area TEXT NOT NULL,
        subject TEXT NOT NULL,
        topic TEXT NOT NULL,
        completed BOOLEAN DEFAULT 0,
        completion_date DATETIME
    )`);
});

// Funções para manipular o progresso
function markTopicAsCompleted(area, subject, topic) {
    return new Promise((resolve, reject) => {
        const stmt = db.prepare(`
            INSERT OR REPLACE INTO topic_progress (area, subject, topic, completed, completion_date)
            VALUES (?, ?, ?, 1, DATETIME('now'))
        `);
        stmt.run([area, subject, topic], (err) => {
            if (err) reject(err);
            else resolve();
        });
        stmt.finalize();
    });
}

function unmarkTopicAsCompleted(area, subject, topic) {
    return new Promise((resolve, reject) => {
        const stmt = db.prepare(`
            INSERT OR REPLACE INTO topic_progress (area, subject, topic, completed, completion_date)
            VALUES (?, ?, ?, 0, NULL)
        `);
        stmt.run([area, subject, topic], (err) => {
            if (err) reject(err);
            else resolve();
        });
        stmt.finalize();
    });
}

function getTopicProgress(area, subject, topic) {
    return new Promise((resolve, reject) => {
        db.get(
            'SELECT completed, completion_date FROM topic_progress WHERE area = ? AND subject = ? AND topic = ?',
            [area, subject, topic],
            (err, row) => {
                if (err) reject(err);
                else resolve(row || { completed: 0, completion_date: null });
            }
        );
    });
}

module.exports = {
    markTopicAsCompleted,
    unmarkTopicAsCompleted,
    getTopicProgress
}; 