/**
 * Created by Serikuly_S on 09.02.2016.
 */
var express = require('express');
var router = express.Router();

var isAuthenticated = function (req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects
    if (req.isAuthenticated())
        return next();
    // if the user is not authenticated then redirect him to the login page
    res.redirect('/');
}

module.exports = function (passport) {

    /* GET login page. */
    router.get('/', function (req, res) {
        res.json({message: req.flash('message')});
    });

    /* Handle Login POST */
    router.post('/login', function (req, res, next) {
        passport.authenticate('login', function(err, user, info){
            if(user){
                res.user = user;
                res.json({message: "OK"});
            }else{
                res.json({message: req.flash('message')});
            }
        })(req, res, next);
    });

    /* GET Registration Page */
    router.get('/signup', function (req, res) {
        res.json({message: req.flash('message')});
    });

    /* Handle Registration POST */
    router.post('/signup', function (req, res, next) {
        passport.authenticate('signup', function (err, user, info) {
            if (user) {
                res.json({message: "OK"});
            }else{
                res.json({message: req.flash('message')});
            }

        })(req, res, next);
    });

    /* Handle Logout */
    router.get('/signout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    return router;
};
