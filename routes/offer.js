/**
 * Created by Serikuly_S on 05.02.2016.
 */
var express = require('express');
var router = express.Router();
var offerController = require('../app/offer/controllers/OfferController');

router.post('/',offerController.create);
router.get('/',offerController.getAll);
router.get('/:id',offerController.get);
router.put('/:id',offerController.update);
router.delete('/:id',offerController.delete);
module.exports = router;
