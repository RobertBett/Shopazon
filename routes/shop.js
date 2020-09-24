const express = require('express');
const router = express();
const { getCart, postCartItem,postCartDelete,
        postCartItemDelete,postAddCartItem } = require('../controllers/shop_controllers/CartController');
const { getOrders, getInvoice } = require('../controllers/shop_controllers/OrderController');
const { getCheckout,getCheckoutSuccess } = require('../controllers/shop_controllers/CheckoutController');
const {getProducts, getShop,getProductDetail} = require('../controllers/shop_controllers/ProductController');
const isAuth = require('../middleware/is-auth');

router.get('/cart',isAuth, getCart);
router.get('/orders/:orderId', isAuth, getInvoice)
router.post('/add-to-cart/:productId',isAuth, postCartItem);
router.get('/orders',isAuth, getOrders);
router.get('/products', getProducts);
router.get('/product/:productId', getProductDetail);
router.get('/checkout', isAuth, getCheckout);
router.get('/checkout/success', isAuth, getCheckoutSuccess);
router.get('/checkout/cancel', isAuth, getCheckout);
router.post('/cart-delete-item/:productId',isAuth,  postCartDelete);
router.post('/cart-delete-one-item/:productId',isAuth,  postCartItemDelete);



router.get('/',getShop)

module.exports = router;