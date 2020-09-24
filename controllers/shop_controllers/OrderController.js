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
        pdfDoc.fontSize(20).text('Invoice', {
            underline:true
        });
        let totalPrice = 0;
        order.products.forEach((product) => {
            totalPrice += product.quantity * product.productData.price;
            pdfDoc.fontSize(15).text(`${product.productData.title} x ${product.quantity} $${product.productData.price}`,{
                bulletRadius:true,
            });
        });
        pdfDoc.text('--------------------');
        pdfDoc.fontSize(15).text(`Total Price $${totalPrice}`);
        pdfDoc.end();
    })
    .catch((value) => {
        console.error(value);
    });
};
