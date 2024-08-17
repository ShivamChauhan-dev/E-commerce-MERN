const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const config = require("./Config");
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const fetchUser = require('./middlewares/fetchUser'); // Correct the path as per your structure
const app = express();
const Users = require('./models/userModel');

app.use(express.json());
app.use(cors());

// Database Connection with MongoDB
mongoose.connect(config.mongodbUri)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err))

// Static Files
app.use('/images', express.static('upload/images'));

// Routes
app.use('/products', productRoutes);
app.use('/users', userRoutes);

// Use fetchUser middleware for the /getcart route
app.post('/getcart', fetchUser, async (req, res) => {
    try {
        let userData = await Users.findOne({ _id: req.user.id });
        if (!userData) return res.status(404).send('User not found');
        res.json(userData.cartData);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch cart data' });
    }
});

app.listen(config.port, () => {
    console.log(`Server Running on port ${config.port}`);
});
