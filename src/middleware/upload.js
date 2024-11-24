const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'kitenge-ecommerce', // Folder name in Cloudinary
        allowedFormats: ['jpeg', 'png', 'jpg'], // Allowed file formats
    },
});

const upload = multer({ storage });

module.exports = upload;
