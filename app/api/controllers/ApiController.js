/**
 * Created by bosone on 2/16/16.
 */
var mongoose = require('mongoose');
var Platform = require('../models/PlatformModel');

var ObjectId = mongoose.Types.ObjectId;

exports.createOrUpdate = function (req, res) {
    var platforms = req.body;
    for (var i = 0; i < platforms.length; i++) {
        var platform = platforms[i];
        if (platform.name) {
            mongoose.model('Platform').findOne({name: platform.name}, function (err, p) {
                if (err) {
                    res.send(err);
                }
                if (!p) {
                    var p = new Platform(platform);
                } else {
                    p.url = platform.url;
                    var newCart = p.cart;
                    for (var j = 0; j < platform.cart.length; j++) {
                        var cart = platform.cart[j];
                        if (cart.exposition) {
                            if (cart.exposition.id) {
                                var expositionId = new ObjectId(cart.exposition.id).toString();
                                for (var k = 0; k < newCart.length; k++) {
                                    var eId = new ObjectId(newCart[k].exposition.id).toString();
                                    if (expositionId === eId) {
                                        if (newCart[k].state !== cart.state) {
                                            var history = {state: newCart[k].state};
                                            newCart[k].state = cart.state;
                                            if (!newCart[k].history) {
                                                newCart[k].history = [];
                                            }
                                            newCart[k].history.push(history);
                                            console.log(newCart);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                p.save(function (err) {
                    if (err)
                        res.send(err);
                    res.json({success: true});
                });
            });
        }
    }
};

exports.getExpositions = function (req, res) {
    mongoose.model("Exposition").find({}, function (err, results) {
        if (err) {
            res.send(err);
        }
        var ret = [];
        for(var i=0; i<results.length; i++){
            var ex = results[i];
            ret.push({id: ex._id});
        }
        res.json(ret);
    });
}