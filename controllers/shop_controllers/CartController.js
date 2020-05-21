
const Product = require('../../models/Product');

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





exports.postCartItem = ( req, res, next) =>{
    const { productId } = req.params;

    Product.findById(productId)
    .then((product) => {
        console.log(product,['IN CART'])
        console.log(req.user)
        return req.user.addToCart(product)

    })
    .then((cart) => {
        next()
    })
    .catch((err) => {
        console.error(err);
        
    });

    // let localCart;
    
    // req.user.getCart({ where:{ userId: req.user.id}})
    // .then((cart) => {
    //     localCart = cart
    //     return cart.getProducts({ where:{ id:productId }})
    // })        
    // .then((products) => {
    //     // If product is already in cart;
    //     if(products.length > 0){ 
    //         console.log('IM TIRED')
    //        return CartItem.increment({
    //             quantity: 1,
    //             price:products[0].price * products[0].cartItem.quantity, 
    //         },{ where:{ productId }})
    //     }
    //     console.log('IM TIRED TOO')
    //    return Product.findByPk(productId)
    //    // Adds a new product if none existed
    //    .then((product) => {
    //        return localCart.addProduct(product,{ through: { quantity:1, price: product.price}})
    //    }).catch((err) => {
    //        console.log(err);
    //    }); 
    //  })
    //  .then(() => {
    //     res.redirect('/cart');
    //  })
    //  .catch((err) => {
    //      console.log(err)
    //  });
}

exports.postCartDelete = ( req, res, next) =>{
    const { productId } = req.params;
    CartItem.destroy({ where:{ productId } })
    res.redirect('/cart') 
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
            })
        })
        .then(() => {
            res.redirect('/cart'); 
        })
        .catch((err) => {
            console.error(err,['IS IT THIS ONE??']);
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
        })

    
}
