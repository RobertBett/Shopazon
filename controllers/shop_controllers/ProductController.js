const Product = require('../../models/Product');


exports.getShop = (req,res, next)=>{
    const isLoggedIn = req.session && req.session.isLoggedIn
    Product.find()
    .then((products) => {
        res.render('shop/index',{
            products,
            pageTitle:'Shop',
            path:'/',
            hasProducts: products.length > 0,
            activeShop:true,
            productCSS: true,
            isLoggedIn,
        });    
    }).catch((err) => {
        console.error(err)
    });
};

exports.getProducts = (req,res, next)=>{
    const isLoggedIn = req.session && req.session.isLoggedIn
    Product.find()
    .then(products => {
        console.log(products)
        res.render('shop/product-list',{
            products,
            pageTitle:'Shop',
            path:'/products',
            hasProducts: products.length > 0,
            activeShop:true,
            productCSS: true,
            isLoggedIn,
        });
    }).catch((err) => {
        console.log(err)
    });
};

exports.getProductDetail = (req,res,next) =>{
    const isLoggedIn = req.session && req.session.isLoggedIn
    const { productId } = req.params;
    Product.findById(productId)
    .then((product) => {
        res.render('shop/product-detail',{
            product,
            pageTitle:'Shop',
            path:`/product/${product._id}`,
            activeShop:true,
            productCSS: true,
            isLoggedIn,
        })
    }).catch((err) => {
        console.error(err);
    });
}