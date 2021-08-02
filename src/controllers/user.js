const User = require('../models/user');
const jwt = require('jsonwebtoken');

const userController = {

    createUser: async (req, res) => {
        const { email, password } = req.body;  
        try {          
            const user = await User.create({ email, password });
            const token = createToken(user._id);

            res.cookie('jwt', token, { httpOnly: true });
            //res.status(201).json({ user, token });
            res.redirect("/")
        } catch (error) {          
            res.status(400).json({ success: false, code: 400, message: error.message });
            //res.redirect("/signup")
        }
    },
    login: async (req, res) => {        
        const { email, password } = req.body;
        try {
            const user = await User.findByCredentials(email, password);
            const token = createToken(user._id);
            res.cookie('jwt', token, { httpOnly: true });
            res.cookie('email', email, { httpOnly: true });
            //res.status(200).json({ user: user._id });
            res.redirect("/")
        } 
        catch (err) {          
            res.status(400).json(err);
        }
    },
    logout: async (req, res) => {
        res.cookie('jwt', '', { maxAge: 1 });
        res.cookie('meli', '', { maxAge: 1 });
        res.cookie('token', '', { maxAge: 1 });

        res.redirect('/');
    },
    getProducts: async (req, res) => {
        let products = await User.getProducts(req.cookies.email)
        
        res.render("products.html", { products: products })
    }
}

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: 10000
    });
};

module.exports = userController