var userModel = require('../model/user');
const bcrypt = require('bcrypt');
var ObjectId = require('mongodb').ObjectID;
const saltRounds = 10;
var jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
// const { sendEmail } = require('../helpers/sendEmail');
// const { sendMessage } = require('../helpers/sendMessage');

const createUser = async (req, res) => {
	try {
		console.log('req.body is', req.body);

		// Check if required fields are provided
		const requiredFields = ['email', 'firstname', 'lastname', 'password'];
		const missingFields = requiredFields.filter((field) => !req.body[field]);

		if (missingFields.length > 0) {
			return res.status(400).json({
				success: false,
				message: `Fields ${missingFields.join(', ')} are required.`,
			});
		}

		// Checking if user exists
		const email = req.body.email.toLowerCase();
		let ifuser;
		ifuser = await userModel.findOne({ email });

		if (ifuser) {
			console.log(ifuser);
			// User already exists
			console.log('User exists.');

			if (ifuser.isDeleted == true) {
				return res.status(200).send({
					success: false,
					message: 'This User is Deleted.',
					data: [],
				});
			} else {
				return res.status(200).send({
					success: false,
					message: 'User Already Exists.',
				});
			}
		} else {
			// Encrypting user password
			const encryptedPassword = await bcrypt.hash(
				req.body.password,
				saltRounds
			);

			// Saving user to DB
			let newUser;
			newUser = await new userModel({
				email: email,
				firstname: req.body.firstname,
				lastname: req.body.lastname,
				password: encryptedPassword,
			}).save();

			if (newUser) {
				console.log('You are now user', newUser);
				res.status(200).send({
					success: true,
					message: 'You are now user',
					data: newUser,
				});
			} else {
				console.log('Request Failed');
				res.status(404).send({
					success: false,
					message: 'Request Failed',
				});
			}
		}
	} catch (err) {
		console.log('err: ', err);
		res.status(500).json({
			success: false,
			message: err,
		});
	}
};

const login = async (req, res) => {
	try {
		console.log('req.body: ', req.body);
		const { email, password } = req.body;
		const user = await userModel.findOne({ email: email });
		if (user) {
			if (user.isDeleted == true) {
				return res.send(400).json({
					success: false,
					message: 'User not exists',
				});
			}
			if (await bcrypt.compare(password, user.password)) {
				const accessToken = await jwt.sign(
					{ id: user._id },
					process.env.JWT_SECRET,
					{
						expiresIn: '2d',
					}
				);
				return res.status(200).json({
					success: true,
					message: 'Correct Details',
					user: user,
					accessToken: accessToken,
				});
			} else {
				return res.status(400).json({
					success: false,
					message: 'Error: Email and Pass Dont Match',
				});
			}
		} else {
			console.log('Invalid User');
			return res.status(400).json({
				success: false,
				message: 'User not exists',
			});
		}
	} catch (err) {
		console.log('err.isJoi: ', err);
		return res.status(500).json({
			success: false,
			message: 'Internal Server Error',
		});
	}
};

module.exports = {
	createUser,
	login,
};
