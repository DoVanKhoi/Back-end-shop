const Order = require('../models/OrderProduct');
const Product = require('../models/ProductModel');
const EmailService = require('./EmailService');

const createOrderData = (newOrder) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, totalPrice, user, isPaid, paidAt, deliveryMethod, email } = newOrder;

            const updateResults = await Promise.all(
                orderItems.map(async (item) => {
                    const product = await Product.findOneAndUpdate(
                        {
                            _id: item.product,
                            countInStock: { $gte: item.amount }
                        },
                        {
                            $inc: {
                                countInStock: -item.amount,
                                selled: +item.amount
                            }
                        },
                        {
                            new: true
                        }
                    );

                    if (!product) {
                        return {
                            status: 'ERR',
                            message: 'Product out of stock',
                            id: item.product
                        };
                    }

                    return { status: 'OK' };
                })
            );

            const outOfStockItems = updateResults.filter((result) => result.status === 'ERR');

            if (outOfStockItems.length > 0) {
                return resolve({
                    status: 'ERR',
                    message: `Sản phẩm với id: ${outOfStockItems.map((item) => item.id).join(', ')} đã hết hàng`
                });
            }

            const createdOrder = await Order.create({
                orderItems,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                shippingPrice,
                totalPrice,
                user,
                isPaid,
                paidAt,
                deliveryMethod
            });

            if (createdOrder) {
                await EmailService.sendEmailCreateOrder(email, orderItems);
                return resolve({
                    status: 'OK',
                    message: 'Order created successfully'
                });
            }
        } catch (e) {
            reject(e);
        }
    }
    )
};

const getOrderDetailsData = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const orderHistory = await Order.find({ user: userId }).sort({ createdAt: -1 });

            if (orderHistory === null) {
                resolve({
                    status: 'ERR',
                    message: 'Order is not defined'
                });
            }

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: orderHistory
            });
        } catch (e) {
            reject(e);
        }
    });
};

const cancelOrderData = (orderId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.findById(orderId);
            if (!order) {
                return resolve({
                    status: 'ERR',
                    message: 'Order not found',
                });
            }

            const updatePromises = order.orderItems.map(async (item) => {
                const product = await Product.findOneAndUpdate(
                    {
                        _id: item.product,
                        selled: { $gte: item.amount },
                    },
                    {
                        $inc: {
                            countInStock: +item.amount,
                            selled: -item.amount,
                        },
                    },
                    {
                        new: true,
                    }
                );

                if (!product) {
                    return ({
                        status: 'ERR',
                        message: `Product ${item.name} cannot be updated (Error in sold quantity).`,
                    });
                }

                return ({
                    status: 'OK',
                    message: 'Product updated successfully',
                    productId: item.product,
                });
            });

            const results = await Promise.all(updatePromises);

            const errors = results.filter((result) => result.status === 'ERR');
            if (errors.length > 0) {
                return resolve({
                    status: 'ERR',
                    message: `Some products failed to update: ${errors.map((err) => err.message).join(', ')}`,
                });
            }

            const deletedOrder = await Order.findByIdAndDelete(orderId);
            if (!deletedOrder) {
                return resolve({
                    status: 'ERR',
                    message: 'Failed to delete the order',
                });
            }

            resolve({
                status: 'OK',
                message: 'Order canceled and products updated successfully',
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getAllOrderHistoryData = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allOrderHistory = await Order.find().sort({ createdAt: -1 });

            resolve({
                status: 'OK',
                message: 'Get all order history success',
                data: allOrderHistory
            });
        } catch (e) {
            reject(e);
        }
    }
    )
};

const updateOrderData = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkOrder = await Order.findById({ _id: id });
            if (!checkOrder) {
                return resolve({
                    status: 'ERR',
                    message: 'Order not found',
                });
            }

            const updatedOrder = await Order.findByIdAndUpdate(id, { isPaid: true, isDelivered: true, paidAt: Date.now() }, { new: true });

            resolve({
                status: 'OK',
                message: 'Update order success',
                data: updatedOrder
            });
        } catch (e) {
            reject(e);
        }
    })
};


module.exports = {
    createOrderData,
    getOrderDetailsData,
    cancelOrderData,
    getAllOrderHistoryData,
    updateOrderData
};