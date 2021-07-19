const express = require('express')
const auth = require('../middlewares/auth');
const userController = require('../controllers/user.js');
const router = express.Router();

router.get("/", (req, res) => {
    res.render("index.html", {title: "Home"})
})

router.get("/login", (req, res) => {
    res.render("login.html")
})

router.get("/signup", (req, res) => {
    res.render("signup.html")
})

router.get("/logout", (req, res) => {
    res.render("logout.html")
})

//Crear usuario
router.post("/signup", userController.createUser)

//Login
router.post("/login", userController.login)

// Logout 
router.post("/logout", auth, userController.logout);

module.exports = router;