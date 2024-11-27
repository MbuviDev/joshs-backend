const Product = require('../models/Product');


// Fetch all products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error.message);
        res.status(500).json({ message: 'Server error while fetching products' });
    }
};

// Fetch a single product by ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product:', error.message);
        res.status(500).json({ message: 'Server error while fetching product' });
    }
};

// Create a product with image upload (Admin-only)
const createProduct = async (req, res) => {
    const { name, description, price, stock, category } = req.body;

    if (!name || !price || !category) {
        return res.status(400).json({ message: 'Name, price, and category are required' });
    }

    try {
        if (!req.user || !req.user.isAdmin) {
            return res.status(403).json({ message: 'Access denied' });
        }

        let imageUrl = "";

        // If an image file is uploaded, upload it to Cloudinary
        if (req.file) {
            const uploadResult = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "kitenge-products" },
                    (error, result) => {
                        if (error) reject(error);
                        resolve(result);
                    }
                );
                stream.end(req.file.buffer);
            });

            imageUrl = uploadResult.secure_url;
        }

        // Save product to the database
        const newProduct = new Product({
            name,
            description,
            price,
            stock,
            category,
            image: imageUrl, // Assign Cloudinary URL or leave blank
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error("Error creating product:", error.message);
        res.status(500).json({ message: "Server error while creating product" });
    }
};

// Update a product (Admin-only)
const updateProduct = async (req, res) => {
    try {
        if (!req.user || !req.user.isAdmin) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });

        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error.message);
        res.status(500).json({ message: 'Server error while updating product' });
    }
};

// Delete a product (Admin-only)
const deleteProduct = async (req, res) => {
    try {
        if (!req.user || !req.user.isAdmin) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error.message);
        res.status(500).json({ message: 'Server error while deleting product' });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
