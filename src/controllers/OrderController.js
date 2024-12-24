const { createOrderData, getOrderDetailsData, cancelOrderData } = require('../services/OrderService');

const createOrder = async (req, res) => {
    try {
        const { orderItems, paymentMethod, shippingAddress, itemsPrice, shippingPrice, totalPrice, isPaid, paidAt, deliveryMethod } = req.body;
        if (!orderItems || !paymentMethod || !shippingAddress || !itemsPrice || !shippingPrice || !totalPrice || !deliveryMethod) {
            return res.status(400).json({
                status: 'ERR',
                message: 'All fields are required'
            });
        }
        const response = await createOrderData(req.body);
        return res.status(200).json(response);
    } catch (err) {
        return res.status(404).send(err.message);
    }
};

const getOrderDetails = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'User id is required'
            });
        }
        const response = await getOrderDetailsData(userId);
        return res.status(200).json(response);
    } catch (err) {
        return res.status(404).send(err.message);
    }
}

const cancelOrder = async (req, res) => {
    try {
        const order = req.body;
        const orderId = order._id;
        if (!orderId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Order id is required'
            });
        }
        const response = await cancelOrderData(orderId);
        return res.status(200).json(response);
    } catch (err) {
        return res.status(404).send(err.message);
    }
}


module.exports = {
    createOrder,
    getOrderDetails,
    cancelOrder
};