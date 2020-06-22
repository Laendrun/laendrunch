require('dotenv').config();
const mysql = require('mysql');
const util = require('util');

// console.log(process.env.DB_URL);

exports.config = {
    host: process.env.DB_URL,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}
/**
 * 
 * @param {JSON} config DB Configuration for mysql
 * @param {string} config.host DB Server
 * @param {string} config.user DB User name
 * @param {string} config.password DB User password
 * @param {string} config.database DB Name
 */
exports.makeDb = (config) => {
    const conn = mysql.createConnection(config);

    return {
        query(sql, args) {
            return util.promisify(conn.query)
                .call(conn, sql, args);
        },
        close() {
            return util.promisify(conn.end().call(conn));
        }
    }
}