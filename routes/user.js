var express = require('express');
var router = express.Router();
var userController = require('../controllers/user');

router.post('/signup', userController.createUser);
router.post('/login', userController.login);
module.exports = router;
