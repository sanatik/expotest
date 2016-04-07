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
    displayName: {
        type: String,
        required: true
    },
    login: String,
    email: String,
    phone: String,
    password: {
        type: String,
        required: true
    },
    salt: String,
    role: {
        type: String,
        required: true
    },
    position: String,
    company: String,
    city: Object,
    hasPremium: {
        type: Boolean,
        default: false
    },
    avatar: {
        ext: String,
        content: Buffer
    },
    cart: [{
            orderNumber: mongoose.Schema.ObjectId,
            exposition: Object,
            offer: Object,
            state: Number, //1 - Unpaid, 2 - Paid, 3 - Approved, 4 - CancelledByExponent, 5 - CancelledByOrganizer, 6  - CancelledByModerator, 7 - CancelledByAdmin
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
    lock: {
        type: Boolean,
        default: false
    }
});
mongoose.model('User', UserSchema);