const Product = require('../models/Product');

exports.getAddProduct =  (req, res, next)=>{
    res.render('admin/add-product', {
            pageTitle: 'Add Product',
            path:'/admin/add-product',
            formsCSS: true,
            productCSS: true,
            activeAddProduct: true
        });
};

exports.postAddProduct = (req,res, next)=>{
    const product = new Product(req.body);
    product.save();
    res.redirect('/');
};

exports.getAdminProducts = (req,res, next)=>{
    Product.fetchAll((products)=> {
       res.render('admin/admin-product-list',{
           products,
           pageTitle:'Admin Products',
           path:'/admin/products',
           hasProducts: products.length > 0,
           activeShop:true,
           productCSS: true,
       });
    });

};