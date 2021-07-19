const User = require('../models/user');

const userController = {

    createUser: async (req, res) => {
        const user = new User(req.body);
        console.log(user)
        if (!user) {
            return res.status(400).json({ success: false, code: 400, message: 'Error creating User' })
        }
        try {
            
            await user.save();
            const token = await user.generateToken();

            //status 201, CREATED
            res.status(201).json({ success: true, message: "User created successfully", user, token });
            //res.redirect("/login")
        } catch (error) {
            //error 400 
            //res.status(400).json({ success: false, code: 400, message: error.message });
            res.redirect("/signup")
        }
    },
    login: async (req, res) => {        
        try {
            const user = await User.findByCredentials(req.body.email, req.body.password);

            const token = await user.generateToken();
            console.log("LOGUEADO")

            res.status(200).json({ user, token });
            //res.redirect("/")       
        } catch (e) {
            //res.status(401).json(e);
            res.redirect("/login")
        }
    },
    logout: async (req, res) => {
        console.log("logout")
        try {
            req.user.tokens = []
            await req.user.save();
            //res.redirect("/")       
            res.json({success: true, message: "Log out succesful"});
        } catch (e) {
            //res.status(500).json();
            res.status(500).json({ success: false, code: 500, message: 'Error in Log Out' })
        }
    },
}

module.exports = userController