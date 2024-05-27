const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './src/.env' });

const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).redirect('/login');
    }
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).redirect('/login');
        }
        req.userId = decoded.userId;
        next();
    });
};

module.exports = authenticate;
