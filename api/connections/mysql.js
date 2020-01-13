const mysql = require('mysql2')
const { db } = require('../configs')

const connection = mysql
    .createPool({
        host: `${db.host}`,
        user: `${db.username}`,
        password: `${db.password}`,
        database: `${db.name}`,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
    })
    .promise()

module.exports = connection
