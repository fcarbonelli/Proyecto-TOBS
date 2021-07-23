const express = require('express')
const { auth, checkUser, authLogged } = require('../middlewares/auth');
const userController = require('../controllers/user.js');
const router = express.Router();

// Views
router.get("*", checkUser)

router.get("/", (req, res) => {
    console.log(req.query.code)
    res.render("index.html", {title: "Home"})
})

router.get("/login", authLogged, (req, res) => {
    res.render("login.html")
})

router.get("/signup", authLogged, (req, res) => {
    res.render("signup.html")
})

router.get("/authorization", auth, (req, res) => {  
    res.redirect("https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id="+process.env.APP_ID+"&redirect_uri="+process.env.REDIRECT_URI)
})

//Crear usuario
router.post("/signup", userController.createUser)

//Login
router.post("/login", userController.login)

// Logout 
router.get("/logout", auth, userController.logout);

module.exports = router;