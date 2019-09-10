const path = require('path')
const express = require('express');
const router = express()
const rootDirectory = require('../utils/path')

router.get('/',(req,res, next)=>{
    res.sendFile(path.join(rootDirectory, 'views', 'shop.html'));
})

module.exports = router