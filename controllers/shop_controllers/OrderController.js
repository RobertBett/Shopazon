const chalk = require("chalk");
const CartItem = require('../../models/CartItem');

exports.getOrders = (req,res, next) =>{
    req.user.getOrders({ include:['products']})
    .then((orders) => {
        res.render('shop/orders', {
        pageTitle: 'orders',
        orders,
        path:'/orders',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true
    });
    })
    .catch((err) => {
        console.error(err);
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

exports.postOrder = (req, res, next) =>{
    let fetchedCart;
    req.user.getCart({ where: { userId: req.user.id}})
    .then((cart) => {
        fetchedCart = cart;
        return cart.getProducts()
    })
    .then((products) => {
        req.user.createOrder()
        .then((order) => {
            return order.addProducts(
                products.map( product =>{
                    product.orderItem = { 
                        quantity: product.cartItem.quantity,
                        orderTotal: product.price * product.cartItem.quantity
                    };
                    return product;
            }));
        }).catch((err) => {
            console.error(err);
        });
    })
    .then(() => {
        return fetchedCart.setProducts(null)
    })
    .then((result) => {
        res.redirect('/orders')
    })
    .catch((err) => {
        console.error(err);
    });
}