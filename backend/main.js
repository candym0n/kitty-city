const express = require("express");
const cors = require("cors");
const db = require("./database");

const app = express();

app.use(cors());

app.get("/get-building/", (req, res) => {
    const buildingName = req.query.name;

    const selectAll = req.query.all;

    const data = [buildingName];

    db.query(selectAll ? "SELECT * FROM `building_data` WHERE 1" : "SELECT * FROM `building_data` WHERE name=?", selectAll ? [] : data, (err, result) => {
        if (err) {
            res.status(500).send({
                error: "Error querying building data from database"
            });
        } else if (result.length === 0) {
            res.status(400).send({
                error: "Could not find building " + buildingName
            });
        } else {
            res.json(selectAll ? result : result[0]);
        }
    });
});

app.listen(3000);
