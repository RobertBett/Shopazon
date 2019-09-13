const fs = require('fs');
const path = require('path');
const rootDirectory = require('../utils/path')

const filePath = path.join(rootDirectory, 'data', 'cart.json' );

const getCartFromFile =(done) =>{
    // CHECK IF THE FILE EXISTS AKA IF THERE'S ANY EXISTING PRODUCTS AND IF THERE ISNT IT RETURNS AN EMPTY ARRAY
        fs.readFile(filePath, (err, fileContent)=>{
            if(err){
                return done([])
            }
            done(JSON.parse(fileContent));
        });
}

module.exports = class Cart{
    // constructor(){
    //     this.products = []
    //     this.totalPrice = 0
    // }

    static addProduct(id, productPrice, done){
       // fetch the previous cart
       fs.readFile(filePath, (err, fileContent)=>{
           let cart = { products: [], totalPrice:0}
           if(!err){
             cart = JSON.parse(fileContent);
           }

       // Analyze the cart => find the existing product
           const existingProductIndex = cart.products.findIndex(product => product.id == id)
           const existingProduct = cart.products[existingProductIndex];
           let updatedProduct
       // Add new product/ increase quantity
           if(existingProduct){
                updatedProduct = {...existingProduct}
                updatedProduct.quantity = updatedProduct.quantity +1;
                cart.products = [...cart.products]
                cart.products[existingProductIndex] = updatedProduct
           }else{
               updatedProduct= { id , quantity: 1};
               cart.products = [...cart.products, updatedProduct]
           }
           cart.totalPrice = cart.totalPrice + + productPrice
           fs.writeFile(filePath, JSON.stringify(cart), (err)=>{
            console.log(err);
            })
            done(cart)
        });
    }

    static fetchCart(done){
        getCartFromFile(done)
    }
}