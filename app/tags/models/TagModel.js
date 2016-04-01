/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var mongoose = require('mongoose');

var TagSchema = mongoose.Schema({
    id: mongoose.Schema.ObjectId,
    added: {
        type: Date,
        default: Date.now()
    },
    name: {
        type: String,
        unique: true
    },
    type: Number,
    tags: [{
            type: String,
            unique: true
        }]
});

module.exports = mongoose.model('Tag', TagSchema);
