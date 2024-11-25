const express = require('express');
const User = require('../models/User');
const Order = require('../models/Order');
const { protect, admin } = require('../middleware/auth');
const router = express.Router();

// Get all users (Admin-only)
router.get('/users', protect, admin, async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude passwords
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all orders (Admin-only)
router.get('/orders', protect, admin, async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email') // Populate user info
            .sort({ createdAt: -1 }); // Sort by latest orders
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update order status (Admin-only)
router.put('/orders/:orderId', protect, admin, async (req, res) => {
    const { status } = req.body;

    try {
        const order = await Order.findById(req.params.orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = status || order.status;
        await order.save();

        res.status(200).json(order);
    } catch (error) {
        console.error('Error updating order status:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a user (Admin-only)
router.delete('/users/:userId', protect, admin, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
