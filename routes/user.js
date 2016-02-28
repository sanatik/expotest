/**
 * Created by bosone on 2/28/16.
 */
var express = require('express');
var router = express.Router();
var userController = require('../app/authorization/controllers/UserController');

router.get('/:id',userController.getById);
module.exports = router;