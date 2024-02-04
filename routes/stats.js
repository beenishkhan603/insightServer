var express = require('express');
var router = express.Router();
const statsController = require('../controllers/stats');
const authenticateUser = require('../utils/authMiddleware');

router.get('/monthly', authenticateUser, statsController.getMonthlyStats);
router.get('/overall', authenticateUser, statsController.getStats);
router.get('/yearly', authenticateUser, statsController.getYearlyStats);

module.exports = router;
