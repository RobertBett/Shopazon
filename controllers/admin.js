const Product = require('../models/Product');

exports.getAddProduct =  (req, res, next)=>{
    res.render('admin/add-edit-product', {
            pageTitle: 'Add Product',
            path:'/admin/add-product',
        });
};

exports.getEditProduct =  (req, res, next)=>{
    const {edit} = req.query
    console.log(edit)
    const {productId} = req.params
    Product.findById(productId, (product)=>{
        res.render('admin/add-edit-product', {
            pageTitle: 'Edit Product',
            path:`/admin/edit-product${productId}`,
            product,
            edit,
        });
    })
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