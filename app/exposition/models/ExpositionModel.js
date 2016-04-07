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
    format: Number,
    formatString: String,
    displayName: String,
    location: Object,
    website: String,
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    creatorInfo: Object,
    price: Number,
    photo: {
        ext: String,
        contentBase64: Buffer,
        contentString: String
    },
    startDate: Date,
    endDate: Date,
    presentation: {
        ext: String,
        contentBase64: Buffer,
        contentString: String
    },
    description: String,
    additional: {
        name: String,
        data: String
    },
    offers: [],
    audience: [{
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            name: String,
            position: String,
            company: String,
            phone: String,
            city: Object,
            email: String,
            feedback: [{
                    offerId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'Offer'
                    },
                    key: String,
                    answer: Boolean
                }]
        }],
    expectedAudience: Number,
    participantsNumber: Number,
    minFeedBack: Number,
    testFlightRequest: Boolean,
    audienceCheckTarget: Number,
    audienceCheckResult: Boolean,
    themes: [
    ],
    aboutAuditory: String
});
module.exports = mongoose.model('Exposition', ExpositionSchema);