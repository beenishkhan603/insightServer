var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var user = new Schema({
	email: {
		type: String,
		required: true,
	},
	firstname: {
		type: String,
		required: true,
	},
	lastname: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	isDeleted: {
		type: Boolean,
		default: false,
	},
});

module.exports = mongoose.model('users', user);
