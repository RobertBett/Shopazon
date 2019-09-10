const express = require('express');
const path = require('path');
const rootDirectory = require('../utils/path')

const router = express.Router();

router.post('/product',(req,res, next)=>{
    console.log(req.body)
    res.redirect('/users');
})
router.get('/add-product', (req, res, next)=>{
    res.sendFile(path.join(rootDirectory, 'views', 'add-product.html'))
})

module.exports = router;