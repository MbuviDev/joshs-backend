const mongoose = require('mongoose');
const connectDB = require('../config/db');
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const path = require("path");
const Product = require("../models/Product"); // Adjust path to your product model

// Folder containing local images
const imageFolder = path.join(__dirname, "../../images");

const uploadImages = async () => {
    try {
        // Connect to MongoDB
        await connectDB();
        console.log("MongoDB connected successfully.");

        const files = fs.readdirSync(imageFolder);

        for (const file of files) {
            console.log(`Uploading ${file}...`);

            try {
                // Upload to Cloudinary
                const result = await cloudinary.uploader.upload(`${imageFolder}/${file}`, {
                    folder: "kitenge-products", // Cloudinary folder name
                });

                // Save product to the database
                const newProduct = new Product({
                    name: file.replace(/\.[^/.]+$/, ""), // Remove file extension for product name
                    price: 7740.00, // Example price
                    description: "High-quality Kitenge fabric",
                    category: "Kitenge",
                    stock: 10, // Default stock
                    image: result.secure_url, // Cloudinary image URL
                });

                await newProduct.save();
                console.log(`Uploaded ${file} and saved to database.`);
            } catch (error) {
                console.error(`Failed to upload ${file}:`, error.message);
            }
        }

        console.log("All images uploaded successfully!");
    } catch (error) {
        console.error("Error uploading images:", error.message);
    } finally {
        mongoose.connection.close(); // Close the MongoDB connection after completion
    }
};

// Run the upload script
uploadImages();
