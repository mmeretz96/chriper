const mysql = require("mysql2");
let _db

function initDb(){
    if(_db){
        console.log("Trying to init DB again!");
        return null
    }
    _db = mysql.createConnection({
        user: "root",
        host: "localhost",
        password: "1234",
        database: "fakedb",
      });
}

function getDb(){
    return _db
}

module.exports = {
    getDb,
    initDb
};