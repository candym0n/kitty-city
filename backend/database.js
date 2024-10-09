const mysql = require("mysql");
const dotenv = require("dotenv");

dotenv.config();

// Connect to the db
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: "",
    database: process.env.DB_NAME,
    multipleStatements: true
});

connection.connect((err) => {
    if (err) {
        console.error("Error connecting to database: ", err);
    } else {
        console.log("Connected to the database!");
    }
});

module.exports = connection;
