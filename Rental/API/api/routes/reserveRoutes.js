const express = require('express')
const router = express.Router();

const reserveController = require('../controllers/reserveController')
const verifyToken = require('../middleware/verifyToken')

router.get('/',verifyToken, reserveController.getReserveByEmail);
router.post('/', reserveController.addToReserve);
router.delete('/:id', reserveController.deleteReserve)
router.put('/:id', reserveController.updateReserve)
router.get('/:id', reserveController.getSingleReserve)
module.exports = router;