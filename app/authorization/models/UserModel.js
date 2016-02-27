/**
 * Created by Serikuly_S on 09.02.2016.
 */

var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    id: mongoose.Schema.ObjectId,
    added: {
        type: Date,
        default: Date.now()
    },
    displayName: String,
    login: String,
    email: String,
    phone: String,
    password: String,
    salt: String,
    role: Number,
    hasPremium: Boolean,
    avatar: Buffer,
    description: String,
    additional: [{
        name: String,
        data: String
    }],
    cart: [{
        orderNumber: mongoose.Schema.ObjectId,
        exposition: Object,
        offer: Object,
        state: Number,//1 - Unpaid, 2 - Paid, 3 - Approved, 4 - CancelledByExponent, 5 - CancelledByOrganizer, 6  - CancelledByModerator, 7 - CancelledByAdmin
        history: [{
            date: {
                type: Date,
                default: Date.now()
            },
            state: Number,
            modifier: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        }]
    }],
    balance: {
        type: Number,
        default: 0
    },
    topUps: [{
        orderNumber: String,
        sum: Number,
        added: Date,
        paid: Date
    }],
    lock: Boolean
});
mongoose.model('User', UserSchema);