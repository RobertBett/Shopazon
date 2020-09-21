const express = require('express');
const router = express();
const { getCart, postCartItem,postCartDelete,
        postCartItemDelete,postAddCartItem } = require('../controllers/shop_controllers/CartController');
const { getCheckout, getOrders, postOrder, getInvoice } = require('../controllers/shop_controllers/OrderController');
const {getProducts, getShop,getProductDetail} = require('../controllers/shop_controllers/ProductController');
const isAuth = require('../middleware/is-auth');

router.get('/cart',isAuth, getCart);
router.get('/orders/:orderId', isAuth, getInvoice)
router.post('/add-to-cart/:productId',isAuth, postCartItem);
router.get('/orders',isAuth, getOrders);
router.get('/products', getProducts);
router.get('/product/:productId', getProductDetail);
// // router.get('/checkout',getCheckout);
router.post('/cart-delete-item/:productId',isAuth,  postCartDelete);
router.post('/cart-delete-one-item/:productId',isAuth,  postCartItemDelete);
// router.post('/cart-add-one-item/:productId', postAddCartItem);
router.post('/create-order',isAuth,  postOrder);



router.get('/',getShop)

module.exports = router;