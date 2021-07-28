const express = require('express')
const { auth, checkUser, authLogged } = require('../middlewares/auth');
const userController = require('../controllers/user.js');
const meliController = require('../controllers/melicontroller.js');
const router = express.Router();

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

module.exports = router;