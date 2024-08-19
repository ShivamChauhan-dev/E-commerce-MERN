const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const config = require("./Config");
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const app = express();


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
  

app.listen(config.port, () => {
    console.log(`Server Running on port ${config.port}`);
});
