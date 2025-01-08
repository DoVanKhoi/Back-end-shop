const express = require('express');
const router = express.Router();
const { createProduct, updateProduct, getDetailProduct, deleteProduct, getAllProduct } = require('../controllers/ProductController');

router.post('/create', createProduct)
router.put('/update/:id', updateProduct)
router.get('/details/:id', getDetailProduct)
router.delete('/delete/:id', deleteProduct)
router.get('/get-all', getAllProduct)

module.exports = router;