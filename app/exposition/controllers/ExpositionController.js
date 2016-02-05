/**
 * Created by bosone on 2/3/16.
 */
var mongoose = require('mongoose');
var Exposition = require('../models/ExpositionModel');
var Offer = require('../models/OfferModel');

var ObjectId = mongoose.Types.ObjectId;

exports.create = function (req, res) {
    var exposition = new Exposition(req.body);
    exposition.creator = 1;
    exposition.testFlightRequest = true;

    exposition.save(function (err, result) {
        if (err) {
            res.send(err);
        }
        res.json(result);
    });
};

exports.getAll = function (req, res) {
    Exposition.find({}, function (err, results) {
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
        Exposition.findById(id, function (err, exposition) {
            if (err) {
                res.send(err);
            }
            res.json(exposition);
        })
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
            if (req.body.offer) {
                console.log(req.body.offer);
                var offer = new Offer(req.body.offer);
                exposition.offers.push(offer);
            } else {
                exposition.displayName = req.body.displayName;
            }
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

