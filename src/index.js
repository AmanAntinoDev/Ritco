const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const logger = require("morgan");
const bodyParser = require("body-parser");
const { connectPostgresql } = require("../src/Db/db.config");
const path = require('path');
const app = express();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
connectPostgresql();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));
app.get('/', (req, res) => {
  res.send("server is running on AWS");
});


app.listen(8080, () => {
  console.log(`Server is running on port ${8080}`);
});