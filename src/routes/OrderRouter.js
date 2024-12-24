const express = require('express');
const router = express.Router();
const { createOrder, getOrderDetails, cancelOrder } = require('../controllers/OrderController');
const { authUserMiddleware } = require('../middleware/authMiddleware');

router.post('/create/:id', authUserMiddleware, createOrder);
router.get('/get-all-order/:id', authUserMiddleware, getOrderDetails);
router.delete('/delete-order/:id', authUserMiddleware, cancelOrder);

module.exports = router;