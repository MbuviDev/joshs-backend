const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes');
const path = require('path');
const fs = require("fs")

// Initialize app and load environment variables
dotenv.config();
const app = express();
app.use(express.json())
const IMAGES_DIR = path.join(__dirname, "../public_html/images");

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
// app.use('/images', express.static(path.join(__dirname, 'images')))
app.use('/images', express.static(path.join(__dirname, 'images')));

// Test route
app.get('/', (req, res) => {
    res.send('Welcome to the E-commerce Backend!');
});

app.get("/images", (req, res) => {
    fs.readdir(IMAGES_DIR, (err, files) => {
        if (err) {
            console.error("Error reading images directory:", err);
            return res.status(500).json({ message: "Failed to load images" });
        }

        // Generate URLs for each image
        const imageUrls = files.map((file) => ({
            name: file,
            url: `https://joshskitenge.com/images/${file}`,
        }));

        res.json(imageUrls);
    });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
