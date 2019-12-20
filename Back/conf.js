const mysql = require('mysql')

//protect DB with .env

// require('dotenv').config(process.cwd(), '.env')

const connection = mysql.createConnection({
    multipleStatements: true,
    host : 'localhost',
    user: 'root',
    password: 'monsieurguiz',
    database: 'AgilBDD',
})

module.exports = connection
