const Product = require('../../models/Product');
const ITEMS_PER_PAGE = 1; 

exports.getShop = (req,res, next)=>{
    const page = +req.query.page || 1;
    let totalItems;

    Product.find()
    .count()
    .then((numProducts) => {
        totalItems = numProducts;
        return Product.find()
        .skip((page -1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
    })
    .then((products) => {
        console.log(page, 'WHAT ARE YOU??')
        res.render('shop/index',{
            products,
            pageTitle:'Shop',
            path:'/',
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page -1,
            lastPage: Math.ceil(totalItems/ ITEMS_PER_PAGE),
            hasProducts: products.length > 0,
            activeShop:true,
            productCSS: true,
        });    
    }).catch((err) => {
        console.error(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.getProducts = (req,res, next)=>{
    const page = +req.query.page || 1;
    let totalItems;

    Product.find()
    .count()
    .then((numProducts) => {
        totalItems = numProducts;
        return Product.find()
        .skip((page -1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
    })
    .then((products) => {
        res.render('shop/product-list',{
            products,
            pageTitle:'Shop',
            path:'/products',
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page -1,
            lastPage: Math.ceil(totalItems/ ITEMS_PER_PAGE),
            hasProducts: products.length > 0,
            activeShop:true,
            productCSS: true,
        });    
    }).catch((err) => {
        console.error(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.getProductDetail = (req,res,next) =>{
    const { productId } = req.params;
    Product.findById(productId)
    .then((product) => {
        res.render('shop/product-detail',{
            product,
            pageTitle:'Shop',
            path:`/product/${product._id}`,
            activeShop:true,
            productCSS: true,
        })
    }).catch((err) => {
        console.error(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}