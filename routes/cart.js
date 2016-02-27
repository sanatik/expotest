/**
 * Created by Serikuly_S on 26.02.2016.
 */
var express = require('express');
var router = express.Router();
var cartController = require('../app/cart/controllers/CartController');

router.post('/add', cartController.add);
router.delete('/:id', cartController.remove);
router.get('/', cartController.getAll);
router.get('/approveList', cartController.approveList);
router.post('/pay/:id', cartController.pay);
router.post('/cancel/:id', cartController.cancel);
router.post('/approve/:id', cartController.approve);
module.exports = router;
