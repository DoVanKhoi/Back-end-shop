const { createProductData, updateProductData, getProductById, deleteProductData, getAllProductData } = require('../services/ProductService');

const createProduct = async (req, res) => {
    try {
        const { name, image, type, price, countInStock, rating, description } = req.body;
        if (!name || !image || !type || !price || !countInStock || !rating) {
            return res.status(200).json({
                status: 'ERR',
                message: 'All fields are required'
            });
        }
        const response = await createProductData(req.body);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(404).send(error.message);
    }
};

const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const data = req.body;
        if (!productId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Product ID is required'
            });
        }

        const response = await updateProductData(productId, data);

        return res.status(200).json(response);
    } catch (error) {
        return res.status(404).send(error.message);
    }
};

const getDetailProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        if (!productId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'User ID is required'
            });
        }

        const response = await getProductById(productId);

        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).send(e.message);
    }
}

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        if (!productId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Product ID is required'
            });
        }

        const response = await deleteProductData(productId);

        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).send(e.message);
    }
}

const getAllProduct = async (req, res) => {
    try {
        const response = await getAllProductData();

        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).send(e.message);
    }
}

module.exports = {
    createProduct,
    updateProduct,
    getDetailProduct,
    deleteProduct,
    getAllProduct
};