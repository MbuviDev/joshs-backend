const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true },
        },
    ],
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true }, // e.g., 'Visa', 'Apple Pay'
    paymentStatus: { type: String, default: 'Pending' }, // e.g., 'Pending', 'Paid'
    totalPrice: { type: Number, required: true },
    status: { type: String, default: 'Pending' }, // e.g., 'Pending', 'Shipped', 'Completed'
    createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
