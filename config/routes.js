/**
 * Created by bosone on 2/3/16.
 */
var index = require('../routes/index');
var expositions = require('../routes/exposition');
module.exports = function (app) {
    app.use('/', index);
    app.use('/exposition', expositions);
}
