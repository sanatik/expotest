/**
 * Created by bosone on 2/3/16.
 */
var mongoose = require('mongoose');
var Exposition = require('../models/ExpositionModel');
var UserModel = mongoose.model('User');
var bCrypt = require('bcrypt-nodejs');
var passport = require('passport');

var ObjectId = mongoose.Types.ObjectId;

exports.create = function (req, res) {
    var exposition = new Exposition();
    exposition.displayName = req.body.displayName;
    exposition.creator = req.decoded.userId;
    exposition.price = req.body.price;
    exposition.location = req.body.location;
    exposition.website = req.body.website;
    if (req.body.photo.content) {
        exposition.photo = {};
        exposition.photo.contentBase64 = new Buffer(req.body.photo.content, 'base64');
        exposition.photo.ext = req.body.photo.type;
    }
    exposition.startDate = new Date(req.body.startDate);
    exposition.endDate = new Date(req.body.endDate);
    if (req.body.presentation.presentation) {
        var base64Data = req.body.presentation.content;
        exposition.presentation = {};
        exposition.presentation.contentBase64 = new Buffer(base64Data, 'base64');
        exposition.presentation.ext = req.body.presentation.type;
    }
    exposition.description = req.body.description;
    exposition.additional = req.body.additional;
    exposition.expectedAudience = req.body.expectedAudience;
    exposition.minFeedBack = req.body.minFeedBack;
    exposition.testFlightRequest = true;
    exposition.moderatorCheckingResult = 0;

    exposition.save(function (err, result) {
        if (err) {
            res.send(err);
        }
        res.json(result);
    });
};

exports.getAll = function (req, res) {
    var location = req.query.location;
    var month = req.query.month;
    var format = req.query.format;
    var options = {};
    if (format) {
        options = {'format': format};
    }
    Exposition.find(options, function (err, results) {
        if (err) {
            res.send(err);
        }
        var expositions = [];
        for (var i in results) {
            var exposition = results[i];
            if (exposition.photo.contentBase64) {
                var photo = exposition.photo.contentBase64.toString('base64');
                exposition.photo.contentString = photo;
            }
            if (exposition.presentation.contentBase64) {
                var content = exposition.presentation.contentBase64.toString('base64');
                exposition.presentation.contentString = content;
            }
            if (month || location) {
                var filterDateStart = new Date();
                filterDateStart.setMonth(month - 1);
                filterDateStart.setDate(1);
                var filterDateEnd = new Date();
                if(month > 11){
                    month = 0;
                }
                filterDateEnd.setMonth(month);
                filterDateEnd.setDate(0);
                console.log(exposition.startDate);
                console.log(filterDateEnd);
                if (exposition.startDate.getTime() <= filterDateEnd.getTime()
                        && exposition.endDate.getTime() >= filterDateStart.getTime()) {
                    expositions.push(exposition);
                }
            }else{
                expositions.push(exposition);
            }

        }
        res.json(expositions);
    });
};

exports.get = function (req, res) {
    var id = req.params.id;
    try {
        id = new ObjectId(id);
        Exposition.findById(id, function (err, exposition) {
            if (err) {
                res.send(err);
            }
            if (exposition.photo.contentBase64) {
                var photo = exposition.photo.contentBase64.toString('base64');
                exposition.photo.contentString = photo;
            }
            if (exposition.presentation.contentBase64) {
                var content = exposition.presentation.contentBase64.toString('base64');
                exposition.presentation.contentString = content;
            }
            res.json(exposition);
        });
    } catch (e) {
        res.send(404);
    }
};

exports.update = function (req, res) {
    var id = req.params.id;
    try {
        id = new ObjectId(id);
        Exposition.findById(id, function (err, exposition) {
            if (err) {
                res.send(err);
            }

            var exposition = new Exposition();
            if (req.body.displayName) {
                exposition.displayName = req.body.displayName;
            }
            if (req.body.price)
                exposition.price = req.body.price;
            if (req.body.location)
                exposition.location = req.body.location;
            if (req.body.website)
                exposition.website = req.body.website;
            if (req.body.photo.content) {
                exposition.photo = {};
                exposition.photo.contentBase64 = new Buffer(req.body.photo.content, 'base64');
                exposition.photo.ext = req.body.photo.type;
            }
            if (req.body.startDate)
                exposition.startDate = new Date(req.body.startDate);
            if (req.body.endDate)
                exposition.endDate = new Date(req.body.endDate);
            if (req.body.presentation.presentation) {
                var base64Data = req.body.presentation.content;
                exposition.presentation = {};
                exposition.presentation.contentBase64 = new Buffer(base64Data, 'base64');
                exposition.presentation.ext = req.body.presentation.type;
            }
            if (req.body.description)
                exposition.description = req.body.description;
            if (req.body.additional)
                exposition.additional = req.body.additional;

            exposition.save(function (err) {
                if (err)
                    res.send(err);
                res.json({message: "Ok"});
            });

        });
    } catch (e) {
        res.send(404);
    }
};

