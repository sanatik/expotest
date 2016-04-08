/**
 * Created by bosone on 2/3/16.
 */
var mongoose = require('mongoose');
var Exposition = require('../models/ExpositionModel');
var moment = require('moment');
var UserModel = mongoose.model('User');
var bCrypt = require('bcrypt-nodejs');
var passport = require('passport');

var ObjectId = mongoose.Types.ObjectId;

exports.create = function (req, res) {
    var exposition = new Exposition();
    exposition.displayName = req.body.displayName;
    exposition.creator = req.decoded.userId;
    exposition.price = req.body.price;
    exposition.format = req.body.format;
    exposition.location = req.body.location;
    exposition.website = req.body.website;
    if (req.body.photo.content) {
        exposition.photo = {};
        exposition.photo.contentBase64 = new Buffer(req.body.photo.content, 'base64');
        exposition.photo.ext = req.body.photo.type;
    }
    exposition.startDate = moment(req.body.startDate, "DD-MM-YYYY").toDate();
    exposition.endDate = moment(req.body.endDate, "DD-MM-YYYY").toDate();
    if (req.body.presentation.presentation) {
        var base64Data = req.body.presentation.content;
        exposition.presentation = {};
        exposition.presentation.contentBase64 = new Buffer(base64Data, 'base64');
        exposition.presentation.ext = req.body.presentation.type;
    }
    exposition.description = req.body.description;
    exposition.additional = req.body.additional;
    exposition.expectedAudience = req.body.expectedAudience;
    exposition.participantsNumber = req.body.participantsNumber;
    exposition.minFeedBack = req.body.minFeedBack;
    exposition.testFlightRequest = true;
    exposition.moderatorCheckingResult = 0;
    exposition.themes = req.body.themes;
    exposition.aboutAuditory = req.body.aboutAuditory;
    var themeIds = [];
    for (var i in exposition.themes) {
        themeIds.push(exposition.themes[i]._id);
    }
    var tags = req.body.tags;
    var insertTags = [];
    for (var i in tags) {
        insertTags.push(tags[i].text);
        for (var j in exposition.themes) {
            if (!exposition.themes[j].tags) {
                exposition.themes[j].tags = [];
            }
            exposition.themes[j].tags.push(tags[i].text);
        }
    }
    mongoose.model('Tag')
            .update({_id: {$in: themeIds}}, {$addToSet: {tags: {$each: insertTags}}},
            {upsert: true, multi: true}, function (err) {
                if (err) {
                    res.json(err);
                } else {
                    exposition.save(function (err, result) {
                        if (err) {
                            res.send(err);
                        }
                        res.json(result);
                    });
                }
            });
//    mongoose.model('Tag').find({_id: {$in: [themeIds]}}, function (err, themes) {
//        if (err) {
//            res.send(err);
//        }
//        for (var i in themes) {
//            if (themes[i].tags) {
//                for (var j in tags) {
//                    if (!tagExists(tags[j], themes[i].tags)) {
//                        themes[i].tags.push(tags[j]);
//                    }
//                }
//            }else{
//                themes[i].tags = [];
//                for (var j in tags) {
//                    themes[i].tags.push(tags[j]);
//                }
//            }
//        }
//    });


};

function tagExists(tag, tags) {
    for (var i in tags) {
        if (tags[i] === tag) {
            return true;
        }
    }
    return false;
}

exports.getAll = function (req, res) {
    var user = req.decoded;
    var location = req.query.location;
    var month = req.query.month;
    var year = req.query.year;
    var format = req.query.format;
    var my = req.query.my;
    var themes = req.query.themes;
    var options = {};
    if (format && format !== '0') {
        options = {'format': format};
    }
    if (location) {
        location = JSON.parse(location);
    }
    if (user && my && my === '1') {
        options.creator = user.userId;
    }
    var filterThemes = null;
    if (themes) {
        if (themes instanceof Array) {
            filterThemes = themes;
        } else {
            filterThemes = [];
            filterThemes.push(themes);
        }
    }
    Exposition.find(options, function (err, results) {
        if (err) {
            res.send(err);
        } else {
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
                if (month || location || themes || year) {
                    var filterDateStart = new Date();
                    filterDateStart.setMonth(month - 1);
                    filterDateStart.setDate(1);
                    var filterDateEnd = new Date();
                    if (month > 11) {
                        month = 0;
                    }
                    if (year > 0) {
                        filterDateStart.year = year;
                        filterDateEnd.year = year;
                    }
                    filterDateEnd.setMonth(month);
                    filterDateEnd.setDate(0);
                    if (exposition.startDate.getTime() <= filterDateEnd.getTime()
                            && exposition.endDate.getTime() >= filterDateStart.getTime()) {
                        expositions.push(exposition);
                    } else if (location) {
                        if (exposition.location) {
                            var type = location.types[0];
                            if (type === 'locality') {
                                if (exposition.location.place_id === location.place_id) {
                                    expositions.push(exposition);
                                }
                            } else if (type === 'country') {
                                var acs = exposition.location.address_components;
                                if (acs[acs.length - 1].types[0] === 'country') {
                                    if (acs[acs.length - 1].long_name === location.address_components[0].long_name) {
                                        expositions.push(exposition);
                                    }
                                }
                            }
                        }
                    } else if (filterThemes) {
                        if (exposition.themes) {
                            for (var i in filterThemes) {
                                if (hasTheme(filterThemes[i], exposition.themes)) {
                                    expositions.push(exposition);
                                    break;
                                }
                            }
                        }
                    }
                } else {
                    expositions.push(exposition);
                }

            }
        }

        res.json(expositions);
    });
};

