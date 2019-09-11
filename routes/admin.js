const express = require('express');
const router = express.Router();

const products =[]

router.get('/add-product', (req, res, next)=>{
    res.render('add-product', {
            pageTitle: 'Add Product',
            path:'/admin/add-product',
            formsCSS: true,
            productCSS: true,
            activeAddProduct: true
        })
})

router.post('/add-product',(req,res, next)=>{
    const {title} = req.body
    console.log(title)
    products.push({title})
    res.redirect('/');
})


exports.adminRoutes = router;
exports.products = products