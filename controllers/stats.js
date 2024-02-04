const User = require('../model/user');
const Product = require('../model/product');

const getMonthlyStats = async (req, res) => {
	try {
		const userStats = await User.aggregate([
			{
				$group: {
					_id: {
						$dateToString: { format: '%Y-%m', date: '$createdAt' },
					},
					newUserCount: { $sum: 1 },
				},
			},
		]);
		const productStats = await Product.aggregate([
			{
				$group: {
					_id: {
						$dateToString: { format: '%Y-%m', date: '$createdAt' },
					},
					newProductCount: { $sum: 1 },
				},
			},
		]);

		return res.status(200).json({
			success: true,
			message: 'Monthly statistics fetched successfully',
			data: { userStats, productStats },
		});
	} catch (error) {
		console.error('Error fetching monthly statistics:', error);
		return res
			.status(500)
			.json({ success: false, message: 'Internal Server Error' });
	}
};
const getStats = async (req, res) => {
	try {
		const totalUsers = await User.countDocuments();
		const totalProducts = await Product.countDocuments();

		res.status(200).json({
			success: true,
			message: 'Overall statistics fetched successfully',
			data: { totalUsers, totalProducts },
		});
	} catch (error) {
		console.error('Error fetching overall statistics:', error);
		res.status(500).json({ success: false, message: 'Internal Server Error' });
	}
};

module.exports = { getStats, getMonthlyStats };