function hasTheme(theme, themes) {
    for (var i in themes) {
        var t = themes[i];
        var themeId = new ObjectId(JSON.parse(theme)._id);
        var tId = new ObjectId(t._id);
        if (themeId.equals(tId)) {
            return true;
        }
    }
    return false;
}

exports.get = function (req, res) {
    var id = req.params.id;
    try {
        id = new ObjectId(id);
        Exposition.findOne({_id: id}).populate('creator').exec(function (err, exposition) {
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
            if (exposition.format) {
                exposition.formatString = getFormatString(exposition.format);
            }
            res.json(exposition);
        });
    } catch (e) {
        res.send(404);
    }
};

function getFormatString(id) {
    switch (id) {
        case 1:
            return "Выставка";
        case 2:
            return "Премия";
        case 3:
            return "Конференция";
        case 4:
            return "Форум";
    }
    return "-";
}

exports.update = function (req, res) {
    var id = req.params.id;
    try {
        id = new ObjectId(id);
        Exposition.findById(id, function (err, exposition) {
            if (err) {
                res.send(err);
            }
            if (req.body.displayName) {
                exposition.displayName = req.body.displayName;
            }
            if (req.body.price) {
                exposition.price = req.body.price;
            }
            if (req.body.format) {
            exposition.format = req.body.format;
                
            }
            if (req.body.location) {
                exposition.location = req.body.location;
            }
            if (req.body.website) {
                exposition.website = req.body.website;
            }
            if (req.body.photo.content) {
                exposition.photo = {};
                exposition.photo.contentBase64 = new Buffer(req.body.photo.content, 'base64');
                exposition.photo.ext = req.body.photo.type;
            }
            if (req.body.startDate) {
                exposition.startDate = moment(req.body.startDate, "DD-MM-YYYY").toDate();
            }
            if (req.body.endDate) {
                exposition.endDate = moment(req.body.endDate, "DD-MM-YYYY").toDate();
            }
            
            if (req.body.presentation) {
                var base64Data = req.body.presentation.content;
                exposition.presentation = {};
                exposition.presentation.contentBase64 = new Buffer(base64Data, 'base64');
                exposition.presentation.ext = req.body.presentation.type;
            }
            if (req.body.expectedAudience) {
                exposition.description = req.body.description;
            }
            if (req.body.description) {
                exposition.expectedAudience = req.body.expectedAudience;
            }
            if (req.body.participantsNumber) {
                exposition.participantsNumber = req.body.participantsNumber;
            }
            if (req.body.minFeedBack) {
                exposition.minFeedBack = req.body.minFeedBack;
            }
            if (req.body.themes) {
                exposition.themes = req.body.themes;
            }
            if (req.body.aboutAuditory) {
                exposition.aboutAuditory = req.body.aboutAuditory;
            }
            var themeIds = [];
            for (var i in exposition.themes) {
                themeIds.push(exposition.themes[i]._id);
            }
            var tags = req.body.tags;
            var insertTags = [];
            for (var i in tags) {
                insertTags.push(tags[i].text);
                for (var j in exposition.themes) {
                    if (!exposition.themes[j].tags) {
                        exposition.themes[j].tags = [];
                    }
                    exposition.themes[j].tags.push(tags[i].text);
                }
            }
            mongoose.model('Tag')
                    .update({_id: {$in: themeIds}}, {$addToSet: {tags: {$each: insertTags}}},
                    {upsert: true, multi: true}, function (err) {
                        if (err) {
                            res.json(err);
                        } else {
                            exposition.save(function (err, result) {
                                if (err) {
                                    res.send(err);
                                }
                                res.json(result);
                            });
                        }
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

                            a.position = newUser.position;
                            a.company = newUser.company;
                            a.city = newUser.city;
                            a.displayName = newUser.displayName;

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
    var location = req.body.location;
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
                                if (location) {
                                    if (audience[i].city) {
                                        var type = location.types[0];
                                        if (type === 'locality') {
                                            if (audience[i].city.place_id === location.place_id) {
                                                result.push(r);
                                                break;
                                            }
                                        } else if (type === 'country') {
                                            var acs = audience[i].city.address_components;
                                            if (acs[acs.length - 1].types[0] === 'country') {
                                                if (acs[acs.length - 1].long_name === location.address_components[0].long_name) {
                                                    result.push(r);
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                } else {
                                    result.push(r);
                                    break;
                                }
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
                    u.position = user.position;
                    u.company = user.company;
                    u.city = user.city;
                    u.displayName = user.displayName;

                    u.save(function (err) {
                        if (err) {
                            callback(err, false);
                        }
                        callback(false, u);
                    });
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

