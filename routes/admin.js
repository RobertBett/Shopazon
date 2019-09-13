const express = require('express');
const router = express.Router();
const { getAddProduct, postAddProduct,getAdminProducts, getEditProduct } = require('../controllers/admin')


router.get('/admin/add-product', getAddProduct)
router.get('/admin/edit-product/:productId', getEditProduct)
router.get('/admin/products', getAdminProducts)

router.post('/admin/add-product', postAddProduct);


// exports.adminRoutes = router;
module.exports = router