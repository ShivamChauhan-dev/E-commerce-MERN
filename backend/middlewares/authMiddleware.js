const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require('../Config');

const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).send({ errors: "Please authenticate using a valid token" });
    } else {
        try {
            const data = jwt.verify(token, JWT_SECRET);
            req.user = data.user;
            next();
        } catch (error) {
            return res.status(401).send({ errors: "Please authenticate using a valid token" });
        }
    }
};

module.exports = fetchUser;
