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
        } catch (error) {
            //error 400 
            res.status(400).json({ success: false, code: 400, message: error.message });
        }
    },
    login: async (req, res) => {

        try {
            const user = await User.findByCredentials(req.body.username, req.body.password);

            const token = await user.generateToken();
            res.status(200).json({ user, token });
            //res.status(200).json({ user });
        } catch (e) {
            res.status(401).json(e);
        }
    },
}

module.exports = userController