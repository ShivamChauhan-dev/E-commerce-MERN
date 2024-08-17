require('dotenv').config();

const config = {
    port: process.env.PORT || 4000,
    mongodbUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
};

module.exports = config;
