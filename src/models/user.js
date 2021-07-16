const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Schema = mongoose.Schema;

const userSchema = new Schema({

    username:{
        type: String,
        required: true, 
        unique: true,
        trim: true,
    },
    password:{
        type: String,
        minlength: 6,
        trim: true,
        required: [true, 'Password is required']
    },
    tokens: [{
        token: {
            type: String,
            required: true
        } 
    }],
}, {
    timestamps: true 
})

//Metodo que valida las credenciales
userSchema.statics.findByCredentials = async (username, password) => {
    
    const user =  await User.findOne({ username: username });
    if(!user) {
        throw new Error("Wrong credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) {
        throw new Error("Wrong credentials")
    }

    return user;
}

userSchema.methods.generateToken = async function(){   
    const user = this;
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET, {expiresIn: "1h"})
    user.tokens = user.tokens.concat({ token: token });
    await user.save();

    return token;
}

userSchema.pre('save', async function(next) {

    const user = this;
    
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
},{
    timestamps: true
})

const User = mongoose.model('User', userSchema); 

module.exports = User;