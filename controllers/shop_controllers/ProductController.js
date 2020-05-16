const Product = require('../../models/Product');



exports.getShop = (req,res, next)=>{
    Product.findAll()
    .then((products) => {
        res.render('shop/index',{
            products,
            pageTitle:'Shop',
            path:'/',
            hasProducts: products.length > 0,
            activeShop:true,
            productCSS: true,
        });    
    }).catch((err) => {
        console.log(err)
    });

};

exports.getProducts = (req,res, next)=>{
    Product.findAll()
    .then(products => {
        res.render('shop/product-list',{
            products,
            pageTitle:'Shop',
            path:'/products',
            hasProducts: products.length > 0,
            activeShop:true,
            productCSS: true,
        });
    }).catch((err) => {
        console.log(err)
    });
};

exports.getProductDetail = (req,res,next) =>{
    const { productId } = req.params;
    console.log(req.params, 'WHAT IS IN HERE!!!')
    Product.findByPk(productId)
    .then((product) => {
        console.log(product.id, 'WHAT COMES FIRST!!@####@!!!')
        res.render('shop/product-detail',{
            product:product,
            pageTitle:'Shop',
            path:`/product/${product.id}`,
            activeShop:true,
            productCSS: true,
        })
    }).catch((err) => {
        console.log(err)
    });
}