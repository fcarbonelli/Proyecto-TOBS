const express = require("express")
const morgan = require("morgan");
const cookieParser = require('cookie-parser');
const path = require("path")
require('dotenv').config()
const dbConnect = require('./database');

const app = express()

dbConnect()

app.set("port",process.env.PORT || 3000)
app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, "public")))
app.use(cookieParser());
app.engine("html", require("ejs").renderFile)
app.set("view engine", "ejs")
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(morgan("dev"));


app.use(require("./routes/index"))

app.listen(app.get("port"), () => {
    console.log("PORT",app.get("port"))
})

