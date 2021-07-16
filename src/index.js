const express = require("express")
const path = require("path")
const bodyParser = require("body-parser")
const dbConnect = require('./database');
require('dotenv').config()

const app = express()

dbConnect()

app.set("port",3000)
app.set("views", path.join(__dirname, "views"))
app.engine("html", require("ejs").renderFile)
app.set("view engine", "ejs")
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use(require("./routes/index"))

app.use(express.static(path.join(__dirname, "public")))


app.listen(app.get("port"), () => {
    console.log("PORT",app.get("port"))
})

