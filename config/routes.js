/**
 * Created by bosone on 2/3/16.
 */
var index = require('../routes/index');
var passport = require('passport');
var expositions = require('../routes/exposition');
var api = require('../routes/api');
var auths = require('../routes/auth')(passport);
var jwt = require('jsonwebtoken');

module.exports = function (app) {
    app.use('/', index);
    app.use('/exposition', expositions);
    app.use('/auth', auths);
    app.use('/api', api);
    app.use(function (req, res, next) {
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        if (token) {
            jwt.verify(token, superSecret, function (err, decoded) {
                if (err) {
                    res.status(403).send({
                        success: false,
                        message: 'Failed to authenticate token.'
                    });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            res.status(403).send({
                success: false,
                message: 'No token provided.'
            });

        }
    })
};

