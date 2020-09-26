const { validationResult } = require('express-validator');
const Product = require('../models/Product');
const fileHandler = require('../utils/file');
const ITEMS_PER_PAGE = 5; 


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
    const page = +req.query.page || 1;
    let totalItems;

    Product.find({ userId: req.user._id})
    .count()
    .then((numProducts) => {
        totalItems = numProducts;
        return Product.find({ userId: req.user._id})
        .skip((page -1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
    })
    .then(products => {
        res.render('admin/admin-product-list',{
            products,
            pageTitle:'Admin Products',
            path:'/admin/products',
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page -1,
            lastPage: Math.ceil(totalItems/ ITEMS_PER_PAGE),
            hasProducts: products.length > 0,
            activeShop:true,
            productCSS: true,
            validationErrors:[]
        });
    })
    .catch((err) => {
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
    const imagePath = `${imageUrl.path}`;
    const product = new Product({
        title,
        price, 
        imagePath, 
        description,
        userId
    })
    product.save()
    .then(() => {
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

        if(imageUrl)imagePath = `${imageUrl.path}`

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

exports.deleteProduct = (req, res, next) =>{
    const { productId } = req.params;
    Product.findById(productId)
    .then((product) => {
        fileHandler.deleteFile(`${product.imagePath}`)
        req.user.deleteCartItem(productId)
        return Product.deleteOne({_id:productId, userId:req.user._id});
    })
    .then(() => {
        res.status(200).json({ message: 'Success!!'});
    }).catch((err) => {
        console.error(err);
        res.status(500).json({ message: 'Failure'})
    });
};
