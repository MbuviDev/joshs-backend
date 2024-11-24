const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const protect = require('../middleware/auth');
const router = express.Router();

// Place a new order
router.post('/', protect, async (req, res) => {
    const { shippingAddress, paymentMethod } = req.body;

    try {
        // Fetch user's cart
        const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Calculate total price
        const totalPrice = cart.items.reduce((total, item) => {
            return total + item.product.price * item.quantity;
        }, 0);

        // Create order
        const order = new Order({
            user: req.user.id,
            items: cart.items,
            shippingAddress,
            paymentMethod,
            totalPrice,
        });

        await order.save();

        // Clear user's cart after placing the order
        await Cart.findOneAndDelete({ user: req.user.id });

        res.status(201).json(order);
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user's orders
router.get('/', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all orders (Admin only)
router.get('/all', protect, async (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Access denied' });
    }

    try {
        const orders = await Order.find().populate('user').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching all orders:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update order status (Admin only)
router.put('/:orderId', protect, async (req, res) => {
    const { status } = req.body;

    if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Access denied' });
    }

    try {
        const order = await Order.findById(req.params.orderId);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        order.status = status || order.status;
        await order.save();

        res.json(order);
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
