/**
 * Created by bosone on 2/3/16.
 */
var index = require('../routes/index');
var passport = require('passport');
var expositions = require('../routes/exposition');
var api = require('../routes/api');
var cart = require('../routes/cart');
var offer = require('../routes/offer');
var user = require('../routes/user');
var tag = require('../routes/tag');
var auths = require('../routes/auth')(passport);
module.exports = function (app) {
    app.use('/', index);
    app.use('/exposition', expositions);
    app.use('/auth', auths);
    app.use('/api', api);
    app.use('/cart', cart);
    app.use('/offer', offer);
    app.use('/user', user);
    app.use('/tags', tag);
};

