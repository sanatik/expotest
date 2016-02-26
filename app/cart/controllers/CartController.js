/**
 * Created by Serikuly_S on 26.02.2016.
 */
var mongoose = require('mongoose');
var config = require('../../../config/config');

var ObjectId = mongoose.Types.ObjectId;

exports.getAll = function (req, res) {
    var currentUser = req.decoded;
    if (!currentUser) {
        res.status(403).send({
            success: false,
            message: 'No access to this action'
        });
    }
    mongoose.model('User').findById(currentUser.userId, function (err, user) {
        if (err) {
            res.status(403).send({
                success: false,
                message: 'Failed to access'
            });
        }
        res.json(user.cart);
    });
};

exports.add = function (req, res) {
    var currentUser = req.decoded;
    if (currentUser && currentUser.role !== 2) {
        res.status(403).send({
            success: false,
            message: 'No access to this action'
        });
    }
    mongoose.model('User').findById(currentUser.userId, function (err, user) {
        if (err) {
            res.status(403).send({
                success: false,
                message: 'Failed to access'
            });
        }
        if (user.lock === true) {
            res.status(403).send({
                success: false,
                message: 'Cannot add cart item'
            });
        }
        var expId = req.body.expositionId;
        mongoose.model('Exposition').findById(expId, function (err, exposition) {
            if (err) {
                res.status(404).send({
                    success: false,
                    message: 'Exposition not found'
                });
            }
            var offerId = req.body.offerId;
            mongoose.model('Offer').findById(offerId, function (err, offer) {
                if (err) {
                    res.status(404).send({
                        success: false,
                        message: 'Offer not found'
                    });
                }

                var cartItem = {};
                cartItem.offer = offer;
                cartItem.exposition = exposition;
                cartItem.state = 1; //Unpaid

                var cart = user.cart;
                if (!cart) {
                    cart = [];
                }
                cart.push(cartItem);

                user.cart = cart;

                user.save(function (err, result) {
                    if (err) {
                        res.status(500).send({
                            success: false,
                            message: "Error while adding to card"
                        });
                    }
                    res.json({
                        success: true
                    });
                })
            });
        });
    });
};

exports.remove = function (req, res) {
    var currentUser = req.decoded;
    if (!currentUser) {
        res.status(403).send({
            success: false,
            message: 'No access to this action'
        });
    }
    var cartId = new ObjectId(req.params.id);
    mongoose.model('User').update({_id: currentUser.userId}, {$pull: {cart: {_id: cartId}}}, {safe: true}, function (err, result) {
        if (err) {
            res.status(500).send({
                success: false,
                message: "Error"
            });
        }
        res.json({
            success: true
        })
    });
};

exports.pay = function (req, res) {
    var currentUser = req.decoded;
    if (!currentUser) {
        res.status(403).send({
            success: false,
            message: 'No access to this action'
        });
    }
    var cartId = new ObjectId(req.params.id);
    var expId = new ObjectId(req.params.expositionId);
    mongoose.model('User').findById(currentUser.userId, function (err, user) {
        if (err) {
            res.status(404).send({
                success: false,
                message: 'Not found'
            });
        }
        mongoose.model('Exposition').findById(expId, function (err, exposition) {
            if (err) {
                res.status(404).send({
                    success: false,
                    message: 'Not found exp'
                });
            }
            var cart = user.cart;
            if (cart) {
                var stateChanged = false;
                for (var cartItem in cart) {
                    if (cartItem._id === cartId) {
                        cartItem.state = 2;//Paid
                        if (!cartItem.history) {
                            cartItem.history = [];
                        }
                        var history = {};
                        history.state = 1;
                        history.modifier = user._id;
                        cartItem.history.push(history);
                        stateChanged = true;
                        break;
                    }
                }
                if (stateChanged) {
                    var price = exposition.price;
                }
            }
        });
    });
};