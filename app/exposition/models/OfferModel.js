/**
 * Created by Serikuly_S on 01.02.2016.
 */
var mongoose = require('mongoose');

var OfferSchema = mongoose.Schema({
    id: mongoose.Schema.ObjectId,
    added: {
        type: Date,
        default: Date.now()
    },
    name: String,
    creator: Number,
    //creator: {
    //    type: mongoose.Schema.Types.ObjectId,
    //    ref: 'User'
    //},
    photo: String,
    description: String,
    additional: {
        name: String,
        data: String
    }
});
module.exports = mongoose.model('Offer', OfferSchema);