const Product = require('../models/Product');
const Cart = require('../models/Cart');


exports.getCart = (req,res, next) =>{
    Cart.fetchCart(({products})=>{
        const cartProducts = products.forEach(product => {
            console.log(product, 'THESE ARE THE CART PRODUCTS??')
            Product.findById(product.id, (product)=>{
                console.log(product, 'THESE ARE THE CART PRODUCTS??')
            })
        });

        res.render('shop/cart', {
            pageTitle: 'Cart',
            path:'/cart',
            formsCSS: true,
            productCSS: true,
            activeAddProduct: true
        });
    })

};

exports.getOrders = (req,res, next) =>{
    res.render('shop/orders', {
        pageTitle: 'orders',
        path:'/orders',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true
    });
};

exports.getCheckout = (req,res, next) =>{
    res.render('shop/Checkout', {
        pageTitle: 'Checkout',
        path:'/checkout',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true
    });
};
exports.getProducts = (req,res, next)=>{
    Product.fetchAll((products)=> {
       res.render('shop/product-list',{
           products,
           pageTitle:'Shop',
           path:'/products',
           hasProducts: products.length > 0,
           activeShop:true,
           productCSS: true,
       });
    });

};

exports.getProductDetail = (req,res,next) =>{
    const { productId } = req.params;
    Product.findById(productId, (product)=>{
        res.render('shop/product-detail',{
            product,
            pageTitle:'Shop',
            path:`/products/${product.id}`,
            activeShop:true,
            productCSS: true,
        })
    })

}

exports.postCartItem = ( req, res, next) =>{
    const { productId } = req.params;
    Product.findById(productId, (product)=>{
        Cart.addProduct(productId, product.price,(cart)=>{
            res.redirect('/cart')
        })
    })
}



exports.getShop = (req,res, next)=>{
    Product.fetchAll((products)=> {
       res.render('shop/index',{
           products,
           pageTitle:'Shop',
           path:'/',
           hasProducts: products.length > 0,
           activeShop:true,
           productCSS: true,
       });
    });

};