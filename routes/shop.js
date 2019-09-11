const path = require('path')
const express = require('express');
const router = express()
const rootDirectory = require('../utils/path')
const { products} = require('./admin');

router.get('/',(req,res, next)=>{
    res.render('shop',{
        products,
        pageTitle:'Shop',
        path:'/',
        hasProducts: products.length > 0,
        activeShop:true,
        productCSS: true,
    })
    console.log(products, 'TEST')
})

module.exports = router