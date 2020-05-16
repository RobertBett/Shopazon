const chalk = require("chalk");
const CartItem = require('../../models/CartItem');

exports.getOrders = (req,res, next) =>{
    res.render('shop/orders', {
        pageTitle: 'orders',
        path:'/orders',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true
    });
};

exports.getCheckout = (req,res, next) =>{
    res.render('shop/Checkout', {
        pageTitle: 'Checkout',
        path:'/checkout',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true
    });
};

exports.postOrder = (req, res, next)=>{
    CartItem.findAll({})
    req.user.getCart({ where:{ userId: req.user.id}})
    .then((cart) => {
        return cart.getProducts({ where:{ id:productId }})
    })
    .then(() => {
        
    })
    .catch((err) => {
        console.error(err);
        
    });
}