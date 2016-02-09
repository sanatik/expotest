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
    avatar: String,
    description: String,
    additional: {
        name: String,
        data: String
    },
    cart: [{
        exposition: Object,
        offer: Object,
        state: Number,
        history: [{
            date: Date,
            state: Number,
            modifier: Number
        }]
    }],
    balance: Number,
    topUps: [{
        orderNumber: String,
        sum: Number,
        added: Date,
        paid: Date
    }],
    lock: Boolean
});
mongoose.model('User', UserSchema);