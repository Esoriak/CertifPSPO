const mysql = require('mysql')
const connection = mysql.createConnection({
    host : 'localhost',
    user: 'root',
    password: 'monsieurguiz',
    database: 'AgilBDD',
})

module.exports = connection
