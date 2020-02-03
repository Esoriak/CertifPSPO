const mysql = require('mysql')

//protect DB with .env

require('dotenv').config(process.cwd(), '.env')

// const connection = mysql.createConnection({
//     multipleStatements: true,
//     host : 'localhost',
//     user: 'root',
//     password: 'monsieurguiz',
//     database: 'QCMpsmpo',
// })

const connection = mysql.createConnection({
    multipleStatements: true,
    host : '51.91.109.91',
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_DB,
})



connection.connect( (err) => {
    if (err) {
        console.error("error connecting " + err.stack );
        return
    }
    console.log("connected as id" + connection.threadId)
})

module.exports = connection
