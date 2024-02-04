const User = require('../model/user');
const Product = require('../model/product');

const generateMonthlyStats = (stats) => {
	const monthlyStats = {};
	const monthNames = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];
	monthNames.forEach((monthName) => {
		monthlyStats[monthName] = 0;
	});
	stats.forEach((stat) => {
		const monthKey = stat._id;
		const monthName = monthNames[parseInt(monthKey.split('-')[1], 10) - 1];
		monthlyStats[monthName] = stat.newUserCount || stat.newProductCount || 0;
	});
	return monthlyStats;
};
const getMonthlyStats = async (req, res) => {
	try {
		const currentYear = new Date().getFullYear();
		const userStats = await User.aggregate([
			{
				$match: {
					createdAt: {
						$gte: new Date(`${currentYear}-01-01`),
						$lt: new Date(`${currentYear + 1}-01-01`),
					},
				},
			},
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
				$match: {
					createdAt: {
						$gte: new Date(`${currentYear}-01-01`),
						$lt: new Date(`${currentYear + 1}-01-01`),
					},
				},
			},
			{
				$group: {
					_id: {
						$dateToString: { format: '%Y-%m', date: '$createdAt' },
					},
					newProductCount: { $sum: 1 },
				},
			},
		]);
		console.log(productStats);
		const userMonthlyStats = generateMonthlyStats(userStats);
		const productMonthlyStats = generateMonthlyStats(productStats);

		return res.status(200).json({
			success: true,
			message: 'Monthly statistics for the current year fetched successfully',
			data: { userStats: userMonthlyStats, productStats: productMonthlyStats },
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
const getUserStatsByYear = async (year) => {
	return await User.aggregate([
		{
			$match: {
				createdAt: {
					$gte: new Date(`${year}-01-01`),
					$lt: new Date(`${year + 1}-01-01`),
				},
			},
		},
		{
			$group: {
				_id: {
					$dateToString: { format: '%Y-%m', date: '$createdAt' },
				},
				newUserCount: { $sum: 1 },
			},
		},
	]);
};

const getProductStatsByYear = async (year) => {
	return await Product.aggregate([
		{
			$match: {
				createdAt: {
					$gte: new Date(`${year}-01-01`),
					$lt: new Date(`${year + 1}-01-01`),
				},
			},
		},
		{
			$group: {
				_id: {
					$dateToString: { format: '%Y-%m', date: '$createdAt' },
				},
				newProductCount: { $sum: 1 },
			},
		},
	]);
};

const getYearlyStats = async (req, res) => {
	try {
		const currentYear = new Date().getFullYear();
		const yearlyStats = [];

		for (let i = 0; i < 3; i++) {
			const year = currentYear - i;
			const userStats = await getUserStatsByYear(year);
			const productStats = await getProductStatsByYear(year);

			yearlyStats.push({
				year,
				userStats: generateMonthlyStats(userStats),
				productStats: generateMonthlyStats(productStats),
			});
		}

		// Sum the monthly values for each year
		const userStatsSum = {};
		const productStatsSum = {};

		yearlyStats.forEach(({ year, userStats, productStats }) => {
			userStatsSum[year] = userStatsSum[year] || 0;
			productStatsSum[year] = productStatsSum[year] || 0;

			userStatsSum[year] += Object.values(userStats).reduce(
				(acc, value) => acc + value,
				0
			);
			productStatsSum[year] += Object.values(productStats).reduce(
				(acc, value) => acc + value,
				0
			);
		});

		return res.status(200).json({
			success: true,
			message: 'Yearly statistics fetched successfully',
			data: {
				userStats: userStatsSum,
				productStats: productStatsSum,
			},
		});
	} catch (error) {
		console.error('Error fetching yearly statistics:', error);
		return res
			.status(500)
			.json({ success: false, message: 'Internal Server Error' });
	}
};
module.exports = { getStats, getMonthlyStats, getYearlyStats };
