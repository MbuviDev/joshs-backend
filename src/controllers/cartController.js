const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get the user's cart
const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
        if (!cart) {
            return res.status(200).json({ items: [] }); // Return empty cart
        }
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error fetching cart:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Add an item to the cart
const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;

    if (quantity <= 0) {
        return res.status(400).json({ message: 'Quantity must be greater than zero' });
    }

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            cart = new Cart({ user: req.user.id, items: [] });
        }

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
        console.error('Error adding to cart:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
    const { quantity } = req.body;

    if (quantity <= 0) {
        return res.status(400).json({ message: 'Quantity must be greater than zero' });
    }

    try {
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const item = cart.items.id(req.params.itemId);
        if (!item) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        item.quantity = quantity;
        cart.updatedAt = Date.now();
        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        console.error('Error updating cart:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Remove an item from the cart
const removeCartItem = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const item = cart.items.id(req.params.itemId);
        if (!item) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        item.remove();
        cart.updatedAt = Date.now();
        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        console.error('Error removing item from cart:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
};
