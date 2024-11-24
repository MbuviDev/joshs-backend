const express = require('express');
const Product = require('../models/Product');
const protect = require('../middleware/auth'); // For protected routes
const router = express.Router();
const upload = require('../middleware/upload')

// Create a product (Admin-only)
router.post('/', protect, async (req, res) => {
    const { name, description, price, stock, category, image } = req.body;

    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const newProduct = new Product({ name, description, price, stock, category, image });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Server error' });
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

// Add a product with image upload
router.post('/', upload.single('image'), async (req, res) => {
    const { name, description, price, stock, category } = req.body;

    try {
        const newProduct = new Product({
            name,
            description,
            price,
            stock,
            category,
            image: req.file.path, // Cloudinary URL
        });

        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error adding product:', error);
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
