const fs = require('fs');
const path = require('path');
const rootDirectory = require('../utils/path')

const filePath = path.join(rootDirectory, 'data', 'products.json' );

const getProductsFromFile =(done) =>{
// CHECK IF THE FILE EXISTS AKA IF THERE'S ANY EXISTING PRODUCTS AND IF THERE ISNT IT RETURNS AN EMPTY ARRAY
    fs.readFile(filePath, (err, fileContent)=>{
        if(err){
            return done([])
        }
        done(JSON.parse(fileContent));
    });
}

module.exports = class Product{
    constructor({title, description,imageUrl, price}){
        this.id = Math.random().toString();
        this.title = title;
        this.description = description;
        this.imageUrl = imageUrl;
        this.price = price
    }

    save(){
        //FIRST ARG IS FOR THE ROOT DIRECTORY 2ND IS FOR THE FOLDER 3RD IS FOR THE FILE NAME
        // const filePath = path.join(rootDirectory, 'data', 'products.json' );
        getProductsFromFile(products =>{
            products.push(this)
            fs.writeFile(filePath, JSON.stringify(products), (err)=>{
                console.log(err);
            })
        })
    }

    static fetchAll(done){
        getProductsFromFile(done)
    }
    
    static findById(id, done){
        getProductsFromFile(products=> {
         const product = products.find(product => product.id === id)
         done(product)
        })
    }
}