const mongoose = require('mongoose');
const { isEmail } = require("validator")
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const userSchema = new Schema({

    email: {
        type: String,
        required: [true, "Please insert an email"],
        unique: true, 
        lowercase: true,  
        validate: [isEmail, "Please insert a valid email"]     
    },
    password:{
        type: String,
        minlength: [6, "Minimum password length is 6 characters"],
        trim: true,
        required: [true, 'Password is required']
    },
    products: [{
        type: String
    }]      
}, {
    timestamps: true 
})

userSchema.statics.findByCredentials = async (email, password) => {
    
    const user =  await User.findOne({ email: email });
    if(!user) {
        throw new Error("Wrong credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) {
        throw new Error("Wrong credentials")
    }

    return user;
}

userSchema.statics.saveProducts = async (product, email) => {
    
    const user =  await User.findOne({ email: email });
    
    //user.products = user.product.concat({product: product})
    user.products.push(product)
    await user.save()
    return user
}

userSchema.statics.getProducts = async (email) => {

    const user =  await User.findOne({ email: email });
    
    //let products = JSON.stringify(user.products)
    let products = user.products
    
    return products
}

userSchema.pre('save', async function(next) {

    const user = this;
    
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
})

const User = mongoose.model('User', userSchema); 

module.exports = User;