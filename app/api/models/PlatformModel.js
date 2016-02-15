/**
 * Created by bosone on 2/16/16.
 */
var mongoose = require('mongoose');

var PlatformSchema = mongoose.Schema({
    id: mongoose.Schema.ObjectId,
    added: {
        type: Date,
        default: Date.now()
    },
    name: String,
    url: String,
    cart: [{
        exposition: {
            id: mongoose.Schema.ObjectId
        },
        state: Number, //1 - Moderation, 2 - In place, 3 - Added
        history: [{
            date: {
                type: Date,
                default: Date.now()
            },
            state: Number
        }]
    }]
});
module.exports = mongoose.model('Platform', PlatformSchema);