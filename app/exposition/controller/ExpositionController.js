/**
 * Created by bosone on 2/3/16.
 */
var mongoose = require('mongoose');
var Exposition = require('../models/ExpositionModel');

var ObjectId = mongoose.Types.ObjectId;

exports.create = function(req,res){
    var exposition = new Exposition(req.body);
    exposition.save(function(err,result){
        if(err){
            res.send(err);
        }
        res.json(result);
    });
};

exports.getAll = function(req,res){
    Exposition.find({},function(err,results){
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
        Exposition.findById(id,function(err,exposition){
            if(err){
                res.send(err);
            }
            res.json(exposition);
        })
    }catch(e){
        res.send(404);
    }
};

exports.update = function(req,res){
    var id = req.params.id;
    try{
        id = new ObjectId(id);
        Exposition.findById(id,function(err,exposition){
            if(err){
                res.send(err);
            }
            exposition.name = req.body.name;
            exposition.save(function(err){
                if(err)
                    res.send(err);
                res.json({message: "Exposition Updated successfully."});
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
        Exposition.remove({_id : id},function(err,result){
            if(err){
                res.send(err);
            }
            res.json(result);
        });
    }catch(e){
        res.send(404);
    }
};

