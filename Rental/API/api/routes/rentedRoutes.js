const express = require('express');
const router = express.Router();
const rentedController = require('../controllers/rentedController');
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');

router.get('/all', verifyToken, verifyAdmin, rentedController.getAllRentals);
router.get('/:userId', verifyToken, rentedController.getRentedByUserId);
router.get('/rented-by-owner/:email', verifyToken, rentedController.getRentedByOwnerEmail);



module.exports = router;
