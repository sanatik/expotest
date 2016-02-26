/**
 * Created by Serikuly_S on 26.02.2016.
 */
var mongoose = require('mongoose');
var Offer = require('../models/OfferModel');

var ObjectId = mongoose.Types.ObjectId;

exports.create = function (req, res) {
    var currentUser = req.decoded;
    var offer = new Offer();
    offer.name = req.body.name;
    offer.creator = currentUser.userId;
    offer.exposition = req.body.expositionId;
    if(req.body.photo.content){
        offer.photo = {};
        offer.photo.content = new Buffer(req.body.photo.content, 'base64');
        offer.photo.ext = req.body.photo.type;
    }
    offer.description = req.body.description;

    offer.save(function (err, result) {
        if (err) {
            res.send(err);
        }
        res.json(result);
    });
};

exports.getAll = function (req, res) {
    var currentUser = req.decoded;
    Offer.find({creator: currentUser.userId}, function (err, results) {
        if (err) {
            res.send(err);
        }
        res.json(results);
    });
};

exports.get = function (req, res) {
    var id = req.params.id;
    try {
        id = new ObjectId(id);
        Offer.findById(id, function (err, offer) {
            if (err) {
                res.send(err);
            }
            if (offer.photo.content) {
                var photo = offer.photo.content.toString('base64');
                offer.photo.contentString = photo;
            }
            res.json(offer);
        });
    } catch (e) {
        res.send(404);
    }
};

exports.update = function (req, res) {
    var id = req.params.id;
    try {
        id = new ObjectId(id);
        Offer.findById(id, function (err, offer) {
            if (err) {
                res.send(err);
            }
            if (req.body.name) {
                offer.name = req.body.name;
            }
            if(req.body.photo.content){
                offer.photo = {};
                offer.photo.content = new Buffer(req.body.photo.content, 'base64');
                offer.photo.ext = req.body.photo.type;
            }
            if(req.body.description){
                offer.description = req.body.description;
            }
            if(req.body.additional){
                offer.additional = req.body.additional;
            }
            offer.save(function (err) {
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
        Offer.remove({_id: id}, function (err, result) {
            if (err) {
                res.send(err);
            }
            res.json(result);
        });
    } catch (e) {
        res.send(404);
    }
};