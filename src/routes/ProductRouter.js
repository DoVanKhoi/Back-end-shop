const express = require('express');
const router = express.Router();
const { authMiddleware, authUserMiddleware } = require('../middleware/authMiddleware');
const { createProduct, updateProduct, getDetailProduct, deleteProduct, getAllProduct } = require('../controllers/ProductController');

router.post('/create', createProduct)
router.put('/update/:id', authMiddleware, updateProduct)
router.get('/details/:id', getDetailProduct)
router.delete('/delete/:id', authMiddleware, deleteProduct)
router.get('/get-all', getAllProduct)

module.exports = router;