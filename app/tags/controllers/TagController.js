/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var mongoose = require('mongoose');
var Tag = require('../models/TagModel');
var config = require('../../../config/config');
var ObjectId = mongoose.Types.ObjectId;
exports.create = function (req, res) {
    var currentUser = req.decoded;
    var tags = config.tags;
    mongoose.model('Tag').insertMany(tags, function (err, tags) {
        if (err) {
            res.json({
                success: false,
                message: err
            });
        }
        res.json({
            success: true,
            message: null
        });
    });
};
exports.getAll = function (req, res) {
    mongoose.model('Tag').find({}, function (err, results) {
        if (err) {
            res.send(err);
        }
        res.json(results);
    });
};


