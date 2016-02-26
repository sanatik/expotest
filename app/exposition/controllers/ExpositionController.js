/**
 * Created by bosone on 2/3/16.
 */
var mongoose = require('mongoose');
var Exposition = require('../models/ExpositionModel');

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
    console.log(req.user);
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

