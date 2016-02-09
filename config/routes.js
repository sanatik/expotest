/**
 * Created by bosone on 2/3/16.
 */
var index = require('../routes/index');
var expositions = require('../routes/exposition');
var auths = require('../routes/auth');

module.exports = function (app) {
    app.use('/', index);
    app.use('/exposition', expositions);
};

