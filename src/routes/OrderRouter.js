const express = require('express');
const router = express.Router();
const { createOrder, getOrderDetails, cancelOrder, getAllOrderHistory } = require('../controllers/OrderController');
const { authUserMiddleware, authMiddleware } = require('../middleware/authMiddleware');

router.post('/create/:id', authUserMiddleware, createOrder);
router.get('/get-all-order/:id', authUserMiddleware, getOrderDetails);
router.delete('/delete-order/:id', authUserMiddleware, cancelOrder);
router.get('/get-all-history-order', getAllOrderHistory);

module.exports = router;