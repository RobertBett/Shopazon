


exports.getOrders = (req,res, next) =>{
    req.user.getOrders()
    .then((orders) => {
        console.log(orders, ['THIS SHPULD HAVE ORDERS'])
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
    req.user.addOrder()
    .then((result) => {
        res.redirect('/orders')
    }).catch((err) => {
        console.error(err); 
    });
}