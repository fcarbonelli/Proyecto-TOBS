const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => { 
    const token = req.cookies.jwt;

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
          console.log(err.message);
          res.redirect('/login');
        } else {
          
          next();
        }
      });
    } else {
      res.redirect('/login');
    }
}

//Si estas logueado te redirecciona a la home
const authLogged = async (req, res, next) => { 
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        next();
      } else {
        res.redirect('/');       
      }
    });
  } else {
    next();
  }
}

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};




module.exports = { auth, checkUser, authLogged };