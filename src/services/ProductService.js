const Product = require('../models/ProductModel');

const createProductData = (newProduct) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { name, image, type, price, countInStock, rating, description } = newProduct;

            const checkProduct = await Product.findOne({ name: name });

            if (checkProduct !== null) {
                resolve({
                    status: 'OK',
                    message: 'The name of product is already'
                });
            }

            const createProduct = await Product.create({
                name,
                image,
                type,
                price,
                countInStock,
                rating,
                description
            });
            if (createProduct) {
                resolve({
                    status: 'OK',
                    message: 'Product created',
                    data: createProduct
                });
            }
        } catch (e) {
            reject(e);
        }
    }
    )
};

const updateProductData = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({ _id: id });

            if (checkProduct === null) {
                resolve({
                    status: 'ERR',
                    message: 'Product is not defined'
                });
            }

            const updateProduct = await Product.findByIdAndUpdate(id, data, { new: true });

            resolve({
                status: 'OK',
                message: 'Update success',
                data: updateProduct
            });
        } catch (e) {
            reject(e);
        }
    })
};

const getProductById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const product = await Product.findOne({ _id: id });

            if (product === null) {
                resolve({
                    status: 'ERR',
                    message: 'Product is not defined'
                });
            }

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: product
            });
        } catch (e) {
            reject(e);
        }
    });
};

const deleteProductData = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({ _id: id });

            if (checkProduct === null) {
                resolve({
                    status: 'ERR',
                    message: 'Product is not defined'
                });
            }

            await Product.findByIdAndDelete(id);

            resolve({
                status: 'OK',
                message: 'Delete product success'
            });
        } catch (e) {
            reject(e);
        }
    }
    )
};

const getAllProductData = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allProduct = await Product.find().sort({ createdAt: -1 });

            resolve({
                status: 'OK',
                message: 'Get all product success',
                data: allProduct
            });
        } catch (e) {
            reject(e);
        }
    }
    )
};

module.exports = {
    createProductData,
    updateProductData,
    getProductById,
    deleteProductData,
    getAllProductData
}