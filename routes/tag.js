/**
 * Created by Serikuly_S on 05.02.2016.
 */
var express = require('express');
var router = express.Router();
var tagController = require('../app/tags/controllers/TagController');

router.get('/create',tagController.create);
router.get('/',tagController.getAll);
module.exports = router;
