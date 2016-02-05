/**
 * Created by bosone on 2/3/16.
 */
var express = require('express');
var router = express.Router();
var expositionController = require('../app/exposition/controllers/ExpositionController');

router.post('/',expositionController.create);
router.get('/',expositionController.getAll);
router.get('/:id',expositionController.get);
router.put('/:id',expositionController.update);
router.delete('/:id',expositionController.delete);
module.exports = router;
