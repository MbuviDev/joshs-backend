const express = require('express');
const multer = require("multer");
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, admin } = require('../middleware/auth');
const router = express.Router();
const Product = require("../models/Product")


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

// Fetch all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find(); // Fetch all products from the database
    res.json(products); // Return products as JSON
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});


module.exports = router;
