const express = require('express')
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

//Crear usuario
router.post("/signup", userController.createUser)

router.post("/login", userController.login)


module.exports = router;