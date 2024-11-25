const express = require('express');
const { protect } = require('../middleware/auth');
const {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
} = require('../controllers/cartController');
const router = express.Router();

// Get the user's cart
router.get('/', protect, getCart);

// Add an item to the cart
router.post('/', protect, addToCart);

// Update cart item quantity
router.put('/:itemId', protect, updateCartItem);

// Remove an item from the cart
router.delete('/:itemId', protect, removeCartItem);

module.exports = router;
