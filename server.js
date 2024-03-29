const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');
const statsRoutes = require('./routes/stats');
const db = require('./utils/dbConfig');

const app = express();
const port = 3001;

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cors());

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
	console.log('Connected to MongoDB');
});

app.use('/', userRoutes);
app.use('/product', productRoutes);
app.use('/stats', statsRoutes);

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
