const express = require('express');
const multer = require("multer");
const { 
    getAllProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct 
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/auth');
const router = express.Router();

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Public Routes: Accessible without authentication
router.get('/', getAllProducts); // Fetch all products
router.get('/:id', getProductById); // Fetch a single product by ID

// Admin-Only Routes: Require authentication and admin privileges
router.post('/', protect, admin, upload.single('image'), createProduct); // Add product with image
router.put('/:id', protect, admin, updateProduct); // Update product
router.delete('/:id', protect, admin, deleteProduct); // Delete product

module.exports = router;
