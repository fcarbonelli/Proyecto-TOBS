const mongoose = require('mongoose');

//var uri = "mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@dbtobs.6gl3p.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority";
//var uri = "mongodb+srv://"+process.env.DB_USER+":"+process.env.DB_PASS+"@dbtobs.6gl3p.mongodb.net/"+process.env.DB_NAME+"?retryWrites=true&w=majority"
var uri = "mongodb+srv://admin:admin@dbtobs.6gl3p.mongodb.net/tobsDB?retryWrites=true&w=majority"

console.log(uri)
console.log(process.env.DB_USER)

async function dbConnect() {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        console.log("Connected to DataBase")
    } catch (e) {
        console.log(e+" Error while connecting to the database");
        //console.log("mongodb+srv://"+process.env.DB_USER+":"+process.env.DB_PASS+"@dbtobs.6gl3p.mongodb.net/"+process.env.DB_NAME+"?retryWrites=true&w=majority")
    }
    console.log(mongoose.connection.readyState);
}

module.exports = dbConnect;