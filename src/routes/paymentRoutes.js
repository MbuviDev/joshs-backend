const express = require('express');
const stripe = require('../config/stripe');
const Order = require('../models/Order');
const protect = require('../middleware/auth');
const router = express.Router();

// Create a payment intent
router.post('/create-payment-intent', protect, async (req, res) => {
    const { orderId } = req.body;

    try {
        // Find the order
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        // Create a payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(order.totalPrice * 100), // Convert to cents
            currency: 'usd', // Use the desired currency
            payment_method_types: ['card'], // Visa/Apple Pay supported
            metadata: { orderId: order._id.toString() },
        });

        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Webhook for Stripe (to handle payment confirmation)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const sig = req.headers['stripe-signature'];

    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle event types
    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata.orderId;

        // Update order status to "Paid"
        await Order.findByIdAndUpdate(orderId, { paymentStatus: 'Paid' });
    }

    res.status(200).send('Webhook received');
});

module.exports = router;
