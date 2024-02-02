// seeder.js
const db = require('./dbConfig');
const Product = require('../model/product');

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
	console.log('Connected to MongoDB');

	seedProducts();
});

async function seedProducts() {
	try {
		// Check if products already exist
		const existingProducts = await Product.find();
		if (existingProducts.length > 0) {
			console.log('Products already seeded.');
			return;
		}
		// Seed products
		const products = [
			{
				name: 'Product 1',
				description: 'Description for Product 1',
				image: 'product1.jpg',
				category: 'Category 1',
				price: 19.99,
				manufacturer: 'Manufacturer A',
				stockQuantity: 100,
			},
			{
				name: 'Product 2',
				description: 'Description for Product 2',
				image: 'product2.jpg',
				category: 'Category 2',
				price: 29.99,
				manufacturer: 'Manufacturer B',
				stockQuantity: 50,
			},
		];

		await Product.insertMany(products);
		console.log('Products seeded successfully.');
	} catch (error) {
		console.error('Error seeding products:', error);
	} finally {
		// Close the database connection after seeding
		db.close();
	}
}
