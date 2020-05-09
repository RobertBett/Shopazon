const path = require('path')
const express = require('express');
const router = express()
const { getProducts, getCart, 
        getShop, getCheckout, getOrders, 
        getProductDetail,postCartItem,postCartDelete } = require('../controllers/shop');


router.get('/cart',getCart)
router.post('/add-to-cart/:productId',postCartItem)
router.get('/orders',getOrders)
router.get('/products',getProducts)
router.get('/product/:productId',getProductDetail)
router.get('/checkout',getCheckout)
router.post('/cart-delete-item/:productId', postCartDelete)

router.get('/',getShop)

module.exports = router