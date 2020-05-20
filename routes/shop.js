const express = require('express');
const router = express();
const { getCart, postCartItem,postCartDelete,
        postCartItemDelete,postAddCartItem } = require('../controllers/shop_controllers/CartController');
const { getCheckout, getOrders, postOrder } = require('../controllers/shop_controllers/OrderController');
const {getProducts, getShop,getProductDetail} = require('../controllers/shop_controllers/ProductController');

// router.get('/cart',getCart);
// router.post('/add-to-cart/:productId',postCartItem);
// router.get('/orders',getOrders);
router.get('/products',getProducts);
router.get('/product/:productId',getProductDetail);
// router.get('/checkout',getCheckout);
// router.post('/cart-delete-item/:productId', postCartDelete);
// router.post('/cart-delete-one-item/:productId', postCartItemDelete);
// router.post('/cart-add-one-item/:productId', postAddCartItem);
// router.post('/create-order', postOrder);



router.get('/',getShop)

module.exports = router;