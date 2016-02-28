/**
 * Created by Serikuly_S on 10.02.2016.
 */
var mongoose = require('mongoose');
var config = require('../../../config/config');

var ObjectId = mongoose.Types.ObjectId;

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