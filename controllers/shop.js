const Product = require('../models/Product');



exports.getCart = (req,res, next) =>{
    res.render('shop/cart', {
        pageTitle: 'Cart',
        path:'/cart',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true
    });
};

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



exports.getProducts = (req,res, next)=>{
     Product.fetchAll((products)=> {
        res.render('shop/product-list',{
            products,
            pageTitle:'Shop',
            path:'/products',
            hasProducts: products.length > 0,
            activeShop:true,
            productCSS: true,
        });
     });

};

exports.getShop = (req,res, next)=>{
    Product.fetchAll((products)=> {
       res.render('shop/index',{
           products,
           pageTitle:'Shop',
           path:'/',
           hasProducts: products.length > 0,
           activeShop:true,
           productCSS: true,
       });
    });

};