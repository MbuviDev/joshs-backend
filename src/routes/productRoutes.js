const express = require('express');
const Product = require('../models/Product');
const protect = require('../middleware/auth'); // For protected routes
const multer = require("multer");
const cloudinary = require("../config/cloudinary");

const router = express.Router();

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Create or Add a product with image upload (Admin-only)
router.post('/', protect, upload.single('image'), async (req, res) => {
    const { name, description, price, stock, category } = req.body;

    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: 'Access denied' });
        }

        let imageUrl = null;

        // If an image file is uploaded, upload it to Cloudinary
        if (req.file) {
            const result = await cloudinary.uploader.upload_stream(
                { folder: "kitenge-products" },
                (error, result) => {
                    if (error) throw error;
                    return result;
                }
            ).end(req.file.buffer);

            imageUrl = result.secure_url;
        }

        // Save product to the database
        const newProduct = new Product({
            name,
            price,
            description,
            category,
            stock,
            image: imageUrl || '', // If no image is provided, leave it blank
        });

        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get a single product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a product (Admin-only)
router.put('/:id', protect, async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });

        res.json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a product (Admin-only)
router.delete('/:id', protect, async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
