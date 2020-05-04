const Product = require('../models/Product');
const Cart = require('../models/Cart');


exports.getCart = (req,res, next) =>{
        Cart.getCart(cart =>{
            Product.fetchAll(products =>{
                const cartProducts = [];
                for(product of products){
                    const cartProductData = cart.products.find(prod => prod.id === product.id)
                    console.log(cartProductData, 'TESTIGNG')
                    if(cartProductData){
                        cartProducts.push({productData: product, quantity: cartProductData.quantity});
                    }
                }
                console.log(cart) 
                res.render('shop/cart', {
                    pageTitle: 'Cart',
                    products: cartProducts,
                    path:'/cart',
                    formsCSS: true,
                    productCSS: true,
                    activeAddProduct: true
                });
            })
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
        Cart.addProduct(productId, product.title, product.price,(cart)=>{
            console.log(cart)
            res.redirect('/cart')
        })
    })
}

exports.postCartDelete = ( req, res, next) =>{
    const { productId } = req.params;
    Product.findById(productId, (product) =>{
      Cart.deleteProductFromCart(productId, product.price)
      res.redirect('/cart')
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