const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    title:{
        type: String,
        required: true,
    },
    price:{
        type: Number,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    imageUrl:{
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('Product', productSchema);


// const { ObjectId } = require('mongodb');

// const { getDb } = require('../utils/database');


// class Product {
//     constructor(title, price, imageUrl, description, productId, userId){
//         this.title = title;
//         this.price = price;
//         this.imageUrl = imageUrl,
//         this.description = description;
//         this._id = productId && ObjectId(productId);
//         this.userId = userId;
//     }

//     save(){
//         const db = getDb();
//         let dbOperation;

//         this._id ?
//             dbOperation = db.collection('products')
//                     .updateOne({ _id: this._id }, { $set: this })
//         :
//             dbOperation = db.collection('products')
//                     .insertOne(this)

        
//         return dbOperation
//             .then()
//             .catch((err) => {
//                 console.error(err); 
//             });
//     };

//     static fetchAll() {
//         const db = getDb();
//         return db.collection('products').find().toArray()
//         .then((result) => {
//             return result;
//         }).catch((err) => {
//             console.error(err);  
//         });
//     };

//     static findById(productId){
//         const db = getDb();
//         return db.collection('products').findOne({ _id: ObjectId(productId) })
//         .then((product) => {
//             return product
//         }).catch((err) => {
//             console.error(err);
//         });
//     };

//     static deleteById(productId){
//         const db = getDb();
//         return db.collection('products').deleteOne({ _id: ObjectId(productId)})
//         .then()
//         .catch((err) => {
//             console.error(err);
            
//         });
//     }
// };

// module.exports = Product;