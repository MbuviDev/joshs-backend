const Order = require('../models/Order');
const Cart = require('../models/Cart');

// Place a new order
const placeOrder = async (req, res) => {
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
        console.error('Error placing order:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get user's orders
const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching user orders:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all orders (Admin only)
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching all orders:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update order status (Admin only)
const updateOrderStatus = async (req, res) => {
    const { status } = req.body;

    try {
        const order = await Order.findById(req.params.orderId);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        order.status = status || order.status;
        await order.save();

        res.status(200).json(order);
    } catch (error) {
        console.error('Error updating order status:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    placeOrder,
    getUserOrders,
    getAllOrders,
    updateOrderStatus,
};
