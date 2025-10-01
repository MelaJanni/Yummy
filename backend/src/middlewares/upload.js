const multer = require('multer');
const path = require('path');
const env = require('../config/env');
const { error } = require('../utils/response');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('Multer destination:', env.upload.dir);
    cb(null, env.upload.dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
    console.log('Multer filename:', filename);
    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG and WebP are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: env.upload.maxSize
  }
});

const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json(error('FILE_TOO_LARGE', 'File size exceeds maximum allowed (5MB)'));
    }
    return res.status(400).json(error('UPLOAD_ERROR', err.message));
  }

  if (err) {
    return res.status(400).json(error('UPLOAD_ERROR', err.message));
  }

  next();
};

module.exports = {
  upload,
  handleUploadError
};
