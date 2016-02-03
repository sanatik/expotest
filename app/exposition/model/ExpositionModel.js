/**
 * Created by bosone on 2/3/16.
 */
var mongoose = require('mongoose');

var ExpositionSchema = mongoose.Schema({
    id: mongoose.Schema.ObjectId,
    added: {
        type: Date,
        default: Date.now()
    },
    version: Number,
    displayName: String,
    creator: Number,
    price: Number,
    photo: String,
    startDate: Date,
    endDate: Date,
    presentation: Buffer,
    description: String,
    additional: {
        name: String,
        data: String
    },
    offers: [{
        date: Date,
        offer: Object,
        linkedBy: Number,
    }],
    audience: [{
        firstName: String,
        lastName: String,
        position: String,
        company: String,
        phone: String,
        city: String,
        email: String,
        feedback: [{
            offerId: Number,
            key: String,
            answer: Boolean
        }]
    }],
    expectedAudience: Number,
    minFeedBack: Number,
    testFlightRequest: Boolean,
    audienceCheckTarget: Number,
    audienceCheckResult: Boolean
});
module.exports = mongoose.model('Exposition', ExpositionSchema);