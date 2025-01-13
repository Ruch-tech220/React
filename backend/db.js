const mysql = require("mysql");

const db = mysql.createConnection({
    host: "localhost",
    user: "root", // ชื่อผู้ใช้งาน MySQL
    password: "", // รหัสผ่าน MySQL
    database: "react_db", // ชื่อฐานข้อมูล
    multipleStatements: true, // เปิดใช้งาน Multiple Statements

});

db.connect((err) => {
    if (err) {
        console.log("Error connecting to database:", err);
    } else {
        console.log("Database connected!");
    }
});

module.exports = db;
