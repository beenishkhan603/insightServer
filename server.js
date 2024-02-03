const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');
const db = require('./utils/dbConfig');

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
	console.log('Connected to MongoDB');
});

app.use('/backend', userRoutes);
app.use('/backend/product', productRoutes);
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
