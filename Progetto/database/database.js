const mysql = require('mysql')
const fs = require('fs');
var data = JSON.parse(fs.readFileSync("config.json", "utf8"));
const db = mysql.createPool({
    host: data["host"],
    user: data["user"],
    password: data["password"],
    database: data["database"]
})

module.exports = db;