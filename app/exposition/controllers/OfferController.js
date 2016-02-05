/**
 * Created by Serikuly_S on 05.02.2016.
 */
var mongoose = require('mongoose');
var Offer = require('../models/OfferModel');

var ObjectId = mongoose.Types.ObjectId;

exports.create = function(req,res){
    var offer = new Offer(req.body);
    offer.creator = 1;
    offer.testFlightRequest = true;

    offer.save(function(err,result){
        if(err){
            res.send(err);
        }
        res.json(result);
    });
};

exports.getAll = function(req,res){
    Offer.find({},function(err,results){
        if(err){
            res.send(err);
        }
        res.json(results);
    });
};

exports.get = function(req,res){
    var id = req.params.id;
    try{
        id = new ObjectId(id);
        Offer.findById(id,function(err,offer){
            if(err){
                res.send(err);
            }
            res.json(offer);
        })
    }catch(e){
        res.send(404);
    }
};

exports.update = function(req,res){
    var id = req.params.id;
    try{
        id = new ObjectId(id);
        Offer.findById(id,function(err,offer){
            if(err){
                res.send(err);
            }
            offer.displayName = req.body.displayName;
            offer.save(function(err){
                if(err)
                    res.send(err);
                res.json({message: "Ok"});
            });
        });
    }catch(e){
        res.send(404);
    }
};

exports.delete = function(req,res){
    var id = req.params.id;
    try{
        id = new ObjectId(id);
        Offer.remove({_id : id},function(err,result){
            if(err){
                res.send(err);
            }
            res.json(result);
        });
    }catch(e){
        res.send(404);
    }
};