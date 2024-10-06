const express = require("express");

const app = express();
const PORT = 3000;

app.get("/get-building/", (req, res) => {
    res.send("Hello world!");
});

app.listen(3000);
