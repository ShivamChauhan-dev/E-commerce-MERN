const express = require('express');
const jwt = require('jsonwebtoken');
const fetchUser = require('../middlewares/fetchUser');
const Users = require('../models/userModel');

const router = express.Router();

// Register
router.post('/signup', async (req, res) => {

    try {
        // Check if the user with the same email already exists
        let check = await Users.findOne({ email: req.body.email });
        if (check) {
            return res.status(400).json({ success: false, error: "Existing user found with the same email address" });
        }

        // Initialize a cart with 300 items, all set to 0
        let cart = {};
        for (let i = 0; i < 300; i++) {
            cart[i] = 0;
        }

        // Create a new user with the provided details
        const user = new Users({
            name: req.body.username,
            email: req.body.email,
            password: req.body.password,
            cartData: cart,
        });

        // Save the new user to the database
        await user.save();

        // Create a payload with the user's id
        const data = {
            user: {
                id: user.id
            }
        };

        // Sign the JWT token with the payload and a secret key
        const token = jwt.sign(data, 'secret_ecom');

        // Respond with the token
        res.json({ success: true, token });

    } catch (error) {
        console.error("Error during user registration:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});


// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Check if user exists with the provided email
    const user = await Users.findOne({ email });
    if (!user) {
        return res.status(400).json({ success: false, error: "User not found" });
    }

    // Check if the provided password matches the stored password
    if (user.password !== password) {
        return res.status(400).json({ success: false, error: "Invalid credentials" });
    }

    // If user exists and password is correct, generate a JWT token
    const data = {
        user: {
            id: user.id
        }
    };

    const token = jwt.sign(data, 'secret_ecom', { expiresIn: '1h' }); // Token expires in 1 hour

    // Respond with the token
    res.json({ success: true, token });
});

// Add to Cart
router.post('/addtocart', fetchUser, async (req, res) => {
    try {
        let userData = await Users.findOne({ _id: req.user.id });
        if (!userData) return res.status(404).send('User not found');
        userData.cartData[req.body.itemId] = (userData.cartData[req.body.itemId] || 0) + 1;
        await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
        res.send('Added to cart');
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to add to cart' });
    }
});

// Remove from Cart
router.post('/removefromcart', fetchUser, async (req, res) => {
    try {
        let userData = await Users.findOne({ _id: req.user.id });
        if (!userData) return res.status(404).send('User not found');
        if (userData.cartData[req.body.itemId] > 0) {
            userData.cartData[req.body.itemId] -= 1;
            await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
            res.send('Removed from cart');
        } else {
            res.status(400).send('Item not in cart');
        }
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to remove from cart' });
    }
});

//creating endpoint to get cartitem
router.post('/getcart', fetchUser, async (req, res) => {
    try {
        let userData = await Users.findOne({ _id: req.user.id });
        if (!userData) return res.status(404).send('User not found');
        res.json(userData.cartData);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch cart data' });
    }
});

module.exports = router;
