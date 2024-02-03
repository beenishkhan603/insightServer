var express = require('express');
var router = express.Router();
const productController = require('../controllers/product');
const authenticateUser = require('../utils/authMiddleware');
const uploadProductImage = require('../utils/fileMiddelware');

router.post(
	'/',
	authenticateUser,
	uploadProductImage,
	productController.createProduct
);
router.get('/', authenticateUser, productController.fetchProducts);
router.get('/:id', authenticateUser, productController.fetchProduct);
router.patch('/', authenticateUser, productController.updateProduct);
router.delete('/:id', authenticateUser, productController.removeProduct);

module.exports = router;
