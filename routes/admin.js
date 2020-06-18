const express = require('express');
const router = express.Router();
const { getAddProduct, postAddProduct,
        getAdminProducts, getEditProduct, 
        postEditProduct, postDeleteProduct
     } = require('../controllers/admin')


router.get('/admin/add-product', getAddProduct)
// router.get('/admin/edit-product/:productId', getEditProduct)
// router.get('/admin/products', getAdminProducts)

router.post('/admin/add-product', postAddProduct);
// router.post('/admin/edit-product/:productId', postEditProduct);
// router.post('/admin/delete-product/:productId', postDeleteProduct)


// exports.adminRoutes = router
module.exports = router;