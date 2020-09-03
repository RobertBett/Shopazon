const { validationResult } = require('express-validator');
const Product = require('../models/Product');


exports.getAddProduct =  (req, res, next)=>{
    res.render('admin/add-edit-product', {
        pageTitle: 'Add Product',
        path:'/admin/add-product',
        edit: false,
        oldInput:{},
        errorMessage:null,
        validationErrors:[]
    });
};

exports.getEditProduct =  (req, res, next)=>{
    const {edit} = req.query
    const {productId} = req.params;
    Product.findById(productId)
    .then((product) => {
        res.render('admin/add-edit-product', {
            pageTitle: 'Edit Product',
            path:`/admin/edit-product/${productId}`,
            product,
            edit,
            errorMessage:null,
            validationErrors:[]
        });  
    }).catch((err) => {
        console.error(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.getAdminProducts = (req,res, next)=>{
    Product.find({ userId: req.user._id})
    .then(products => {
        res.render('admin/admin-product-list',{
            products,
            pageTitle:'Admin Products',
            path:'/admin/products',
            hasProducts: products.length > 0,
            activeShop:true,
            productCSS: true,
            validationErrors:[]
        });
    }).catch((err) => {
        console.error(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.postAddProduct = (req,res, next)=>{
    const {title, price, image, description} = req.body;
    const imageUrl = req.file;
    const userId = req.user._id;
    const errors = validationResult(req);

    const badRes = (errorMessage,validationErrors) => {
        return res.status(422).render('admin/add-edit-product', {
            pageTitle: 'Add Product',
            path:'/admin/add-product',
            edit: false,
            productCSS: true,
            activeAddProduct: true,
            oldInput:{ title, price, image, description },
            errorMessage,
            validationErrors, 
        });
    }
    if(!errors.isEmpty()) return badRes(errors.array()[0].msg,errors.array());
    if(!imageUrl) return badRes('Attached file is not an image', []);
    const imagePath = `/${imageUrl.path}`;
    const product = new Product({
        title,
        price, 
        imagePath, 
        description,
        userId
    })
    product.save()
    .then((result) => {
        res.redirect('/');
    })
    .catch((err) => {
        console.error(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.postEditProduct = (req, res, next) =>{
    let imagePath;
    const {productId} = req.params;
    const { title, price, description } = req.body;
    const userId = req.user._id;
    const imageUrl = req.file;
    const errors = validationResult(req);

    Product.findById(productId)
    .then((product) => {
        imagePath = product.imagePath;

        if(imageUrl)imagePath = `/${imageUrl.path}`

        if(!errors.isEmpty()) {
            return res.render('admin/add-edit-product', {
                pageTitle: 'Edit Product',
                path:`/admin/edit-product/${productId}`,
                product,
                edit:true,
                oldInput:{ title, price, description },
                errorMessage:errors.array()[0] && errors.array()[0].msg,
                validationErrors: errors.array()
            });  
        };
        
        Product.updateOne( {_id:productId, userId},{       
            title,
            price,
            imagePath, 
            description,
            userId,
        })
        .then(() => {
            res.redirect('/admin/products')
        }).catch((err) => {
            console.error(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
    })
    .catch((err) => {
        console.error(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.postDeleteProduct = (req, res, next) =>{
    const { productId } = req.params;
    Product.deleteOne({_id:productId, userId:req.user._id})
    .then(() => {
        res.redirect('/admin/products');
    }).catch((err) => {
        console.error(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};
