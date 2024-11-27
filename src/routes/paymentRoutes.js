const express = require('express');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');
const router = express.Router();

// Create a payment intent
router.post('/create-payment-intent', protect, async (req, res) => {
    const { orderId } = req.body;

    if (!orderId) {
        return res.status(400).json({ success: false, message: 'Order ID is required' });
    }

    try {
        // Find the order
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Create a payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(order.totalPrice * 100), // Convert to cents
            currency: 'usd', // Use the desired currency
            payment_method_types: ['card'], // Visa/Apple Pay supported
            metadata: { orderId: order._id.toString() },
        });

        res.status(200).json({
            success: true,
            data: { clientSecret: paymentIntent.client_secret },
            message: 'Payment intent created successfully',
        });
    } catch (error) {
        console.error('Error creating payment intent:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
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

    try {
        // Handle event types
        if (event.type === 'payment_intent.succeeded') {
            const paymentIntent = event.data.object;
            const orderId = paymentIntent.metadata.orderId;

            // Update order status to "Paid"
            const updatedOrder = await Order.findByIdAndUpdate(orderId, { paymentStatus: 'Paid' }, { new: true });
            if (updatedOrder) {
                console.log(`Order ${orderId} marked as paid`);
            }
        }

        res.status(200).send('Webhook received');
    } catch (error) {
        console.error('Error processing webhook:', error.message);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;
