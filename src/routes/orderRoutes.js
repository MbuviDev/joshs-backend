const express = require('express');
const { protect, admin } = require('../middleware/auth');
const {
    placeOrder,
    getUserOrders,
    getAllOrders,
    updateOrderStatus,
} = require('../controllers/orderController');
const router = express.Router();

// Place a new order
router.post('/', protect, placeOrder);

// Get user's orders
router.get('/', protect, getUserOrders);

// Get all orders (Admin only)
router.get('/all', protect, admin, getAllOrders);

// Update order status (Admin only)
router.put('/:orderId', protect, admin, updateOrderStatus);

module.exports = router;
