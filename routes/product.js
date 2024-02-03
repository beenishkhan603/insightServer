var express = require('express');
var router = express.Router();
var productController = require('../controllers/product');

router.post('/', productController.createProduct);
router.get('/', productController.fetchProducts);
router.get('/:id', productController.fetchProduct);
router.patch('/', productController.updateProduct);
router.delete('/:id', productController.removeProduct);

module.exports = router;
