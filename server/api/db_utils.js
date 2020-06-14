const mysql = require('mysql');
const util = require('util');

exports.config = {
    host: "lx3d0.myd.infomaniak.com",
    user: "lx3d0_api_user",
    password: "CLtAch6c9hatm76",
    database: "lx3d0_api"
}

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