const jwt = require('jsonwebtoken');
const User = require('../models/user');


const auth = async (req, res, next) => {
    
    try {
        let token = req.header('Authorization');
        if(!token) {           
            throw new Error('Unauthorized');
        }
        token = token.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

        if(!user) {
            throw new Error('Unauthorized');
        }

        req.token = token;
        req.user = user; 
        next()
    } catch (e) {
        console.log(e.message);
        return res.status(401).send({error: 'Please authenticate'});
    } 
}

module.exports = auth;