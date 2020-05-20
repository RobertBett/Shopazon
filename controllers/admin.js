const Product = require('../models/Product');
const CartItem = require('../models/CartItem');
const Cart = require('../models/Cart');

exports.getAddProduct =  (req, res, next)=>{
    res.render('admin/add-edit-product', {
            pageTitle: 'Add Product',
            path:'/admin/add-product',
            edit: false
        });
};

exports.getEditProduct =  (req, res, next)=>{
    const {edit} = req.query
    const {productId} = req.params
    Product.findById(productId)
    .then((product) => {
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
    Product.fetchAll()
    .then(products => {
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
    const {title, price, imageUrl, description} = req.body;
    const product = new Product(title, price, imageUrl, description)
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
    const {title, price, imageUrl, description} = req.body;
    
    req.user.getCart({ where:{ userId: req.user.id}})
    .then((cart) => {
        Product.update({
            title,
            price,
            imageUrl,
            description
        },{ where:{ id : productId} })
        return cart.getProducts({ where:{ id:productId }})
    })
    .then(([product]) => {
        return product && CartItem.update(
            { price:price * product.cartItem.quantity }  
            ,{ where:{ productId }}
        ) 
    })
    .then(() => {
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
    .then(() => {
        res.redirect('/admin/products');
    }).catch((err) => {
        console.log(err)
    });
};
