const Product = require('../model/product');

// Function to create a new product
const createProduct = async (req, res) => {
	try {
		console.log(req.body);
		// Validate required fields
		const requiredFields = [
			'name',
			'description',
			'category',
			'price',
			'manufacturer',
			'stockQuantity',
		];
		const missingFields = requiredFields.filter((field) => !req.body[field]);

		if (missingFields.length > 0) {
			return res.status(400).json({
				success: false,
				message: `Fields ${missingFields.join(', ')} are required.`,
			});
		}

		const { name, description, category, price, manufacturer, stockQuantity } =
			req.body;
		if (
			typeof name !== 'string' ||
			typeof description !== 'string' ||
			typeof category !== 'string' ||
			typeof price !== 'number' ||
			typeof manufacturer !== 'string' ||
			typeof stockQuantity !== 'number'
		) {
			return res.status(400).json({
				success: false,
				message: 'Invalid data types. Check the format of the provided data.',
			});
		}
		const productData = {
			name: name,
			description: description,
			image: req.file.filename,
			category: category,
			price: price,
			manufacturer: manufacturer,
			stockQuantity: stockQuantity,
		};

		const newProduct = await Product.create(productData);

		res.status(201).json({
			success: true,
			message: 'Product created successfully',
			data: newProduct,
		});
	} catch (error) {
		console.error('Error creating product:', error);
		res.status(500).json({ success: false, message: 'Internal Server Error' });
	}
};

// Function to fetch all products
const fetchProducts = async (req, res) => {
	try {
		const products = await Product.find();
		res.status(200).json({ success: true, data: products });
	} catch (error) {
		console.error('Error fetching products:', error);
		res.status(500).json({ success: false, message: 'Internal Server Error' });
	}
};

// Function to fetch a specific product by ID
const fetchProduct = async (req, res) => {
	try {
		const productId = req.params.id;
		const product = await Product.findById(productId);

		if (!product) {
			return res
				.status(404)
				.json({ success: false, message: 'Product not found' });
		}

		res.status(200).json({ success: true, data: product });
	} catch (error) {
		console.error('Error fetching product:', error);
		res.status(500).json({ success: false, message: 'Internal Server Error' });
	}
};

// Function to update a product
const updateProduct = async (req, res) => {
	try {
		const productId = req.params.id;
		const image = req?.file;
		const { name, description, category, price, manufacturer, stockQuantity } =
			req.body;
		if (
			typeof name !== 'string' ||
			typeof description !== 'string' ||
			typeof category !== 'string' ||
			typeof price !== 'number' ||
			typeof manufacturer !== 'string' ||
			typeof stockQuantity !== 'number'
		) {
			return res.status(400).json({
				success: false,
				message: 'Invalid data types. Check the format of the provided data.',
			});
		}

		const updatedData = {
			name,
			description,
			category,
			price: price,
			manufacturer,
			stockQuantity: stockQuantity,
		};
		// Check if a new image is provided
		if (image) {
			updatedData.image = image;
		}
		const updatedProduct = await Product.findByIdAndUpdate(
			productId,
			updatedData,
			{ new: true }
		);
		if (!updatedProduct) {
			return res
				.status(404)
				.json({ success: false, message: 'Product not found' });
		}

		res.status(200).json({
			success: true,
			message: 'Product updated successfully',
			data: updatedProduct,
		});
	} catch (error) {
		console.error('Error updating product:', error);
		res.status(500).json({ success: false, message: 'Internal Server Error' });
	}
};

// Function to remove a product by ID
const removeProduct = async (req, res) => {
	try {
		const productId = req.params.id;
		const deletedProduct = await Product.findByIdAndDelete(productId);

		if (!deletedProduct) {
			return res
				.status(404)
				.json({ success: false, message: 'Product not found' });
		}

		res.status(200).json({
			success: true,
			message: 'Product deleted successfully',
			data: deletedProduct,
		});
	} catch (error) {
		console.error('Error deleting product:', error);
		res.status(500).json({ success: false, message: 'Internal Server Error' });
	}
};

module.exports = {
	createProduct,
	fetchProducts,
	fetchProduct,
	updateProduct,
	removeProduct,
};
