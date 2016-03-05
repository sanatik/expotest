/**
 * Created by bosone on 2/28/16.
 */
var express = require('express');
var router = express.Router();
var userController = require('../app/authorization/controllers/UserController');

router.get('/:id', userController.getById);
router.post('/edit/:id', userController.edit);
router.post('/lock/:id', userController.lock);
router.post('/buyPremium', userController.buyPremium);
router.get('/', userController.getAll);
module.exports = router;