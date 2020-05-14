const Product = require('../models/Product');

exports.getAddProduct =  (req, res, next)=>{
    res.render('admin/add-edit-product', {
            pageTitle: 'Add Product',
            path:'/admin/add-product',
            edit: false
        });
};

exports.getEditProduct =  (req, res, next)=>{
    const {edit} = req.query
    console.log(req.user,'fSDFJNBSDLKJNS')
    const {productId} = req.params
    req.user.getProducts({ where: { id : productId}})
    .then(([product]) => {
        res.render('admin/add-edit-product', {
            pageTitle: 'Edit Product',
            path:`/admin/edit-product${productId}`,
            product,
            edit,
        });  
    }).catch((err) => {
        console.log(err)
    });

};

exports.getAdminProducts = (req,res, next)=>{
    req.user.getProducts()
    .then((products) => {
        res.render('admin/admin-product-list',{
            products,
            pageTitle:'Admin Products',
            path:'/admin/products',
            hasProducts: products.length > 0,
            activeShop:true,
            productCSS: true,
        });
    }).catch((err) => {
        console.log(err);
    });

};

exports.postAddProduct = (req,res, next)=>{
    const {title, price, imageUrl, description, user} = req.body;
    const userId = req.user.id;
    req.user.createProduct({
        title,
        price,
        imageUrl,
        description,
        userId
    })
    .then((result) => {
        res.redirect('/');
        console.log(result, 'POST ADD PRODUCT')
    })
    .catch((err) => {
        console.log(err)
    });
};

exports.postEditProduct = (req, res, next) =>{
    const {productId} = req.params;
    const {title, price, imageUrl, description} = req.body;
    Product.update({
        title,
        price,
        imageUrl,
        description
    },{ 
        where:{ id : productId}
    })
    .then((result) => {
        res.redirect('/admin/products')
    }).catch((err) => {
        console.log(err)
    });
};

exports.postDeleteProduct = (req, res, next) =>{
    const { productId } = req.params;
    Product.destroy({
        where:{ id : productId }
    })
    .then((product) => {
        res.redirect('/admin/products');
    }).catch((err) => {
        console.log(err)
    });
};
