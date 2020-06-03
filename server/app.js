const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const api = require("./routes/api");

const app = express();
app.listen(3000, "0.0.0.0");

const mongoose = require("mongoose");
mongoose.connect(`mongodb://localhost:27017/test`);
const conn = mongoose.connection;
conn.on("connected", function (err) {
  if (err) {
    console.log("Cannot connect database! Error: " + err);
  } else {
    console.log("Mongodb run successfully!");
  }
});

app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", api);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
});

module.exports = app;
