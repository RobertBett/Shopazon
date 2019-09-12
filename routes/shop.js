const path = require('path')
const express = require('express');
const router = express()
const { getProducts, getCart, getShop, getCheckout, getOrders} = require('../controllers/shop');


router.get('/cart',getCart)
router.get('/orders',getOrders)
router.get('/products',getProducts)
router.get('/checkout',getCheckout)

router.get('/',getShop)

module.exports = router