const express = require('express')
const multer = require("multer")
const path = require('path');
//const mimeTypes = require("mime-types")
const { auth, checkUser, authLogged } = require('../middlewares/auth');
const userController = require('../controllers/user.js');
const meliController = require('../controllers/melicontroller.js');
const router = express.Router();

const storage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, path.resolve(__dirname, "../uploads"))
    }, 
    filename: function(req,file, callback){
        callback(null, "tobsfile." + file.fieldname )
    }
})
const upload = multer({ storage: storage })

// Views
router.get("*", checkUser)

router.get("/", (req, res) => {
    res.render("index.html", {title: "Home"})
})

router.get("/login", authLogged, (req, res) => {
    res.render("login.html")
})

router.get("/signup", authLogged, (req, res) => {
    res.render("signup.html")
})

router.get("/upload", auth, (req, res) => {
    res.cookie('meli', req.query.code, { httpOnly: true });
    res.sendFile(__dirname + "views/upload.html")
    res.render("upload.html", {token: req.cookies.token})
})

router.get("/authorization", auth, meliController.authorizeAccount)

//Crear usuario
router.post("/signup", userController.createUser)

//Login
router.post("/login", userController.login)

// Logout 
router.get("/logout", auth, userController.logout);

router.post("/upload", meliController.generateTokenAxios)

router.post("/files", upload.single("csv"), meliController.postProducts)

router.get("/products", auth, userController.getProducts)

router.post("/email", userController.sendEmail)

router.get("/email", authLogged, (req, res) => {
    res.render("email.html")
})

module.exports = router;