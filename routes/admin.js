const express = require('express');
const { body } = require('express-validator/check');
const router = express.Router();
const { getAddProduct, postAddProduct,
        getAdminProducts, getEditProduct, 
        postEditProduct, postDeleteProduct
     } = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');


const validations = [
     body('title',
     'Title is too short and/or Blank'
     ).isLength({ min: 5 })
     .isString(),
     body('description',
     'Description is too short and/or Blank'
     ).isLength({ min: 5, max: 400 })
     .trim(),
     body('price',
     'Please enter a number'
     ).isFloat(),
]

router.get('/admin/add-product',isAuth, getAddProduct)
router.get('/admin/edit-product/:productId',isAuth, getEditProduct)
router.get('/admin/products', isAuth,getAdminProducts)

router.post('/admin/add-product', isAuth, validations , postAddProduct);
router.post('/admin/edit-product/:productId', isAuth, validations , postEditProduct);
router.post('/admin/delete-product/:productId', isAuth, postDeleteProduct)


// exports.adminRoutes = router
module.exports = router;