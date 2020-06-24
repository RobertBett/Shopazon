const Order = require("../../models/Order");



exports.getOrders = (req,res, next) =>{
    const isLoggedIn = req.session && req.session.isLoggedIn
    Order.find({ 'user.userId': req.user._id})
    .then( orders => {
        res.render('shop/orders', {
            pageTitle: 'orders',
            orders,
            path:'/orders',
            formsCSS: true,
            productCSS: true,
            activeAddProduct: true,
            isLoggedIn
        });
    })
    .catch( err => {
        console.error(err);
    });
};

exports.getCheckout = (req,res, next) =>{
    const isLoggedIn = req.session && req.session.isLoggedIn
    res.render('shop/Checkout', {
        pageTitle: 'Checkout',
        path:'/checkout',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true,
        isLoggedIn
    });
};

exports.postOrder = (req, res, next) =>{
    req.user.populate('cart.items.productId')
    .execPopulate()
    .then(user => {
        const products = user.cart.items.map((i) => {
            console.log(i.productId._doc)
            return { productData:{ ...i.productId._doc }, quantity: i.quantity}
        });
        console.log(products)
        const newOrder = new Order({
            user:{
                userName: req.user.userName,
                userId: req.user._id,
            },
            products
        });
        newOrder.save();
    })
    .then(() => {
        req.user.clearCart();
        res.redirect('/orders');
    }).catch((err) => {
        console.error(err); 
    });
}