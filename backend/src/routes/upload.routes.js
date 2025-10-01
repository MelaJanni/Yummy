const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const { upload, handleUploadError } = require('../middlewares/upload');
const { success } = require('../utils/response');

router.post('/upload', authenticate, upload.single('image'), handleUploadError, (req, res) => {
  console.log('Upload request received');
  console.log('File:', req.file);

  if (!req.file) {
    console.log('No file in request');
    return res.status(400).json({
      success: false,
      error: {
        code: 'NO_FILE',
        message: 'No file uploaded'
      }
    });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  console.log('File saved:', fileUrl);

  res.status(201).json(success({
    url: fileUrl,
    filename: req.file.filename,
    size: req.file.size,
    mimetype: req.file.mimetype
  }));
});

module.exports = router;
