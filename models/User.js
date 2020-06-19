const mongoose = require('mongoose'); // Erase if already required
const Product = require('./Product');
const Order = require('./Order');
const Schema = mongoose.Schema;
// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    cart:{
        items:[{ 
            productId: { 
                type: Schema.Types.ObjectId, 
                required:true,
                ref: 'Product' 
            }, 
            quantity:{ 
                type: Number, 
                required: true
            }
        }]
    },
});

// methods key allows you to add your own custom methods
userSchema.methods.addToCart = function (product) {
    let quantity = 1; 
    const cartProductIndex = this.cart.items.findIndex(cartProduct => {
            return cartProduct.productId.equals(product._id);
        });

    const updatedCartItems = [ ...this.cart.items];

    if(cartProductIndex >= 0){
        quantity = this.cart.items[cartProductIndex].quantity + 1 ;
        updatedCartItems[cartProductIndex].quantity = quantity;
    }
    else{
        updatedCartItems.push({ 
            productId: product._id, 
            quantity
        });
    }

    const updatedCart = { 
        items: updatedCartItems
    }; 
    this.cart = updatedCart;

    return this.save();
};

userSchema.methods.deleteCartItem = function(productId){
    const updatedCartItems = this.cart.items.filter((item) => item.productId.toString() !== productId.toString())
    this.cart.items = updatedCartItems;
    return this.save();
}

userSchema.methods.clearCart = function () {
  this.cart.items = [];
  this.save();
}

//Export the model
module.exports = mongoose.model('User', userSchema);


// const { getDb } = require('../utils/database');
// const { ObjectId } = require('mongodb');
// class User {
//     constructor( username, email, cart, userId){
//         this.username = username;
//         this.email = email;
//         this.cart = !cart? {items:[]} :cart;
//         this.userId = userId && ObjectId(userId);
//     }

//     save(){
//         const db = getDb();
//         db.collection('user').insertOne(this)
//             .then()
//             .catch((err) => {
//                 console.error(err);    
//             });
//     }
//     addOrder(){
//         const db = getDb();
//         return this.getCart()
//             .then((products) => {
//                 const order = {
//                     items:products,
//                     user:{
//                         _id: new ObjectId(this.userId),
//                         username:this.username,
//                         email: this.email,
//                     }
//                 }; 
//                 return db.collection('orders').insertOne(order)
//             })
//             .then(() => {
//                 this.cart = { items:[]};
//                 return db.collection('user')
//                 .updateOne(
//                     { _id: this.userId}, 
//                     { $set:{ cart:{ items:[] } } } 
//                 );
//             }).catch((err) => {
//             console.error(err);  
//             });
//     }
//     getOrders(){
//         const db = getDb();
//         return db.collection('orders').find({'user._id': new ObjectId(this.userId)}).toArray();
//     }

//     static findById(userId){
//         const db = getDb();
//         return db.collection('user').findOne({ _id: ObjectId(userId) })
//             .then((user) => {
//                 return user;
//             }).catch((err) => {
//                 console.error(err);
 
//             });
//     }
// }


// module.exports = User;