const express = require('express');
const multer = require("multer");
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, admin } = require('../middleware/auth');
const router = express.Router();


// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
router.get('/', getAllProducts); // Public route: Fetch all products
router.get('/:id', getProductById); // Public route: Fetch single product by ID

// Admin-only routes
router.post('/', protect, admin, upload.single('image'), createProduct); // Add product with image
router.put('/:id', admin, protect, updateProduct); // Update product
router.delete('/:id', protect, admin, deleteProduct); // Delete product




module.exports = router;
