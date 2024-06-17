const express = require('express');
const router = express.Router();
const multer = require('multer');
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

router.get('/balances', verifyToken, verifyAdmin, userController.getAllUsersWithBalances);
router.post('/withdraw', verifyToken, verifyAdmin, userController.withdrawBalance);
router.get('/', verifyToken, verifyAdmin, userController.getAllUsers);
router.get('/recent-activities', verifyToken, verifyAdmin, userController.getRecentActivities);
router.get('/top-users', verifyToken, verifyAdmin, userController.getTopUsers);
router.get('/top-gears', verifyToken, verifyAdmin, userController.getTopGears);
router.get('/:id', verifyToken, userController.getUserById);
router.get('/email/:email', userController.getUserByEmail);
router.post('/', upload.single('license'), userController.createUser);
router.delete('/:id', verifyToken, verifyAdmin, userController.deleteUser);
router.get('/admin/:email', verifyToken, userController.getAdmin);
router.patch('/admin/:id', verifyToken, verifyAdmin, userController.makeAdmin);
router.patch('/approve/:id', verifyToken, verifyAdmin, userController.approveUser);
router.patch('/disapprove/:id', verifyToken, verifyAdmin, userController.disapproveUser);
router.put('/:id', verifyToken, userController.updateUserProfile);
router.get('/Tbalance/:email', verifyToken, userController.getUserBalance);
router.get('/balance/history/:email', verifyToken, userController.getUserBalanceHistory);


//router.get('/:userId', verifyToken, userController.getUserById);

module.exports = router;