exports.delete = function (req, res) {
    var id = req.params.id;
    try {
        id = new ObjectId(id);
        Exposition.remove({_id: id}, function (err, result) {
            if (err) {
                res.send(err);
            }
            res.json(result);
        });
    } catch (e) {
        res.send(404);
    }
};

exports.respond = function (req, res) {
    var id = req.params.id;
    var oId = req.params.oId;
    var currentUser = req.decoded;
    var newUser = req.body.newUser;
    if (id) {
        getUserInfo(currentUser, newUser, function (err, newUser) {
            if (err) {
                res.send(err);
            } else {
                id = new ObjectId(id);
                Exposition.findById(id, function (err, exposition) {
                    if (err) {
                        res.send(err);
                    }
                    var audience = {};
                    if (!exposition.audience) {
                        exposition.audience = [];
                    }
                    var userExists = false;
                    for (var i in exposition.audience) {
                        var a = exposition.audience[i];
                        if (a.userId && a.userId.equals(newUser._id)) {
                            var f = {};
                            oId = new ObjectId(oId);
                            f.offerId = oId;
                            f.answer = req.body.answer;
                            a.feedback.push(f);
                            userExists = true;
                            exposition.audience[i] = a;
                            break;
                        }
                    }
                    if (!userExists) {
                        audience.userId = newUser._id;
                        audience.name = newUser.displayName;
                        audience.phone = newUser.phone;
                        audience.position = newUser.position;
                        audience.company = newUser.company;
                        audience.city = newUser.city;
                        audience.email = newUser.email;
                        audience.feedback = [];
                        var feedback = {};
                        oId = new ObjectId(oId);
                        feedback.offerId = oId;
                        feedback.answer = req.body.answer;
                        audience.feedback.push(feedback);
                        exposition.audience.push(audience);
                    }

                    exposition.save(function (err) {
                        if (err)
                            res.send(err);
                        res.json({success: true});
                    });
                });
            }
        });
    }
};

exports.statistic = function (req, res) {
    var currentUser = req.decoded;
    var id = req.params.id;
    var oId = req.params.oId;
    if (currentUser && id && oId) {
        oId = new ObjectId(oId);
        Exposition.findById(id, function (err, exposition) {
            var result = [];
            if (err) {
                res.send(err);
            }
            var positive = 0;
            var audience = exposition.audience;
            if (audience) {
                for (var i in audience) {
                    var feedback = audience[i].feedback;
                    if (feedback) {
                        for (var j in feedback) {
                            var f = feedback[j];
                            if (oId.equals(f.offerId)) {
                                var r = {};
                                r.name = audience[i].name;
                                r.position = audience[i].position;
                                r.company = audience[i].company;
                                r.phone = audience[i].phone;
                                r.city = audience[i].city;
                                r.email = audience[i].email;
                                r.feedback = f.answer;
                                if (r.feedback === true) {
                                    positive++;
                                }
                                result.push(r);
                                break;
                            }
                        }
                    }
                }
            }
            res.json({success: true, result: result, positive: positive});
        });
    }
}

function getUserInfo(currentUser, user, callback) {
    if (currentUser) {
        mongoose.model('User').findById(currentUser.userId, function (err, user) {
            if (err) {
                callback(err, false);
            }
            callback(false, user);
        });
    } else {
        if (user) {
            UserModel.findOne({$or: [{'email': user.email}, {'phone': user.phone}]}, function (err, u) {
                // In case of any error, return using the done method
                if (err) {
                    console.log('Error in SignUp: ' + err);
                    callback('User already exists with username11: ', false);
                }
                // already exists
                if (u) {
                    callback(false, u);
                } else {
                    // if there is no user with that email
                    // create the user
                    var newUser = new UserModel();

                    newUser.displayName = user.displayName;
                    newUser.login = user.username;
                    newUser.password = createHash(user.password);
                    newUser.email = user.email;
                    newUser.phone = user.phone;
                    newUser.position = user.position;
                    newUser.company = user.company;
                    newUser.city = user.city;
                    newUser.role = 3;
                    newUser.description = user.description;
                    if (user.avatar) {
                        var avatar = new Buffer(user.avatar).toString('base64');
                        newUser.avatar = new Buffer(avatar, 'base64');
                    }
                    newUser.additional = user.additional;
                    // save the user
                    newUser.save(function (err) {
                        if (err) {
                            callback(err, false);
                        }
                        callback(false, newUser);
                    });
                }
            });
        } else {
            callback("User not found", false);
        }
    }
}

var createHash = function (password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

