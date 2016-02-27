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
                res.json({
                    success: false,
                    message: 'Not found exposition'
                });
            }
            var offerId = req.body.offerId;
            mongoose.model('Offer').findById(offerId, function (err, offer) {
                if (err) {
                    res.json({
                        success: false,
                        message: 'Not found Offer'
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

exports.approveList = function (req, res) {
    var currentUser = req.decoded;
    if (!currentUser) {
        res.status(403).send({
            success: false,
            message: 'No access to this action'
        });
    }
    var userId = new ObjectId(currentUser.userId);
    mongoose.model('User').find({}, function (err, users) {
        if (err) {
            res.status(404).send({
                success: false,
                message: 'Not found'
            });
        }
        users = JSON.parse(JSON.stringify(users));
        var result = [];
        if (users) {
            for (var i = 0; i < users.length; i++) {
                var user = users[i];
                var cart = JSON.parse(JSON.stringify(user.cart));
                if (cart) {
                    for (var j = 0; j < cart.length; j++) {
                        var item = cart[j];
                        if (userId.equals(item.exposition.creator) && item.state === 2) {
                            result.push({
                                item: item
                            });
                        }
                    }
                }
            }
        }
        res.json(result);
    });
};

exports.approve = function (req, res) {
    var currentUser = req.decoded;
    if (!currentUser) {
        res.status(403).send({
            success: false,
            message: 'No access to this action'
        });
        return;
    }

    var cartId = new ObjectId(req.params.id);
    mongoose.model('User').findOne({
        'cart._id': cartId
    }, function (err, user) {
        if (err) {
            res.status(404).send({
                success: false,
                message: 'Not found'
            });
            return;
        }
        var cart = JSON.parse(JSON.stringify(user.cart));
        if (cart) {
            for (var j = 0; j < cart.length; j++) {
                if (cartId.equals(cart[j]._id)) {
                    if (cart[j].state === 2) {
                        cart[j].state = 3;
                        user.cart = cart;
                        user.save(function (err, result) {
                            if(!err){
                                res.json({
                                    success: true
                                });
                            }else{
                                res.json({
                                    success: false,
                                    message: "Cannot save user"
                                });
                            }
                        });
                    } else {
                        res.json({
                            success: false,
                            message: "Cart item has wrong state"
                        });
                    }
                }
            }
        } else {
            res.json({
                success: false,
                message: "Not found cart item"
            });
        }
    });

}

exports.cancel = function (req, res) {
    var currentUser = req.decoded;
    if (!currentUser) {
        res.status(403).send({
            success: false,
            message: 'No access to this action'
        });
        return;
    }
    var status = -1;
    var hasAccess = false;
    if (currentUser.role === 2) {
        status = 4;//cancelledByExponent
    } else if (currentUser.role === 1) {
        status = 5;//cancelledByOrganizer
    } else if (currentUser.role === 4) {
        status = 6;//cancelledByModerator
        hasAccess = true;
    } else if (currentUser.role === 5) {
        status = 7;//cancelledByAdmin
        hasAccess = true;
    }
    var userId = new ObjectId(currentUser.userId);
    var cartId = new ObjectId(req.params.id);
    mongoose.model('User').findOne({
        'cart._id': cartId
    }, function (err, user) {
        if (err) {
            res.status(404).send({
                success: false,
                message: 'Not found'
            });
            return;
        }
        if (user.lock) {//Только админ может отменить предложение заблокированного пользователя
            if (currentUser.role !== 5) {
                res.status(403).send({
                    success: false,
                    message: 'No permission. User is locked'
                });
                return;
            }
        }
        var cart = JSON.parse(JSON.stringify(user.cart));
        if (cart) {
            for (var j = 0; j < cart.length; j++) {
                var item = cart[j];
                if (cartId.equals(item._id)) {

                    if (status === 4) {
                        if (userId.equals(item.offer.creator)) {
                            hasAccess = true;
                        }
                    }
                    if (status === 5) {
                        if (userId.equals(item.exposition.creator)) {
                            hasAccess = true;
                        }
                    }
                    if (hasAccess) {
                        if (item.state === 2 || item.state === 3) {
                            mongoose.model('User').findById(item.exposition.creator, function (err, expositionOwner) {
                                if (!err) {
                                    var balance = setUserBalance(user.balance, item.exposition.price, 'plus');
                                    if (balance) {
                                        user.balance = balance;
                                        var ownerBalance = setUserBalance(expositionOwner.balance, item.exposition.price, 'minus');
                                        if (ownerBalance) {
                                            expositionOwner.balance = ownerBalance;
                                            item.state = status;
                                            cart[j] = item;
                                            user.cart = cart;
                                            user.save(function (err, u) {
                                                if (!err) {
                                                    expositionOwner.save(function (err, eo) {
                                                        if (!err) {
                                                            res.json({
                                                                success: true
                                                            });
                                                        } else {
                                                            res.json({
                                                                success: false,
                                                                message: "Error save owner"
                                                            });
                                                        }
                                                    });
                                                } else {
                                                    res.json({
                                                        success: false,
                                                        message: "Error save user"
                                                    });
                                                }
                                            });
                                        } else {
                                            res.json({
                                                success: false,
                                                message: "Not enough money"
                                            });
                                        }
                                    }
                                } else {
                                    res.json({
                                        success: false,
                                        message: "Error exposition owner not found"
                                    });
                                }
                            });
                        } else if (item.state === 1) {
                            item.state = status;
                            cart[j] = item;
                            user.cart = cart;
                            user.save(function (err, u) {
                                if (!err) {
                                    res.json({
                                        success: true
                                    });
                                }
                            });
                        }
                    } else {
                        res.status(403).send({
                            success: false,
                            message: "No permissions"
                        });
                    }
                    break;
                }
            }
        } else {
            res.status(404).send({
                success: false,
                message: "Not found"
            });
        }
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

    mongoose.model('User').findById(currentUser.userId, function (err, user) {
        if (!err) {
            var cartAndCartItem = setCartItemStateAndAddHistoryAndGetExpIdAndGetOffer(user, cartId);
            if (cartAndCartItem) {
                if (cartAndCartItem.cart && cartAndCartItem.cartItem) {
                    user.cart = cartAndCartItem.cart;
                    mongoose.model('Exposition').findById(cartAndCartItem.cartItem.exposition._id, function (err, exposition) {
                        if (!err) {
                            mongoose.model('User').findById(exposition.creator, function (err, expositionOwner) {
                                if (!err) {
                                    var balance = setUserBalance(user.balance, exposition.price, 'minus');
                                    if (balance) {
                                        user.balance = balance;
                                        var ownerBalance = setUserBalance(expositionOwner.balance, exposition.price, 'plus');
                                        if (ownerBalance) {
                                            expositionOwner.balance = ownerBalance;
                                            exposition = pushOfferToExposition(exposition, cartAndCartItem.cartItem.offer);

                                            user.save(function (err, u) {
                                                if (!err) {
                                                    expositionOwner.save(function (err, eo) {
                                                        if (!err) {
                                                            exposition.save(function (err, e) {
                                                                if (!err) {
                                                                    res.json({
                                                                        success: true
                                                                    });
                                                                } else {
                                                                    res.json({
                                                                        success: false,
                                                                        message: "Error save exposition"
                                                                    });
                                                                }
                                                            });
                                                        } else {
                                                            res.json({
                                                                success: false,
                                                                message: "Error save owner"
                                                            });
                                                        }
                                                    });
                                                } else {
                                                    res.json({
                                                        success: false,
                                                        message: "Error save user"
                                                    });
                                                }
                                            });
                                        } else {
                                            res.json({
                                                success: false,
                                                message: "Error increasing owner balance"
                                            });
                                        }
                                    } else {
                                        res.json({
                                            success: false,
                                            message: "Not enough money"
                                        });
                                    }
                                } else {
                                    res.json({
                                        success: false,
                                        message: "Error exposition owner not found"
                                    });
                                }
                            });
                        } else {
                            res.json({
                                success: false,
                                message: "Error exposition not found"
                            });
                        }
                    });
                } else {
                    res.json({
                        success: false,
                        message: "Error cart item not found"
                    });
                }
            } else {
                res.json({
                    success: false,
                    message: "Error cart item not found"
                });
            }
        } else {
            res.json({
                success: false,
                message: "Error user not found"
            });
        }
    });
};

function setCartItemStateAndAddHistoryAndGetExpIdAndGetOffer(user, cartId) {
    var cart = user.cart;
    var result = {
        cart: false,
        cartItem: false
    };
    for (var i = 0; i < cart.length; i++) {
        var cartItem = JSON.parse(JSON.stringify(cart[i]));
        if (cartId.equals(cartItem._id)) {
            if (cartItem) {
                cartItem.state = 2;//Paid
                if (!cartItem.history) {
                    cartItem.history = [];
                }
                var history = {};
                history.state = 1;
                history.modifier = user._id;
                cartItem.history.push(history);
                cart[i] = cartItem;
                result.cart = cart;
                result.cartItem = cartItem;
            }
        }
    }
    return result;
}

function setUserBalance(balance, price, operation) {
    if (!balance) {
        balance = 0;
    }
    if (operation === 'plus') {
        balance += price;
    } else if (operation === 'minus') {
        if (balance >= price) {
            balance -= price;
        } else {
            return false;
        }
    }
    return balance;
}

function pushOfferToExposition(exposition, offer) {
    if (!exposition.offers) {
        exposition.offers = [];
    }
    exposition.offers.push(offer);
    return exposition;
}