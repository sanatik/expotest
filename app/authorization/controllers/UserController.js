/**
 * Created by Serikuly_S on 10.02.2016.
 */
var mongoose = require('mongoose');
var config = require('../../../config/config');

var ObjectId = mongoose.Types.ObjectId;

exports.getAll = function (req, res) {
    var user = req.decoded;
    if (user && user.role === 5) {
        mongoose.model('User').find({}, null, {sort: '-balance'}, function (err, users) {
//            for (var i = 0; i < users.length; i++) {
//                var user = users[i];
//            }
            res.json({
                success: true,
                users: users
            });
        });
    }
}

exports.getById = function (req, res) {

    var currentUserId = new ObjectId(req.decoded.userId);
    var userId = currentUserId;
    if (req.params.id) {
        userId = req.params.id;
    }
    if (userId) {
        mongoose.model('User').findById(userId, function (err, user) {
            if (err) {
                res.status(404).send({
                    success: false,
                    message: "Not found"
                });
            }
            delete user.password;
            delete user.salt;
            delete user.cart;
            if (!currentUserId.equals(user._id)) {
                delete user.balance;
            } else {
                if (user.role === 1) {
                    var balance = user.balance;
                    user.balance = balance * config.commission / 100;
                }
            }
            res.json(user);
        });
    }
};
exports.edit = function (req, res) {
    var currentUserId = new ObjectId(req.decoded.userId);
    if (req.params.id) {
        var hasAccess = false;
        var id = new ObjectId(req.params.id);
        if (id.equals(currentUserId)) {
            hasAccess = true;
        } else {
            if (req.decoded.role === 5) {
                hasAccess = true;
            }
        }
        if (hasAccess) {
            mongoose.model('User').findById(id, function (err, user) {
                if (err) {
                    res.status(404).send({
                        success: false,
                        message: "Not found"
                    });
                }
                if (user.lock) {
                    res.status(403).send({
                        success: false,
                        message: "No permission"
                    });
                }
                if (req.body.displayName) {
                    user.displayName = req.body.displayName;
                }
                if (req.body.login) {
                    user.login = req.body.login;
                }
                if (req.body.email) {
                    user.email = req.body.email;
                }
                if (req.body.phone) {
                    user.phone = req.body.phone;
                }
                if (req.body.description) {
                    user.description = req.body.description;
                }
                user.save(function (err, result) {
                    if (err) {
                        res.json({
                            success: false,
                            message: "Error save user"
                        });
                    }
                    res.json({
                        success: true
                    });
                });
            });
        } else {
            res.status(403).send({
                success: false,
                message: "No permission"
            });
        }
    }
};
exports.lock = function (req, res) {
    var user = req.decoded;
    if (user) {
        if (user.role === 5) {
            if (req.params.id) {
                var id = new ObjectId(req.params.id);
                mongoose.model('User').findById(id, function (err, user) {
                    if (err) {
                        res.status(404).send({
                            success: false,
                            message: "Not found"
                        });
                    }
                    user.lock = (user.lock === true ? false : true);
                    console.log(user.lock);
                    user.save(function (err, result) {
                        if (err) {
                            res.json({
                                success: false,
                                message: "Error save user"
                            });
                        }
                        res.json({
                            success: true
                        });
                    });
                });
            } else {
                res.status(403).send({
                    success: false,
                    message: "No permission"
                });
            }
        } else {
            res.status(403).send({
                success: false,
                message: "No permission"
            });
        }
    } else {
        res.status(403).send({
            success: false,
            message: "No permission"
        });
    }
};

exports.topUp = function (req, res) {
    var user = req.decoded;
    if (user) {
        if (req.params.id) {
            var id = new ObjectId(req.params.id);
            var userId = new ObjectId(user.userId);
            if (userId.equals(id)) {
                mongoose.model('User').findById(id, function (err, user) {
                    if (err) {
                        res.status(404).send({
                            success: false,
                            message: "Not found"
                        });
                    }
                    var value = 0;
                    if (req.body.value) {
                        value = parseInt(req.body.value);
                    }
                    res.json({
                        success: true
                    });
                });
            } else {
                res.status(403).send({
                    success: false,
                    message: "No permission"
                });
            }
        } else {
            res.status(403).send({
                success: false,
                message: "No permission"
            });
        }
    } else {
        res.status(403).send({
            success: false,
            message: "No permission"
        });
    }
};

exports.writeOff = function (req, res) {
    var user = req.decoded;
    if (user) {
        if (user.role === 5) {
            if (req.params.id) {
                var id = new ObjectId(req.params.id);
                mongoose.model('User').findById(id, function (err, user) {
                    if (err) {
                        res.status(404).send({
                            success: false,
                            message: "Not found"
                        });
                    }
                    var value = 0;
                    if (req.body.value) {
                        value = parseInt(req.body.value);
                    }
                    user.balance -= value;
                    user.save(function (err, result) {
                        if (err) {
                            res.json({
                                success: false,
                                message: "Error save user"
                            });
                        }
                        res.json({
                            success: true
                        });
                    });
                });
            } else {
                res.status(403).send({
                    success: false,
                    message: "No permission"
                });
            }
        } else {
            res.status(403).send({
                success: false,
                message: "No permission"
            });
        }
    } else {
        res.status(403).send({
            success: false,
            message: "No permission"
        });
    }
};

exports.buyPremium = function (req, res) {
    var curUser = req.decoded;
    if (curUser) {
        var userId = new ObjectId(curUser.userId);
        if (curUser.role === 1) {
            mongoose.model('User').findById(userId, function (err, user) {
                if (err) {
                    res.status(404).send({
                        success: false,
                        message: "Not found"
                    });
                }
                if (config.premiumAvailable) {
                    if (user.balance >= config.premiumCost) {
                        user.balance -= config.premiumCost;
                        user.save(function (err, result) {
                            if (err) {
                                res.json({
                                    success: false,
                                    message: "Error save user"
                                });
                            }
                            res.json({
                                success: true
                            });
                        });
                    } else {
                        res.status(403).send({
                            success: false,
                            message: "No money"
                        });
                    }
                } else {
                    res.status(403).send({
                        success: false,
                        message: "No permission"
                    });
                }
            });
        } else {
            res.status(403).send({
                success: false,
                message: "No permission"
            });
        }
    } else {
        res.status(403).send({
            success: false,
            message: "No permission"
        });
    }
};