const Product = require('../models/Product');


exports.getAddProduct =  (req, res, next)=>{
    const isLoggedIn = req.session && req.session.isLoggedIn
    res.render('admin/add-edit-product', {
            pageTitle: 'Add Product',
            path:'/admin/add-product',
            edit: false,
            isLoggedIn
        });
};

exports.getEditProduct =  (req, res, next)=>{
    const isLoggedIn = req.session && req.session.isLoggedIn
    const {edit} = req.query
    const {productId} = req.params
    Product.findById(productId)
    .then((product) => {
        res.render('admin/add-edit-product', {
            pageTitle: 'Edit Product',
            path:`/admin/edit-product${productId}`,
            isLoggedIn,
            product,
            edit,
        });  
    }).catch((err) => {
        console.log(err)
    });

};

exports.getAdminProducts = (req,res, next)=>{
    const isLoggedIn = req.session && req.session.isLoggedIn
    Product.find()
    .then(products => {
        res.render('admin/admin-product-list',{
            products,
            pageTitle:'Admin Products',
            path:'/admin/products',
            hasProducts: products.length > 0,
            activeShop:true,
            productCSS: true,
            isLoggedIn
        });
    }).catch((err) => {
        console.log(err);
    });

};

exports.postAddProduct = (req,res, next)=>{
    const {title, price, imageUrl, description} = req.body;
    const userId = req.user._id;
    const product = new Product({
        title, 
        price, 
        imageUrl, 
        description,
        userId
    })
    product.save()
    .then((result) => {
        res.redirect('/');
    })
    .catch((err) => {
        console.log(err);
    });
};

exports.postEditProduct = (req, res, next) =>{
    const {productId} = req.params;
    const { title, price, imageUrl, description } = req.body;
    const userId = req.user._id;
    Product.findByIdAndUpdate( productId, {       
        title, 
        price, 
        imageUrl, 
        description,
        userId,
    })
    .then(() => {
        res.redirect('/admin/products')
    }).catch((err) => {
       console.error(err); 
    });
};

exports.postDeleteProduct = (req, res, next) =>{
    const { productId } = req.params;
    Product.findByIdAndDelete(productId)
    .then(() => {
        res.redirect('/admin/products');
    }).catch((err) => {
        console.log(err);
    });
};
