var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config/config');
var mongoose = require("mongoose");
var jwt = require('jsonwebtoken');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client/src')));
app.use('/vendor', express.static(path.join(__dirname, 'client/vendor')));
app.use('/app', express.static(path.join(__dirname, 'client/src/app')));
app.use('/common', express.static(path.join(__dirname, 'client/src/common')));
app.use('/assets', express.static(path.join(__dirname, 'client/src/assets')));
app.use('/img', express.static(path.join(__dirname, 'client/img')));

var passport = require('passport');
var expressSession = require('express-session');

var flash = require('connect-flash');
app.use(flash());

var initPassport = require('./config/passport/init');
initPassport(passport);

app.use(expressSession({secret: 'mySecretKey', resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

var connect = function () {
    var options = {
        server: {
            socketOptions: {
                keepAlive: 1
            }
        }
    };
    mongoose.connect('mongodb://expotest:expotest@ds059155.mongolab.com:59155/expotest', options);
    console.log('connected');
};
connect();
mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);
app.use(function (req, res, next) {
    console.log(1231231231231);
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, config.privateKey, function (err, decoded) {
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
        var hasAccess = false;
        var roles = config.roles;
        for (url in roles.anonymous) {
            console.log(roles.anonymous[url] + ' ' + req.url);
            if (roles.anonymous[url] === req.url) {
                hasAccess = true;
            }
        }
        if (!hasAccess) {
            res.status(403).send({
                success: false,
                message: 'No token provided.'
            });
        } else {
            next();
        }
    }
})
require('./config/routes')(app);
require('./routes/auth')(passport);
require('./config/express')(app);

module.exports = app;
