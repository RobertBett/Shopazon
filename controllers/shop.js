const Product = require('../models/Product');
const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');


exports.getCart = (req,res, next) =>{
        req.user.getCart({ where:{ userId: req.user.id}})
            .then((cart) => {
                return cart.getProducts()
                .then((products) => {
                    res.render('shop/cart', {
                        pageTitle: 'Cart',
                        products,
                        path:'/cart',
                        formsCSS: true,
                        productCSS: true,
                        activeAddProduct: true
                    });
                })
            })
            .catch((err) => {
                console.log(err)
            });
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

exports.postCartItem = ( req, res, next) =>{
    const { productId } = req.params;
    let localCart;
    req.user.getCart({ where:{ userId: req.user.id}})
    .then((cart) => {
        localCart = cart
        return cart.getProducts({ where:{ id:productId }})
    })        
    .then((products) => {
        // If product is already in cart;
        if(products.length > 0){ 
            console.log('IM TIRED')
           return CartItem.update({
                quantity: products[0].cartItem.quantity +=1,
                price:products[0].price * products[0].cartItem.quantity, 
            },{ where:{ productId }})
        }
        console.log('IM TIRED TOO')
       return Product.findByPk(productId)
       // Adds a new product if none existed
       .then((product) => {
           return localCart.addProduct(product,{ through: { quantity:1, price: product.price}})
       }).catch((err) => {
           console.log(err);
       }); 
     })
     .then(() => {
        res.redirect('/cart');
     })
     .catch((err) => {
         console.log(err)
     });
}

exports.postCartDelete = ( req, res, next) =>{
    const { productId } = req.params;
    CartItem.destroy({ where:{ productId } })
    res.redirect('/cart') 
}



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