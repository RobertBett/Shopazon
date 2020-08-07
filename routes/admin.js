const express = require('express');
const router = express.Router();
const { getAddProduct, postAddProduct,
        getAdminProducts, getEditProduct, 
        postEditProduct, postDeleteProduct
     } = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

router.get('/admin/add-product',isAuth, getAddProduct)
router.get('/admin/edit-product/:productId',isAuth, getEditProduct)
router.get('/admin/products', isAuth,getAdminProducts)

router.post('/admin/add-product', isAuth, postAddProduct);
router.post('/admin/edit-product/:productId', isAuth, postEditProduct);
router.post('/admin/delete-product/:productId', isAuth, postDeleteProduct)


// exports.adminRoutes = router
module.exports = router;