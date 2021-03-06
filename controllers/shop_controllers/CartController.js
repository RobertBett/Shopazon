
const Product = require('../../models/Product');

exports.getCart = (req,res, next) =>{
    req.user.populate('cart.items.productId')
        .execPopulate()
        .then(( user) => {
            const products = user.cart.items;
            res.render('shop/cart', {
                pageTitle: 'Cart',
                products,
                path:'/cart',
                formsCSS: true,
                productCSS: true,
                activeAddProduct: true,
            });
        })
        .catch((err) => {
            console.error(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};


exports.postCartItem = ( req, res, next) =>{
    const { productId } = req.params;

    Product.findById(productId)
    .then((product) => {
        return req.user.addToCart(product)
    })
    .then(() => res.redirect('/cart') )
    .catch((err) => {
        console.error(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}

exports.postCartDelete = ( req, res, next) =>{
    const { productId } = req.params;
    req.user.deleteCartItem(productId)
    .then((value) => {
        res.redirect('/cart') 
    }).catch((err) => {
        console.error(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
    
}

exports.postCartItemDelete = ( req, res, next) =>{
    const { productId } = req.params;
    let productPrice =1;
    Product.findByPk(productId)
        .then((product) => {
            productPrice = product.price;
            CartItem.findAll({where:{ productId }})
            .then(([cartItem]) => {
                if (cartItem.quantity <= 1) {
                    return CartItem.destroy({ where:{ productId } })
                }
                return CartItem.decrement({ quantity: 1, price: productPrice},{where:{ productId }} )
            }).catch((err)=>{
                console.error(err);
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            })
        })
        .then(() => {
            res.redirect('/cart'); 
        })
        .catch((err) => {
            console.error(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        }); 
}

exports.postAddCartItem = ( req, res, next) =>{
    const { productId } = req.params;
    let productPrice;
    Product.findByPk(productId)
        .then((product) => {
            productPrice = product.price;
            CartItem.findAll({where:{ productId}})
            .then(() => {
                CartItem.increment({ quantity: 1, price: productPrice},{where:{ productId }} )
            })
            .catch((err) => {
                console.error(err)
            });
            res.redirect('/cart') 
        }).catch((err)=>{
            console.error(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })

    
}
