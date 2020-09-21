const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const Order = require("../../models/Order");

exports.getOrders = (req,res, next) =>{
    Order.find({ 'user.userId': req.user._id})
    .then( orders => {
        res.render('shop/orders', {
            pageTitle: 'orders',
            orders,
            path:'/orders',
            formsCSS: true,
            productCSS: true,
            activeAddProduct: true,
        });
    })
    .catch( err => {
        console.error(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.getInvoice = (req, res, next ) =>{
    const { orderId } = req.params;
    Order.findById(orderId)
    .then((order) => {
        if(!order){
           return next(new Error('Invoice Order not found'))
        };
        if(order.user.userId.toString() !== req.user._id.toString()){
            return next(new Error('Unauthorized'));
        };
        const invoiceName = 'invoice_' + orderId + '.pdf';
        const invoicePath = path.join('data', 'invoices', invoiceName);
        const pdfDoc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
        pdfDoc.pipe(fs.createWriteStream(invoicePath));
        pdfDoc.pipe(res);
        pdfDoc.text('Hello World');
        pdfDoc.fontSize(26).text('Invoice', {
            underline:true
        });
        pdfDoc.text('--------------------');
        order.products.forEach((product) => {
            pdfDoc.text(`${product.productData.title} x ${product.quantity} $${product.productData.price}`);
        })
        pdfDoc.end();

        // fs.readFile(invoicePath,(err, data)=>{
        //     if(err){
        //         return next();
        //     };

        // });
        // const file = fs.createReadStream(invoicePath);
        // file.pipe(res);
    })
    .catch((value) => {
        console.error(value);
    })
};


exports.getCheckout = (req,res, next) =>{
    res.render('shop/Checkout', {
        pageTitle: 'Checkout',
        path:'/checkout',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true,
    });
};

exports.postOrder = (req, res, next) =>{
    req.user.populate('cart.items.productId')
    .execPopulate()
    .then(user => {
        const products = user.cart.items.map((i) => {
            console.log(i.productId._doc)
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