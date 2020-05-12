const db = require ('../utils/database');

const Cart = require('./Cart');



// const getProductsFromFile =(done) =>{
// // CHECK IF THE FILE EXISTS AKA IF THERE'S ANY EXISTING PRODUCTS AND IF THERE ISNT IT RETURNS AN EMPTY ARRAY
//     fs.readFile(filePath, (err, fileContent)=>{
//         if(err){
//             return done([])
//         }
//         done(JSON.parse(fileContent));
//     });
// }

module.exports = class Product{
    constructor(id,{ title, description,imageUrl, price}){
        this.id = id || Math.random().toString();
        this.title = title;
        this.description = description;
        this.imageUrl = imageUrl;
        this.price = price
    }

    save(){
        //FIRST ARG IS FOR THE ROOT DIRECTORY 2ND IS FOR THE FOLDER 3RD IS FOR THE FILE NAME
        // const filePath = path.join(rootDirectory, 'data', 'products.json' );
        // getProductsFromFile(products =>{
        //     const existingProductIndex = products.findIndex((product) => product.id === this.id)
        //     if(existingProductIndex !== -1){
        //         const updatedProducts = [...products];
        //         updatedProducts[existingProductIndex] = this;
        //         fs.writeFile(filePath, JSON.stringify(updatedProducts), (err)=>{
        //             console.log(err);
        //         })

        //     }else{ 
        //         products.push(this) 
        //         fs.writeFile(filePath, JSON.stringify(products), (err)=>{
        //             console.log(err);
        //         })
        //     }
            
        // })
        db.execute('INSERT INTO products (title, price, description, imageUrl) VALUES(?,?,?,?)'
        ,[this.title, this.price, this.description, this.imageUrl]
        );
    }

    static fetchAll(){
       return db.execute('SELECT * FROM products')
    }
    
    static deleteById(id, done){
        // getProductsFromFile(products =>{
        //     const deletedProduct = products.find(product => product.id == id)
        //     const newProducts = products.filter((product) => product.id !== id)
        //     fs.writeFile(filePath, JSON.stringify(newProducts), (err)=>{
        //         Cart.deleteProductFromCart(id,deletedProduct.price)
        //     })

        // })
        done()
    }
    static findById(id, done){
        // getProductsFromFile(products=> {
        //  const product = products.find(product => product.id === id)
        //  done(product)
        // })
       return db.execute('SELECT * FROM products WHERE products.id = ?', [id])
    }
}