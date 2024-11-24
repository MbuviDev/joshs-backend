const express = require('express');
const User = require('../models/User');
const protect = require('../middleware/auth');
const router = express.Router();

// Get all users (Admin only)
router.get('/users', protect, async (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Access denied' });
    }

    try {
        const users = await User.find().select('-password'); // Exclude passwords
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all orders (Admin only)
router.get('/orders', protect, async (req, res) => {
  if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
  }

  try {
      const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
      res.json(orders);
  } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ message: 'Server error' });
  }
});

// Update order status (Admin only)
router.put('/orders/:orderId', protect, async (req, res) => {
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
      console.error('Error updating order status:', error);
      res.status(500).json({ message: 'Server error' });
  }
});



// Delete a user (Admin only)
router.delete('/users/:userId', protect, async (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Access denied' });
    }

    try {
        const user = await User.findByIdAndDelete(req.params.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
