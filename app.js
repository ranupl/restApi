require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const xml2js = require("xml2js");
const app = express();
require("./src/db/connection");
const router = require("./src/router/userRouter");

const PORT = process.env.PORT || 7000;

// Middleware to parse JSON and XML
app.use(bodyParser.json());
app.use(bodyParser.text({ type: "application/xml" }));

app.use("/api", router);

app.get("/", (req, res) => {
  res.send("app started");
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    code: err.status,
    success: false,
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
});
