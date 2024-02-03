const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer storage configuration
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const uploadPath = 'uploads/';
		// Check if the directory exists, if not, create it
		if (!fs.existsSync(uploadPath)) {
			fs.mkdirSync(uploadPath);
		}
		cb(null, uploadPath);
	},
	filename: function (req, file, cb) {
		const extension = path.extname(file.originalname);
		const filename = file.fieldname + '-' + Date.now() + extension;
		cb(null, filename);
	},
});

const fileFilter = (req, file, cb) => {
	const allowedFileTypes = ['.jpg', '.jpeg', '.png'];
	const extension = path.extname(file.originalname).toLowerCase();

	if (allowedFileTypes.includes(extension)) {
		cb(null, true);
	} else {
		cb(new Error('Invalid file type. Only images are allowed.'), false);
	}
};
const upload = multer({
	storage: storage,
	fileFilter: fileFilter,
	limits: {
		fileSize: 1024 * 1024 * 5, // Limit file size to 5 MB
	},
});

const uploadProductImage = (req, res, next) => {
	// 'image' is the field name in the form-data
	const uploadSingle = upload.single('image');

	uploadSingle(req, res, function (err) {
		if (err instanceof multer.MulterError) {
			return res.status(400).json({ success: false, message: err.message });
		} else if (err) {
			return res
				.status(500)
				.json({ success: false, message: 'Internal Server Error' });
		}

		// File uploaded successfully
		next();
	});
};

module.exports = uploadProductImage;
