/* CONNECTING A  MY SQL DATABASE */

const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'node-complete',
    password: 'NODEparty2020'
});

module.exports = pool.promise();
