const express = require('express')
const { auth, checkUser, authLogged } = require('../middlewares/auth');
const userController = require('../controllers/user.js');
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

//Crear usuario
router.post("/signup", userController.createUser)

//Login
router.post("/login", userController.login)

// Logout 
router.get("/logout", auth, userController.logout);

module.exports = router;