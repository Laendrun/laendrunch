require('dotenv').config();
const mysql = require('mysql');
const util = require('util');

console.log(process.env.DB_URL);

exports.config = {
    host: process.env.DB_URL,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}

exports.makeDb = (config) => {
    const conn = mysql.createConnection(config);

    return {
        query(sql, args) {
            return util.promisify(conn.query);
        },
        close() {
            return util.promisify(conn.end());
        }
    }
}