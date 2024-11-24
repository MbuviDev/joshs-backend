const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const protect = require('../middleware/auth');
const router = express.Router();

// Get the user's cart
router.get('/', protect, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
        if (!cart) return res.status(200).json({ items: [] });

        res.json(cart);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add an item to the cart
router.post('/', protect, async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            cart = new Cart({ user: req.user.id, items: [] });
        }

        // Check if product already exists in the cart
        const existingItem = cart.items.find(item => item.product.toString() === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        cart.updatedAt = Date.now();
        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update cart item quantity
router.put('/:itemId', protect, async (req, res) => {
    const { quantity } = req.body;

    try {
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        const item = cart.items.id(req.params.itemId);
        if (!item) return res.status(404).json({ message: 'Item not found in cart' });

        item.quantity = quantity;
        cart.updatedAt = Date.now();
        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Remove an item from the cart
router.delete('/:itemId', protect, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        const item = cart.items.id(req.params.itemId);
        if (!item) return res.status(404).json({ message: 'Item not found in cart' });

        item.remove();
        cart.updatedAt = Date.now();
        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
