/**
 * Created by bosone on 2/16/16.
 */
var express = require('express');
var router = express.Router();
var apiController = require('../app/api/controllers/ApiController');

router.post('/createOrUpdate',apiController.createOrUpdate);
router.get('/expositions',apiController.getExpositions);
module.exports = router;