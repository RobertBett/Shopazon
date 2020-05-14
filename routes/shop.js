const path = require('path')
const express = require('express');
const router = express()
const { getProducts, getCart, 
        getShop, getCheckout, getOrders, 
        getProductDetail,postCartItem,postCartDelete,
        postCartItemDelete,postAddCartItem } = require('../controllers/shop');


router.get('/cart',getCart)
router.post('/add-to-cart/:productId',postCartItem)
router.get('/orders',getOrders)
router.get('/products',getProducts)
router.get('/product/:productId',getProductDetail)
router.get('/checkout',getCheckout)
router.post('/cart-delete-item/:productId', postCartDelete)
router.post('/cart-delete-one-item/:productId', postCartItemDelete)
router.post('/cart-add-one-item/:productId', postAddCartItem)


router.get('/',getShop)

module.exports = router