// src/lib/db.js
import mysql from 'mysql2';

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'netflix',
});

const db = connection.promise(); // ⬅️ Important

export default db;
