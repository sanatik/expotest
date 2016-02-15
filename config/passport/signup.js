/**
 * Created by Serikuly_S on 09.02.2016.
 */
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var UserModel = mongoose.model('User');
var bCrypt = require('bcrypt-nodejs');

module.exports = function (passport) {

    passport.use('signup', new LocalStrategy({
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function (req, username, password, done) {

            findOrCreateUser = function () {
                // find a user in Mongo with provided username
                UserModel.findOne({'login': username}, function (err, user) {
                    // In case of any error, return using the done method
                    if (err) {
                        console.log('Error in SignUp: ' + err);
                        return done(err);
                    }
                    // already exists
                    if (user) {
                        console.log('User already exists with username: ' + username);
                        return done(null, false, req.flash('message', 'User Already Exists'));
                    } else {
                        // if there is no user with that email
                        // create the user
                        var newUser = new UserModel();

                        // set the user's local credentials
                        newUser.displayName = req.param('displayName');
                        newUser.login = username;
                        newUser.password = createHash(password);
                        newUser.email = req.param('email');
                        newUser.phone = req.param('phone');
                        newUser.role = req.param('role');
                        newUser.description = req.param('description');
                        if (req.param('avatar')) {
                            var avatar = new Buffer(req.param('avatar')).toString('base64');
                            newUser.avatar = new Buffer(avatar, 'base64');
                        }
                        newUser.additional = req.param('additional');
                        // save the user
                        newUser.save(function (err) {
                            if (err) {
                                console.log('Error in Saving user: ' + err);
                                throw err;
                            }
                            console.log('User Registration succesful');
                            return done(null, newUser);
                        });
                    }
                });
            };
            // Delay the execution of findOrCreateUser and execute the method
            // in the next tick of the event loop
            process.nextTick(findOrCreateUser);
        })
    );

    // Generates hash using bCrypt
    var createHash = function (password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

}
