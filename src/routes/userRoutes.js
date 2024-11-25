const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const {protect} = require('../middleware/auth')
const router = express.Router();

// Register user
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const newUser = new User({ name, email, password });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Login user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


router.post("/cart", protect, async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });

        const user = await User.findById(req.user.id);
        const existingItem = user.cart.find((item) => item.product.toString() === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            user.cart.push({ product: productId, quantity });
        }

        await user.save();
        res.status(201).json(user.cart);
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
