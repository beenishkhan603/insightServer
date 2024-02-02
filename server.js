const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const userroutes = require('./routes/user');
const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(
	`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9jxgcjl.mongodb.net/${process.env.DB_NAME}`,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	}
);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
	console.log('Connected to MongoDB');
});

app.use('/backend', userroutes);

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});