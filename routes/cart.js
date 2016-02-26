/**
 * Created by Serikuly_S on 26.02.2016.
 */
var express = require('express');
var router = express.Router();
var cartController = require('../app/cart/controllers/CartController');

router.post('/add',cartController.add);
router.delete('/:id',cartController.remove);
router.get('/',cartController.getAll);
module.exports = router;
