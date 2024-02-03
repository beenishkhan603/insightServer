var jwt = require('jsonwebtoken');
const authenticateUser = (req, res, next) => {
	const token = req.headers['Authorization'] || req.headers['authorization'];

	if (!token) {
		return res
			.status(401)
			.json({ success: false, message: 'Unauthorized - No token provided' });
	} else {
		jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
			if (err) {
				console.log('you failed authenticate');
				return res
					.status(401)
					.json({ success: false, message: 'Unauthorized - Invalid token' });
			} else {
				req.userId = decoded.id;
				console.log('you authenticated');
				next();
			}
		});
	}
};
module.exports = authenticateUser;
