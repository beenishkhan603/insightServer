const mongoose = require('mongoose');
require('dotenv').config();
// Connect to MongoDB
mongoose.connect(
	`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9jxgcjl.mongodb.net/${process.env.DB_NAME}`,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	}
);
const db = mongoose.connection;
module.exports = db;
