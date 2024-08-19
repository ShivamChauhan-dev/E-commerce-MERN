const port = process.env.PORT
const express = require('express');
const multer = require('multer');
const path = require('path');
const fetchUser = require('../middlewares/authMiddleware');
const Product = require('../models/productModel');
const { storage } = require('../utils/imageUpload');

const router = express.Router();
const upload = multer({ storage });

// Image Upload Endpoint
router.post("/upload", upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    });
});

// Add Product
router.post('/addproduct', async (req, res) => {
    let products = await Product.find({});
    let id;
    if (products.length > 0) {
        let last_product = products.slice(-1)[0];
        id = last_product.id + 1;
    } else {
        id = 1;
    }

    const product = new Product({
        id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
    });

    try {
        await product.save();
        res.json({ success: true, name: req.body.name });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to save product" });
    }
});

// Remove Product
router.post('/removeproduct', async (req, res) => {
    await Product.findOneAndDelete({ id: req.body.id });
    res.json({ success: true, name: req.body.name });
});

// Get All Products
router.get('/allproducts', async (req, res) => {
    let products = await Product.find({});
    res.send(products);
});

// New Collection
router.get('/newcollection', async (req, res) => {
    let products = await Product.find({});
    let newcollections = products.slice(1).slice(-8);
    res.send(newcollections);
});

// Popular in Women
router.get('/popularinwomen', async (req, res) => {
    let products = await Product.find({ category: "women" });
    let popular_in_women = products.slice(0, 4);
    res.send(popular_in_women);
});

module.exports = router;