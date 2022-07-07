const jwt = require("jsonwebtoken");
const userModel = require('../models/user.model');
const cookieParser = require('cookie-parser')

module.exports.checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.SECRET_TOKEN, async (err, decodedToken) => {
        if (err) {
          res.locals.user = null;
          res.cookie('jwt', '',{ maxAge:1});
          next();
        } else {
          let user = await userModel.findById(decodedToken.id);
          res.locals.user = user;
          next();
        }
      });
    } else {
      res.locals.user = null;
      next();
    }
  };
  
module.exports.requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.SECRET_TOKEN, async (err, decodedToken) => {
        if (err) {
            console.log(err);
            res.send(200).json('Pas de token')
        } else {
            console.log(decodedToken.id);
            next();
        }
        });
    } else {
        console.log('Pas de token');
    }
};