require('dotenv').config();
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {

    const token = req.headers.token?.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) {
            return res.status(404).json({
                status: 'ERR',
                message: 'The authentication'
            });
        }
        if (user?.isAdmin) {
            next();
        } else {
            return res.status(404).json({
                status: 'ERR',
                message: 'The authentication Admin'
            });
        }
    });
};

const authUserMiddleware = (req, res, next) => {
    const token = req.headers.token?.split(' ')[1];
    const userId = req.params.id;
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) {
            return res.status(404).json({
                status: 'ERR',
                message: err.message
            });
        }
        if (user?.isAdmin || user?.id === userId) {
            next();
        } else {
            return res.status(404).json({
                status: 'ERR',
                message: 'The authentication'
            });
        }
    });
}

module.exports = { authMiddleware, authUserMiddleware };