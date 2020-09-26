const Order = require('../../models/Order');

const stripe = require('stripe')(process.env.STRIPE_KEY);


exports.getCheckout = (req,res, next) =>{
    req.user.populate('cart.items.productId')
    .execPopulate()
    .then(( user) => {
        const products = user.cart.items;

        let totalPrice = 0;
        products.forEach((product) => {
            totalPrice += product.quantity * product.productId.price;
        });

        return stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: products.map((product) => {
                return {
                    name: product.productId.title,
                    description: product.productId.description,
                    amount: product.productId.price * 100,
                    currency: 'usd',
                    quantity: product.quantity
                };
            }),
            success_url: req.protocol + '://' + req.get('host') +'/checkout/success',
            cancel_url: req.protocol + '://' + req.get('host') +'/checkout/cancel',
        })
        .then((session) => {
            res.render('shop/Checkout', {
                pageTitle: 'Checkout',
                path:'/checkout',
                products,
                formsCSS: true,
                productCSS: true,
                totalPrice,
                sessionId: session.id,
                activeAddProduct: true,
            });  
        })
    })
    .catch((err) => {
        console.error(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.getCheckoutSuccess = (req, res, next) =>{
    req.user.populate('cart.items.productId')
    .execPopulate()
    .then(user => {
        const products = user.cart.items.map((i) => {
            return { productData:{ ...i.productId._doc }, quantity: i.quantity}
        });
        const newOrder = new Order({
            user:{
                userName: req.user.userName,
                userId: req.user._id,
            },
            products
        });
        newOrder.save();
    })
    .then(() => {
        req.user.clearCart();
        res.redirect('/orders');
    }).catch((err) => {
        console.error(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};